import type { Metadata, Viewport } from "next";

import { Suspense } from "react";
import { CustomThemeProvider } from "@/components/providers/theme-provider";
import { GoogleAnalytics } from "@next/third-parties/google";

export const viewport: Viewport = {
	width: "device-width",
	initialScale: 1,
	maximumScale: 1,
};

import "./globals.css";

import { kangaFonts } from "@/lib/fonts";

export const metadata: Metadata = {
	title: {
		default: "Nuru · Lugha ya kiprogramu ya Kiswahili",
		template: "%s · Nuru",
	},
	description:
		"Jifunze kuandika programu kwa Kiswahili. Nuru inaendeshwa moja kwa moja kwenye kivinjari chako: hakuna kusakinisha kitu.",
	generator: "nuru",
	icons: {
		icon: [
			{ url: "/favicon.svg", type: "image/svg+xml" },
			{ url: "/favicon/icon.svg", type: "image/svg+xml" },
		],
	},
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html
			lang="sw"
			suppressHydrationWarning
			className={kangaFonts}
		>
			<head>
				<link rel="icon" href="/favicon.svg" type="image/svg+xml" />
				<link
					rel="icon"
					href="/favicon/icon.svg"
					sizes="any"
					type="image/svg+xml"
				/>
				<link rel="apple-touch-icon" href="/favicon.svg" />
				<meta name="theme-color" content="#ffc93c" />
				<link rel="manifest" href="/manifest.json" />
			</head>
			<body className={"flex h-dvh flex-col"}>
				<Suspense>
					<CustomThemeProvider>{children}</CustomThemeProvider>
				</Suspense>
			</body>
			<GoogleAnalytics gaId="G-HPT3V2KPP4" />
		</html>
	);
}
