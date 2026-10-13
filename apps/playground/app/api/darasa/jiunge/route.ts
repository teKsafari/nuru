import { NextResponse } from "next/server";
import { z } from "zod";
import { and, eq, sql } from "drizzle-orm";
import { db, wanafunzi } from "@nuru/db";

import { findDarasaByCode } from "@/lib/darasa/queries.server";
import { normalizeCode, normalizeName, PICHA_IDS, PICHA_UREFU } from "@/lib/darasa/shared";
import { hashPicha } from "@/lib/darasa/picha.server";
import { setSessionCookies } from "@/lib/darasa/session.server";
import { ensureUserRow, getAuth } from "@/lib/utils/auth.server";

export const dynamic = "force-dynamic";

const Picha = z
	.array(z.enum(PICHA_IDS))
	.length(PICHA_UREFU)
	.refine((a) => new Set(a).size === a.length, "picha_zirudiwa");

const Body = z.object({
	code: z.string().min(1).max(20),
	displayName: z.string().max(60).optional(),
	picha: Picha.optional(),
});

/**
 * Join a darasa.
 *  - With displayName + picha: create a new learner with a picture password.
 *  - With only the code, as a signed-in Logto user: link (or reuse) a learner row for that account.
 */
export async function POST(req: Request) {
	const parsed = Body.safeParse(await req.json().catch(() => null));
	if (!parsed.success) return NextResponse.json({ error: "ombi_si_sahihi" }, { status: 400 });
	const code = normalizeCode(parsed.data.code);
	if (!code) return NextResponse.json({ error: "msimbo_si_sahihi" }, { status: 400 });

	const d = await findDarasaByCode(code);
	if (!d) return NextResponse.json({ error: "darasa_halipo" }, { status: 404 });

	// Picture-password learner.
	if (parsed.data.picha) {
		const displayName = normalizeName(parsed.data.displayName ?? "");
		if (displayName.length < 2 || displayName.length > 40) {
			return NextResponse.json({ error: "jina_si_sahihi" }, { status: 400 });
		}
		const [taken] = await db
			.select({ id: wanafunzi.id })
			.from(wanafunzi)
			.where(and(eq(wanafunzi.darasaId, d.id), sql`lower(${wanafunzi.displayName}) = lower(${displayName})`))
			.limit(1);
		if (taken) return NextResponse.json({ error: "jina_limechukuliwa" }, { status: 409 });

		const id = crypto.randomUUID();
		try {
			await db.insert(wanafunzi).values({
				id,
				darasaId: d.id,
				displayName,
				pictureHash: await hashPicha(parsed.data.picha),
				lastSeenAt: sql`now()` as unknown as string,
			});
		} catch {
			return NextResponse.json({ error: "jina_limechukuliwa" }, { status: 409 });
		}
		const res = NextResponse.json({ ok: true, mwanafunziId: id });
		setSessionCookies(res, { m: id, d: d.id, iat: Math.floor(Date.now() / 1000), v: 0 }, { id, jina: displayName, darasa: d.name });
		return res;
	}

	// Logto user: just the code.
	const { isAuthenticated, claims } = await getAuth();
	if (!isAuthenticated || !claims?.sub) return NextResponse.json({ error: "picha_zinahitajika" }, { status: 400 });
	await ensureUserRow(claims);

	const [existing] = await db
		.select({ id: wanafunzi.id })
		.from(wanafunzi)
		.where(and(eq(wanafunzi.darasaId, d.id), eq(wanafunzi.logtoId, claims.sub)))
		.limit(1);
	if (existing) return NextResponse.json({ ok: true, mwanafunziId: existing.id });

	const baseName = normalizeName(String(claims.name || claims.username || "Mwanafunzi")).slice(0, 36);
	const id = crypto.randomUUID();
	for (let n = 1; n < 20; n++) {
		const displayName = n === 1 ? baseName : `${baseName} ${n}`;
		try {
			await db.insert(wanafunzi).values({ id, darasaId: d.id, displayName, logtoId: claims.sub, lastSeenAt: sql`now()` as unknown as string });
			return NextResponse.json({ ok: true, mwanafunziId: id });
		} catch {
			// name taken in this class; try the next suffix
		}
	}
	return NextResponse.json({ error: "jina_limechukuliwa" }, { status: 409 });
}
