import type { Metadata, Viewport } from "next";

import { Suspense } from "react";
import { CustomThemeProvider } from "@/components/providers/theme-provider";
import { LangProvider } from "@/components/providers/lang-provider";
import "./globals.css";

import { appFonts } from "@/lib/fonts";
import { getLang } from "@/lib/lang";

export const metadata: Metadata = {
	title: "Nuru · Chumba cha Walimu",
	description: "Andaa masomo ya Nuru, fungua madarasa na fuatilia maendeleo ya wanafunzi.",
};

export const viewport: Viewport = {
	width: "device-width",
	initialScale: 1,
};

export default async function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const lang = await getLang();
	return (
		<html lang={lang} suppressHydrationWarning className={appFonts}>
			<body className="antialiased">
				<Suspense>
					<CustomThemeProvider>
						<LangProvider lang={lang}>{children}</LangProvider>
					</CustomThemeProvider>
				</Suspense>
			</body>
		</html>
	);
}
