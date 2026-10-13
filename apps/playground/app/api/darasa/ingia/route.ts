import { NextResponse } from "next/server";
import { z } from "zod";
import { and, eq, isNull, sql } from "drizzle-orm";
import { db, madarasa, wanafunzi } from "@nuru/db";

import { PICHA_IDS, PICHA_UREFU } from "@/lib/darasa/shared";
import { hashPicha, verifyPicha } from "@/lib/darasa/picha.server";
import { setSessionCookies } from "@/lib/darasa/session.server";
import { MAX_ATTEMPTS, LOCK_LEVEL_TEACHER, TokenBuckets, clientIp, lockDurationMs } from "@/lib/darasa/limits";

export const dynamic = "force-dynamic";

const Body = z.object({
	mwanafunziId: z.string().min(1).max(64),
	picha: z.array(z.enum(PICHA_IDS)).length(PICHA_UREFU),
});

// Per IP + darasa: a whole class behind one school NAT signs in at once, so the
// burst is generous. In-memory and per server instance; the database lock below
// is the hard limit.
const buckets = new TokenBuckets(60, 0.5);

const locked = (sekunde: number) => NextResponse.json({ error: "imefungwa", sekunde }, { status: 429 });
const lockedForTeacher = () => NextResponse.json({ error: "imefungwa_mwalimu" }, { status: 423 });

/**
 * Sign in with a picture password. Five wrong tries lock the learner: 1 minute,
 * then 5, then 30, then until a teacher resets their pictures.
 * A learner whose pictures a teacher reset sets new ones here.
 */
export async function POST(req: Request) {
	const parsed = Body.safeParse(await req.json().catch(() => null));
	if (!parsed.success) return NextResponse.json({ error: "ombi_si_sahihi" }, { status: 400 });
	const { mwanafunziId, picha } = parsed.data;

	const [row] = await db
		.select({ w: wanafunzi, darasaName: madarasa.name, archivedAt: madarasa.archivedAt })
		.from(wanafunzi)
		.innerJoin(madarasa, eq(madarasa.id, wanafunzi.darasaId))
		.where(eq(wanafunzi.id, mwanafunziId))
		.limit(1);
	if (!row || row.archivedAt) return NextResponse.json({ error: "mwanafunzi_hayupo" }, { status: 404 });
	const w = row.w;

	const wait = buckets.take(`${clientIp(req.headers)}|${w.darasaId}`);
	if (wait > 0) return locked(wait);

	// First sign-in after a teacher reset: set new pictures. The IS NULL guard makes
	// two parallel setups race safely; only one of them wins.
	if (!w.pictureHash) {
		// A learner who joined with a Logto account signs in through Logto; nobody may
		// claim their row by setting pictures on it.
		if (w.logtoId) return NextResponse.json({ error: "mwanafunzi_hayupo" }, { status: 404 });
		if (new Set(picha).size !== picha.length) return NextResponse.json({ error: "picha_zirudiwa" }, { status: 400 });
		const hash = await hashPicha(picha);
		const [set] = await db
			.update(wanafunzi)
			.set({
				pictureHash: hash,
				failedAttempts: 0,
				lockLevel: 0,
				lockedUntil: null,
				// New pictures sign out every older session for this learner.
				sessionVersion: sql`${wanafunzi.sessionVersion} + 1`,
				lastSeenAt: sql`now()` as unknown as string,
			})
			.where(and(eq(wanafunzi.id, w.id), isNull(wanafunzi.pictureHash), isNull(wanafunzi.logtoId)))
			.returning({ sessionVersion: wanafunzi.sessionVersion });
		if (!set) return NextResponse.json({ error: "picha_si_sahihi", zimebaki: MAX_ATTEMPTS }, { status: 401 });
		return signIn(w, row.darasaName, set.sessionVersion);
	}

	// Reserve an attempt before running scrypt. One UPDATE checks the lock and bumps
	// the counter, so parallel requests cannot all read the same count.
	const [slot] = await db
		.update(wanafunzi)
		.set({ failedAttempts: sql`${wanafunzi.failedAttempts} + 1` })
		.where(
			and(
				eq(wanafunzi.id, w.id),
				sql`(${wanafunzi.lockedUntil} IS NULL OR ${wanafunzi.lockedUntil} <= now())`,
				sql`${wanafunzi.lockLevel} < ${LOCK_LEVEL_TEACHER}`,
				sql`${wanafunzi.failedAttempts} < ${MAX_ATTEMPTS}`,
			),
		)
		.returning({
			failedAttempts: wanafunzi.failedAttempts,
			lockLevel: wanafunzi.lockLevel,
			pictureHash: wanafunzi.pictureHash,
			sessionVersion: wanafunzi.sessionVersion,
		});
	if (!slot) return refused(w.id);

	const ok = slot.pictureHash ? await verifyPicha(picha, slot.pictureHash) : false;

	if (ok) {
		await db
			.update(wanafunzi)
			.set({ failedAttempts: 0, lockLevel: 0, lockedUntil: null, lastSeenAt: sql`now()` as unknown as string })
			.where(eq(wanafunzi.id, w.id));
		return signIn(w, row.darasaName, slot.sessionVersion);
	}

	if (slot.failedAttempts >= MAX_ATTEMPTS) {
		// This request used the last attempt: lock, one level longer than last time.
		const level = slot.lockLevel + 1;
		const ms = lockDurationMs(level);
		await db
			.update(wanafunzi)
			.set({
				failedAttempts: 0,
				lockLevel: level,
				lockedUntil: ms ? (sql`now() + ${`${ms} milliseconds`}::interval` as unknown as string) : null,
			})
			.where(eq(wanafunzi.id, w.id));
		return ms ? locked(Math.ceil(ms / 1000)) : lockedForTeacher();
	}
	return NextResponse.json({ error: "picha_si_sahihi", zimebaki: MAX_ATTEMPTS - slot.failedAttempts }, { status: 401 });
}

/** No attempt was free: say how long to wait, or that the teacher must reset. */
async function refused(id: string) {
	const [cur] = await db
		.select({
			lockLevel: wanafunzi.lockLevel,
			failedAttempts: wanafunzi.failedAttempts,
			sekunde: sql<number | null>`ceil(extract(epoch from (${wanafunzi.lockedUntil} - now())))::int`,
		})
		.from(wanafunzi)
		.where(eq(wanafunzi.id, id))
		.limit(1);
	if (!cur) return NextResponse.json({ error: "mwanafunzi_hayupo" }, { status: 404 });
	if (cur.lockLevel >= LOCK_LEVEL_TEACHER) return lockedForTeacher();
	if (cur.sekunde && cur.sekunde > 0) return locked(cur.sekunde);
	// All attempts are taken by requests still checking; the last of them sets the lock.
	const next = lockDurationMs(cur.lockLevel + 1);
	return next ? locked(Math.ceil(next / 1000)) : lockedForTeacher();
}

function signIn(w: typeof wanafunzi.$inferSelect, darasaName: string, v: number) {
	const res = NextResponse.json({ ok: true, mwanafunziId: w.id });
	setSessionCookies(
		res,
		{ m: w.id, d: w.darasaId, iat: Math.floor(Date.now() / 1000), v },
		{ id: w.id, jina: w.displayName, darasa: darasaName },
	);
	return res;
}
