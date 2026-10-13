import { NextResponse } from "next/server";
import { z } from "zod";
import { eq, sql } from "drizzle-orm";
import { db, madarasa, wanafunzi } from "@nuru/db";

import { PICHA_IDS, PICHA_UREFU } from "@/lib/darasa/shared";
import { hashPicha, verifyPicha, MAX_ATTEMPTS, LOCK_MS } from "@/lib/darasa/picha.server";
import { setSessionCookies } from "@/lib/darasa/session.server";

export const dynamic = "force-dynamic";

const Body = z.object({
	mwanafunziId: z.string().min(1).max(64),
	picha: z.array(z.enum(PICHA_IDS)).length(PICHA_UREFU),
});

/**
 * Sign in with a picture password. Five wrong tries lock the learner for a minute.
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

	const now = Date.now();
	if (w.lockedUntil && new Date(w.lockedUntil).getTime() > now) {
		return NextResponse.json(
			{ error: "imefungwa", sekunde: Math.ceil((new Date(w.lockedUntil).getTime() - now) / 1000) },
			{ status: 429 },
		);
	}

	let ok: boolean;
	if (!w.pictureHash) {
		if (new Set(picha).size !== picha.length) return NextResponse.json({ error: "picha_zirudiwa" }, { status: 400 });
		await db.update(wanafunzi).set({ pictureHash: await hashPicha(picha) }).where(eq(wanafunzi.id, w.id));
		ok = true;
	} else {
		ok = await verifyPicha(picha, w.pictureHash);
	}

	if (!ok) {
		const failed = w.failedAttempts + 1;
		if (failed >= MAX_ATTEMPTS) {
			await db
				.update(wanafunzi)
				.set({ failedAttempts: 0, lockedUntil: new Date(now + LOCK_MS).toISOString() })
				.where(eq(wanafunzi.id, w.id));
			return NextResponse.json({ error: "imefungwa", sekunde: Math.ceil(LOCK_MS / 1000) }, { status: 429 });
		}
		await db.update(wanafunzi).set({ failedAttempts: failed }).where(eq(wanafunzi.id, w.id));
		return NextResponse.json({ error: "picha_si_sahihi", zimebaki: MAX_ATTEMPTS - failed }, { status: 401 });
	}

	await db
		.update(wanafunzi)
		.set({ failedAttempts: 0, lockedUntil: null, lastSeenAt: sql`now()` as unknown as string })
		.where(eq(wanafunzi.id, w.id));
	const res = NextResponse.json({ ok: true, mwanafunziId: w.id });
	setSessionCookies(res, { m: w.id, d: w.darasaId, iat: Math.floor(now / 1000) }, { id: w.id, jina: w.displayName, darasa: row.darasaName });
	return res;
}
