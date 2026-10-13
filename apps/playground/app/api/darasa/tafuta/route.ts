import { NextResponse } from "next/server";
import { z } from "zod";
import { asc, eq } from "drizzle-orm";
import { db, wanafunzi } from "@nuru/db";

import { findDarasaByCode, teacherName } from "@/lib/darasa/queries.server";
import { normalizeCode } from "@/lib/darasa/shared";

export const dynamic = "force-dynamic";

const Body = z.object({ code: z.string().min(1).max(20) });

/** Look up a darasa by join code: its name and the class list learners pick their name from. */
export async function POST(req: Request) {
	const parsed = Body.safeParse(await req.json().catch(() => null));
	const code = parsed.success ? normalizeCode(parsed.data.code) : null;
	if (!code) return NextResponse.json({ error: "msimbo_si_sahihi" }, { status: 400 });

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
