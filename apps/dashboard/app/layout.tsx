import type { Metadata, Viewport } from "next";

import { Suspense } from "react";
import { CustomThemeProvider } from "@/components/providers/theme-provider";
import "./globals.css";

import { JetBrains_Mono, Noto_Rashi_Hebrew } from "next/font/google";

const jetbrainsMono = JetBrains_Mono({
	subsets: ["latin"],
	display: "swap",
	weight: ["400", "500", "700"],
	variable: "--font-jetbrains-mono",
});
const NotoRashi = Noto_Rashi_Hebrew({
	subsets: ["latin"],
	variable: "--font-noto-rashi",
});

export const metadata: Metadata = {
  title: "Nuru Educator Dashboard",
  description: "Manage lessons and organizations for Nuru",
};

export const viewport: Viewport = {
	width: "device-width",
	initialScale: 1,
	maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={`${jetbrainsMono.variable} ${NotoRashi.variable}`}>
      <body className="antialiased">
        <Suspense>
          <CustomThemeProvider>
            {children}
          </CustomThemeProvider>
        </Suspense>
      </body>
    </html>
  );
}

