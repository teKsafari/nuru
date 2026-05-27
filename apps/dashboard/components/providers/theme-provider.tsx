import { ThemeProvider as NextThemesProvider } from "@wrksz/themes/next";
import type { ReactNode } from "react";

interface CustomThemeProviderProps {
	children: ReactNode;
}

export function CustomThemeProvider({ children }: CustomThemeProviderProps) {
	return (
		<NextThemesProvider
			attribute="class"
			defaultTheme="dark"
			storageKey="nuru-theme"
			enableSystem
		>
			{children}
		</NextThemesProvider>
	);
}
