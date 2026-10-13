import "server-only";

import type { IdTokenClaims } from "@logto/next";
import { getLogtoContext } from "@logto/next/server-actions";
import { db, users } from "@nuru/db";

import { logtoConfig } from "@/app/logto";
import { AuthSession, AuthContextType } from "@/types/auth";

// Every server read of the Logto session goes through getAuth() so local
// development can bypass Logto (it cannot redirect to a dev machine).
// Set NURU_DEV_AUTH=1 in .env.local; it is ignored in production builds.

export const DEV_USER = {
	sub: "dev-mwalimu",
	name: "Mwalimu Dev",
	username: "mwalimu-dev",
	email: "mwalimu@nuru.local",
	email_verified: true,
	picture: null,
	roles: ["Super Admin", "Educator"],
} as const;

export function isDevAuth() {
	return process.env.NODE_ENV !== "production" && process.env.NURU_DEV_AUTH === "1";
}

let devUserEnsured: Promise<unknown> | null = null;

function ensureDevUser() {
	devUserEnsured ??= db
		.insert(users)
		.values({ id: DEV_USER.sub, logtoId: DEV_USER.sub, name: DEV_USER.name, email: DEV_USER.email })
		.onConflictDoNothing()
		.catch((e) => {
			devUserEnsured = null;
			console.warn("[auth] could not ensure dev user:", e);
		});
	return devUserEnsured;
}

export type AuthResult = { isAuthenticated: boolean; claims: IdTokenClaims | null };

/** Drop-in for getLogtoContext(logtoConfig) that honours NURU_DEV_AUTH. */
export async function getAuth(opts?: { fetchUserInfo?: boolean }): Promise<AuthResult> {
	if (isDevAuth()) {
		await ensureDevUser();
		const now = Math.floor(Date.now() / 1000);
		return {
			isAuthenticated: true,
			claims: { ...DEV_USER, roles: [...DEV_USER.roles], iss: "dev", aud: "dev", exp: now + 3600, iat: now } as unknown as IdTokenClaims,
		};
	}
	try {
		const { isAuthenticated, claims } = await getLogtoContext(logtoConfig, opts);
		return { isAuthenticated, claims: claims ?? null };
	} catch (e) {
		console.warn("[auth] getLogtoContext failed:", e instanceof Error ? e.message : e);
		return { isAuthenticated: false, claims: null };
	}
}

export function getAuthContextFromClaims(
	isAuthenticated: boolean,
	claims: IdTokenClaims | null,
): AuthContextType {
	if (isAuthenticated && claims) {
		return {
			isAuthenticated: true,
			claims: claims as unknown as AuthSession,
		};
	}
	return {
		isAuthenticated: false,
		claims: null,
	};
}
