"use client";

import { useSearchParams } from "next/navigation";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import type { ReactNode } from "react";

interface CustomThemeProviderProps {
	children: ReactNode;
}

export function CustomThemeProvider({ children }: CustomThemeProviderProps) {
	const searchParams = useSearchParams();
	const themeParam = searchParams.get("theme");

	// Check if theme parameter is valid
	const isValidTheme = themeParam === "dark" || themeParam === "light";
	const forcedTheme = isValidTheme ? themeParam : undefined;

	return (
		<NextThemesProvider
			attribute="class"
			defaultTheme="dark"
			forcedTheme={forcedTheme}
			storageKey="nuru-theme"
			enableSystem
		>
			{children}
		</NextThemesProvider>
	);
}
