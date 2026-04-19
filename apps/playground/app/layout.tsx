import type { Metadata, Viewport } from "next";

import { Suspense } from "react";
import { CustomThemeProvider } from "@/components/providers/theme-provider";
import { cn } from "@/lib/utils";
import { GoogleAnalytics } from "@next/third-parties/google";

export const viewport: Viewport = {
	width: "device-width",
	initialScale: 1,
	maximumScale: 1,
};

import "./globals.css";
import { JetBrains_Mono } from "next/font/google";

const jetbrainsMono = JetBrains_Mono({
	subsets: ["latin"],
	display: "swap",
	weight: ["400", "500", "700"],
	variable: "--font-jetbrains-mono",
});


export const metadata: Metadata = {
	title: "nuru playground",
	description: "nuru playground",
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
			lang="en"
			suppressHydrationWarning
			className={`${jetbrainsMono.variable}`}
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
				<meta name="theme-color" content="#00b4d8" />
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
