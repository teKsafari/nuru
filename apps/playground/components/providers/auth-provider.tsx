"use client";

import { createContext } from "react";

import type { AuthContextType } from "@/types/auth";

export const AuthContext = createContext<AuthContextType>({
	isAuthenticated: false,
	claims: null,
});

export default function AuthProvider({
	children,
	value,
}: {
	children: React.ReactNode;
	value: AuthContextType;
}) {
	return <AuthContext value={value}>{children}</AuthContext>;
}
