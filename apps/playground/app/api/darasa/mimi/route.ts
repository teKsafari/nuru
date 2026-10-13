import { NextResponse } from "next/server";

import { getMimi } from "@/lib/darasa/queries.server";

export const dynamic = "force-dynamic";

/** The current learner (cookie or Logto), their darasa, its modules and their progress. */
export async function GET() {
	const { owner: _owner, ...mimi } = await getMimi();
	return NextResponse.json(mimi, { headers: { "Cache-Control": "no-store" } });
}
