import "server-only";

import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import type { NextResponse } from "next/server";

import { HINT_COOKIE, type DarasaHint } from "./shared";

// Learner session: an HMAC-signed httpOnly cookie. No server-side session table;
// the payload names the mwanafunzi and their darasa, and every request re-checks
// that the row still exists (a teacher can remove a learner at any time).

export const SESSION_COOKIE = "nuru-mwanafunzi";
const MAX_AGE = 60 * 60 * 24 * 60; // 60 days: shared devices sign out with "Toka"

const DEV_SECRET = "nuru-dev-secret-not-for-production-use-only";
let warned = false;

function secret() {
	const s = process.env.NURU_SESSION_SECRET;
	if (s && s.length >= 16) return s;
	if (process.env.NODE_ENV === "production") {
		throw new Error("NURU_SESSION_SECRET must be set (16+ characters) in production");
	}
	if (!warned) {
		warned = true;
		console.warn("[darasa] NURU_SESSION_SECRET is not set; using the development fallback secret.");
	}
	return DEV_SECRET;
}

/**
 * m: mwanafunzi id, d: darasa id, iat: issued-at (seconds), v: the learner's
 * sessionVersion when issued. resolveOwner rejects a cookie whose v is behind the row.
 */
export type LearnerSession = { m: string; d: string; iat: number; v: number };

const b64 = (s: string) => Buffer.from(s).toString("base64url");
const sign = (body: string) => createHmac("sha256", secret()).update(body).digest("base64url");

export function encodeSession(s: LearnerSession) {
	const body = b64(JSON.stringify(s));
	return `${body}.${sign(body)}`;
}

export function decodeSession(token: string | undefined): LearnerSession | null {
	if (!token) return null;
	const [body, mac] = token.split(".");
	if (!body || !mac) return null;
	const expected = Buffer.from(sign(body));
	const given = Buffer.from(mac);
	if (expected.length !== given.length || !timingSafeEqual(expected, given)) return null;
	try {
		const s = JSON.parse(Buffer.from(body, "base64url").toString());
		if (typeof s.m !== "string" || typeof s.d !== "string" || typeof s.iat !== "number") return null;
		if (Date.now() / 1000 - s.iat > MAX_AGE) return null;
		// Cookies issued before session versions existed carry no v: treat them as 0.
		const v = s.v === undefined ? 0 : s.v;
		if (typeof v !== "number" || !Number.isInteger(v)) return null;
		return { m: s.m, d: s.d, iat: s.iat, v };
	} catch {
		return null;
	}
}

/** Read the learner session from the request cookies (server components, route handlers). */
export async function readLearnerSession() {
	const jar = await cookies();
	return decodeSession(jar.get(SESSION_COOKIE)?.value);
}

const base = { path: "/", sameSite: "lax" as const, secure: process.env.NODE_ENV === "production", maxAge: MAX_AGE };

export function setSessionCookies(res: NextResponse, session: LearnerSession, hint: DarasaHint) {
	res.cookies.set(SESSION_COOKIE, encodeSession(session), { ...base, httpOnly: true });
	// Next URL-encodes cookie values itself.
	res.cookies.set(HINT_COOKIE, JSON.stringify(hint), { ...base, httpOnly: false });
}

export function clearSessionCookies(res: NextResponse) {
	res.cookies.set(SESSION_COOKIE, "", { ...base, httpOnly: true, maxAge: 0 });
	res.cookies.set(HINT_COOKIE, "", { ...base, httpOnly: false, maxAge: 0 });
}
