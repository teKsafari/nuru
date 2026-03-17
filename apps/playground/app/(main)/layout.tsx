import { getLogtoContext } from "@logto/next/server-actions";
import { logtoConfig } from "@/app/logto";

import { SiteHeader } from "@/components/header";

import AuthProvider from "@/components/providers/auth-provider";
import { getContextFromClaims } from "@/lib/utils/auth.server";

export default async function MainLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const { isAuthenticated, claims } = await getLogtoContext(logtoConfig);

	return (
		<AuthProvider value={getContextFromClaims(isAuthenticated, claims || null)}>
			<SiteHeader />
			{/*
			h-0 sets an explicit height so that the height of the div is not derived from the height
			of child elements. flex-1 allows the div to grow to cover the rest of the available space.
			This creates a situation where this div is always h-[100dvh] - <SiteHeader height>
			regardless of the size of the child elements.
			*/}
			<div className="flex h-0 flex-1 flex-col">{children}</div>
		</AuthProvider>
	);
}
