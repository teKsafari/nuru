"use client";

import { useEffect, useState } from "react";
import { useTheme } from "@wrksz/themes/client";
import { Moon, Sun } from "lucide-react";

interface ThemeToggleProps {
	/** Accessible label / tooltip, e.g. "Switch appearance". */
	label: string;
}

export function ThemeToggle({ label }: ThemeToggleProps) {
	const { resolvedTheme, setTheme } = useTheme();
	const [mounted, setMounted] = useState(false);

	// Avoid hydration mismatch: the resolved theme is only known on the client.
	useEffect(() => setMounted(true), []);

	const isDark = resolvedTheme === "dark";

	return (
		<button
			onClick={() => setTheme(isDark ? "light" : "dark")}
			aria-label={label}
			title={label}
			className="bg-background/50 text-muted-foreground hover:bg-muted/50 hover:text-foreground flex size-8 items-center justify-center rounded transition-all"
		>
			{/* Show a Moon while in light mode (tap to go dark) and a Sun while dark.
			    Render the Sun until mounted so SSR and first client paint match. */}
			{mounted && !isDark ? (
				<Moon className="size-4" />
			) : (
				<Sun className="size-4" />
			)}
		</button>
	);
}
