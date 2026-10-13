import { NextResponse } from "next/server";

import { getLessonSolution } from "@/lib/lessons.server";

export const dynamic = "force-dynamic";

/**
 * GET /api/suluhisho?lesson=<id>: the reference solution of a public lesson.
 *
 * The lesson page asks for it only after the learner has unlocked it (three
 * failed submissions, counted in the browser). No login is checked, so this
 * keeps answers out of the page source and nothing more; see the note on
 * toClientLesson in lib/lessons.server.ts.
 */
export async function GET(req: Request) {
	const lessonId = new URL(req.url).searchParams.get("lesson")?.trim() ?? "";
	if (!lessonId || lessonId.length > 200) return NextResponse.json({ error: "ombi_si_sahihi" }, { status: 400 });
	try {
		const solution = await getLessonSolution(lessonId);
		if (!solution) return NextResponse.json({ error: "hakuna_suluhisho" }, { status: 404 });
		return NextResponse.json({ solution }, { headers: { "Cache-Control": "private, no-store" } });
	} catch (e) {
		console.error("suluhisho:", e);
		return NextResponse.json({ error: "hitilafu" }, { status: 500 });
	}
}
