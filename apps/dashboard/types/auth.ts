import type { IdTokenClaims } from "@logto/next";

type NonNullableProps<T> = {
	[P in keyof T]: NonNullable<T[P]>;
};

export type AuthSession = 
	NonNullableProps<
		Required<
			Pick<
				IdTokenClaims,
				"sub" | "name" | "username" | "email" | "email_verified"
			>
		>
	> &
	Pick<IdTokenClaims, "picture" | "roles">;

export type AuthContextType =
	| { isAuthenticated: true; claims: AuthSession }
	| { isAuthenticated: false; claims: null };
