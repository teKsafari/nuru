import { getLogtoContext } from "@logto/next/server-actions";
import { logtoConfig } from "@/app/logto";

import { SiteHeader } from "@/components/header";

import AuthProvider from "@/components/providers/auth-provider";
import { getContextFromClaims } from "@/lib/utils/auth.server";
import { getAllLessons } from "@/lib/lessons.server";
import { getDictionary, Locale } from "@/app/(main)/[lang]/dictionaries";

export default async function MainLayout({
	children,
	params,
}: {
	children: React.ReactNode;
	params: Promise<{ lang: string }>;
}) {
	const { isAuthenticated, claims } = await getLogtoContext(logtoConfig);
	const lessons = await getAllLessons();
	const { lang } = await params;
	const dict = await getDictionary(lang as Locale);

	return (
		<AuthProvider value={getContextFromClaims(isAuthenticated, claims || null)}>
			<SiteHeader lessons={lessons} dict={dict} lang={lang as Locale} />
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
