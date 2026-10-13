import type { Metadata } from "next";

import { SiteHeader } from "@/components/header";

import AuthProvider from "@/components/providers/auth-provider";
import { getAuth, getAuthContextFromClaims } from "@/lib/utils/auth.server";

import { getAllModules } from "@/lib/lessons.server";
import { getDictionary, hasLocale, Locale } from "@/app/(main)/[lang]/dictionaries";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
	const { lang } = await params;
	const dict = await getDictionary(hasLocale(lang) ? lang : "sw");
	return {
		title: { absolute: dict.tovuti.meta.title, template: "%s · Nuru" },
		description: dict.tovuti.meta.description,
		alternates: { languages: { sw: "/sw", en: "/en" } },
		openGraph: {
			title: dict.tovuti.meta.title,
			description: dict.tovuti.meta.description,
			locale: lang === "en" ? "en_GB" : "sw_TZ",
			alternateLocale: lang === "en" ? ["sw_TZ"] : ["en_GB"],
		},
	};
}

export default async function MainLayout({
	children,
	params,
}: {
	children: React.ReactNode;
	params: Promise<{ lang: string }>;
}) {
	const { isAuthenticated, claims } = await getAuth({ fetchUserInfo: true });

	const modules = await getAllModules();
	const { lang } = await params;
	const dict = await getDictionary(lang as Locale);

	return (
		<AuthProvider value={getAuthContextFromClaims(isAuthenticated, claims || null)}>
			<SiteHeader modules={modules} dict={dict} lang={lang as Locale} />
			{/*
			h-0 sets an explicit height so that the height of the div is not derived from the height
			of child elements. flex-1 allows the div to grow to cover the rest of the available space.
			This creates a situation where this div is always (h-dvh - <SiteHeader height>)
			regardless of the size of the child elements. Content pages (landing, kamusi, masomo)
			scroll inside their own <main>.
			*/}
			<div id="maudhui" lang={lang} className="flex h-0 flex-1 flex-col">
				{children}
			</div>
		</AuthProvider>
	);
}
