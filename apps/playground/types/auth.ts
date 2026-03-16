import type {
	IdTokenClaims,
	LogtoContext,
	UserInfoResponse,
} from "@logto/next";

// export type AuthSession = Pick<
// 	IdTokenClaims,
// 	| "sub"
// 	| "name"
// 	| "username"
// 	| "picture"
// 	| "email"
// 	| "email_verified"
// 	| "phone_number"
// 	| "roles"
// >;

export type AuthSession = Required<
	Pick<
		IdTokenClaims,
		| "sub"
		| "name"
		| "username"
		| "picture"
		| "email"
		| "email_verified"
		// | "phone_number" // not collecting that yet
		// | "roles"
	>
>;

export type AuthContextType =
	| { isAuthenticated: true; claims: AuthSession }
	| { isAuthenticated: false; claims: null };
