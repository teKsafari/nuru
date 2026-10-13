import type { Metadata, Viewport } from "next";

import { Suspense } from "react";
import { GoogleAnalytics } from "@next/third-parties/google";
import { CustomThemeProvider } from "@/components/providers/theme-provider";
import { ServiceWorkerRegister } from "@/components/tovuti/sw-register";

import "./globals.css";

import { appFonts } from "@/lib/fonts";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://nuruprogramming.org";

export const viewport: Viewport = {
	width: "device-width",
	initialScale: 1,
	maximumScale: 1,
	viewportFit: "cover",
	themeColor: [
		{ media: "(prefers-color-scheme: light)", color: "#ffc93c" },
		{ media: "(prefers-color-scheme: dark)", color: "#15120f" },
	],
};

export const metadata: Metadata = {
	metadataBase: new URL(siteUrl),
	title: {
		default: "Nuru · Lugha ya kwanza ya kiprogramu ya Kiswahili",
		template: "%s · Nuru",
	},
	description:
		"Jifunze kuandika programu kwa Kiswahili. Chora na kobe, washa taa kwenye ubao, na endesha kodi kwenye kivinjari bila kusakinisha kitu.",
	applicationName: "Nuru",
	generator: "nuru",
	keywords: ["Nuru", "Kiswahili", "programu", "kujifunza kodi", "teKsafari", "Swahili programming language"],
	authors: [{ name: "teKsafari", url: "https://teksafari.org" }],
	manifest: "/manifest.json",
	icons: {
		icon: [
			{ url: "/favicon.svg", type: "image/svg+xml" },
			{ url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
		],
		apple: [{ url: "/icons/apple-touch-icon.png", sizes: "180x180" }],
	},
	appleWebApp: { capable: true, title: "Nuru", statusBarStyle: "default" },
	openGraph: {
		type: "website",
		siteName: "Nuru",
		locale: "sw_TZ",
		title: "Nuru · Lugha ya kwanza ya kiprogramu ya Kiswahili",
		description: "Unachowaza ndicho unachoandika. Jifunze kuandika programu kwa Kiswahili, kuanzia chekechea hadi nyumbani kwa bibi.",
		images: [{ url: "/icons/og.png", width: 1200, height: 630, alt: "Nuru: lugha ya kwanza ya kiprogramu ya Kiswahili" }],
	},
	twitter: {
		card: "summary_large_image",
		title: "Nuru · Lugha ya kwanza ya kiprogramu ya Kiswahili",
		description: "Jifunze kuandika programu kwa Kiswahili.",
		images: ["/icons/og.png"],
	},
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="sw" suppressHydrationWarning className={appFonts}>
			<body className="flex h-dvh flex-col">
				<noscript>
					<div
						style={{
							padding: "12px 16px",
							background: "#ffc93c",
							color: "#15120f",
							borderBottom: "2px solid #15120f",
							fontFamily: "system-ui, sans-serif",
							fontSize: "15px",
						}}
					>
						Nuru inahitaji JavaScript ili kuendesha kodi. Tafadhali iwashe kwenye kivinjari chako. (Nuru needs JavaScript
						to run code. Please turn it on in your browser.)
					</div>
				</noscript>
				<Suspense>
					<CustomThemeProvider>{children}</CustomThemeProvider>
				</Suspense>
				<ServiceWorkerRegister />
			</body>
			<GoogleAnalytics gaId="G-HPT3V2KPP4" />
		</html>
	);
}
