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

type NonNullableProps<T> = {
	[P in keyof T]: NonNullable<T[P]>;
};

export type AuthSession = NonNullableProps<
	Required<
		Pick<
			IdTokenClaims,
			"sub" | "name" | "username" | "picture" | "email" | "email_verified"
			// | "phone_number" // not collecting that yet
			// | "roles"
		>
	>
>;

export type AuthContextType =
	| { isAuthenticated: true; claims: AuthSession }
	| { isAuthenticated: false; claims: null };
