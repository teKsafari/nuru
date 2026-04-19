import "server-only";

import type {
	IdTokenClaims,
	LogtoContext,
	UserInfoResponse,
} from "@logto/next";

import { AuthSession, AuthContextType } from "@/types/auth";

// auth utilities for the server only

export function getAuthContextFromClaims(
	isAuthenticated: boolean,
	claims: IdTokenClaims | null,
): AuthContextType {
	let context: AuthContextType;

	if (isAuthenticated) {
		context = {
			isAuthenticated,
			claims: (claims as AuthSession) || null,
		};
	} else {
		context = {
			isAuthenticated,
			claims: null,
		};
	}

	return context;
}
