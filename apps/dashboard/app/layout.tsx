import type { Metadata, Viewport } from "next";

import { Suspense } from "react";
import { CustomThemeProvider } from "@/components/providers/theme-provider";
import "./globals.css";

import { kangaFonts } from "@/lib/fonts";

export const metadata: Metadata = {
  title: "Nuru · Chumba cha Walimu",
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
    <html lang="en" suppressHydrationWarning className={kangaFonts}>
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

