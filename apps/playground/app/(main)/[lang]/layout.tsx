import { getLogtoContext } from "@logto/next/server-actions";
import { logtoConfig } from "@/app/logto";

import { SiteHeader } from "@/components/header";

import AuthProvider from "@/components/providers/auth-provider";
import { getAuthContextFromClaims } from "@/lib/utils/auth.server";

import { getDictionary, Locale } from "@/app/(main)/[lang]/dictionaries";

async function getAuthState(): Promise<{
	isAuthenticated: boolean;
	claims: Awaited<ReturnType<typeof getLogtoContext>>["claims"] | null;
}> {
	try {
		const ctx = await getLogtoContext(logtoConfig, { fetchUserInfo: true });
		return { isAuthenticated: ctx.isAuthenticated, claims: ctx.claims ?? null };
	} catch {
		// Stale/invalid Logto grant (e.g. expired refresh token after a language
		// switch). Clear the stale Logto cookie so the next render starts clean,
		// and treat the user as signed out instead of crashing the layout.
		try {
			const { cookies } = await import("next/headers");
			const store = await cookies();
			for (const c of store.getAll()) {
				if (c.name.startsWith("logto")) {
					store.delete(c.name);
				}
			}
		} catch {
			// no-op
		}
		return { isAuthenticated: false, claims: null };
	}
}

export default async function MainLayout({
	children,
	params,
}: {
	children: React.ReactNode;
	params: Promise<{ lang: string }>;
}) {
	const { lang } = await params;
	// Auth (network) and the dictionary don't depend on each other.
	const [{ isAuthenticated, claims }, dict] = await Promise.all([
		getAuthState(),
		getDictionary(lang as Locale),
	]);

	return (
		<AuthProvider
			value={getAuthContextFromClaims(isAuthenticated, claims || null)}
		>
			<SiteHeader dict={dict} lang={lang as Locale} />
			{/*
			h-0 sets an explicit height so that the height of the div is not derived from the height
			of child elements. flex-1 allows the div to grow to cover the rest of the available space.
			This creates a situation where this div is always (h-dvh - <SiteHeader height>)
			regardless of the size of the child elements.
			*/}
			<div className="flex h-0 flex-1 flex-col">{children}</div>
		</AuthProvider>
	);
}
