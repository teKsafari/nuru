import { NextResponse } from "next/server";
import { z } from "zod";
import { asc, eq } from "drizzle-orm";
import { db, wanafunzi } from "@nuru/db";

import { findDarasaByCode, teacherName } from "@/lib/darasa/queries.server";
import { normalizeCode } from "@/lib/darasa/shared";
import { TokenBuckets, clientIp } from "@/lib/darasa/limits";

export const dynamic = "force-dynamic";

const Body = z.object({ code: z.string().min(1).max(20) });

// Per IP + code, plus per IP across codes to slow guessing of join codes. A class
// behind one school NAT looks up the same code at once, so bursts are generous.
// In-memory and per server instance, so it only slows abuse.
const perCode = new TokenBuckets(60, 0.5);
const perIp = new TokenBuckets(120, 1);

/** Look up a darasa by join code: its name and the class list learners pick their name from. */
export async function POST(req: Request) {
	const parsed = Body.safeParse(await req.json().catch(() => null));
	const code = parsed.success ? normalizeCode(parsed.data.code) : null;
	if (!code) return NextResponse.json({ error: "msimbo_si_sahihi" }, { status: 400 });

	const ip = clientIp(req.headers);
	const wait = perCode.take(`${ip}|${code}`) || perIp.take(ip);
	if (wait > 0) return NextResponse.json({ error: "imefungwa", sekunde: wait }, { status: 429 });

	const d = await findDarasaByCode(code);
	if (!d) return NextResponse.json({ error: "darasa_halipo" }, { status: 404 });

	const list = await db
		.select({ id: wanafunzi.id, displayName: wanafunzi.displayName, pictureHash: wanafunzi.pictureHash, logtoId: wanafunzi.logtoId })
		.from(wanafunzi)
		.where(eq(wanafunzi.darasaId, d.id))
		.orderBy(asc(wanafunzi.displayName));

	return NextResponse.json({
		darasa: { name: d.name, code: d.code, teacherName: await teacherName(d.teacherLogtoId) },
		// Learners who joined with a Logto account sign in through Logto, not pictures.
		wanafunzi: list
			.filter((w) => w.pictureHash || !w.logtoId)
			.map((w) => ({ id: w.id, displayName: w.displayName, needsPictures: !w.pictureHash })),
	});
}
