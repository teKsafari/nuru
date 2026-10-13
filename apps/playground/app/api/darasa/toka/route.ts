import { NextResponse } from "next/server";

import { clearSessionCookies } from "@/lib/darasa/session.server";

export const dynamic = "force-dynamic";

/** Sign the learner out of this device. */
export async function POST() {
	const res = NextResponse.json({ ok: true });
	clearSessionCookies(res);
	return res;
}
