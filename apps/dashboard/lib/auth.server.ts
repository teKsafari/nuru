import "server-only";

import type { IdTokenClaims } from "@logto/next";
import { AuthSession, AuthContextType } from "@/types/auth";

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
