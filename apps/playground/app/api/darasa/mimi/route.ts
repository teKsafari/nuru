import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db, maendeleo } from "@nuru/db";

import { getMimi } from "@/lib/darasa/queries.server";

export const dynamic = "force-dynamic";

/**
 * The current learner (cookie or Logto), their darasa, its modules and their progress.
 * `mmiliki` names whose progress this device holds: the darasa learner's id, or
 * `logto:<sub>` for a signed-in user (with or without a darasa), or null. A Logto
 * user outside any darasa still gets their own progress in `maendeleo`.
 */
export async function GET() {
	const { owner, ...mimi } = await getMimi();
	const mmiliki = !owner ? null : owner.kind === "mwanafunzi" ? owner.mwanafunziId : `logto:${owner.logtoId}`;
	if (owner?.kind === "logto" && !mimi.mwanafunzi) {
		mimi.maendeleo = await db
			.select({ lessonId: maendeleo.lessonId, moduleId: maendeleo.moduleId, passed: maendeleo.passed, attempts: maendeleo.attempts })
			.from(maendeleo)
			.where(eq(maendeleo.logtoId, owner.logtoId));
	}
	return NextResponse.json({ ...mimi, mmiliki }, { headers: { "Cache-Control": "private, no-store" } });
}
