"use client";

import { useEffect, useState } from "react";
import { useTheme } from "@wrksz/themes/client";
import { Moon, Sun } from "lucide-react";
import { cn } from "@nuru/ui/lib/utils";

type Labels = { mchana: string; usiku: string; toUsiku: string; toMchana: string };

/** Mchana / Usiku switch. `withLabel` shows the mode name next to the icon. */
export function ThemeToggle({ labels, withLabel = false, className }: { labels: Labels; withLabel?: boolean; className?: string }) {
	const { resolvedTheme, setTheme } = useTheme();
	const [mounted, setMounted] = useState(false);
	useEffect(() => setMounted(true), []);
	const usiku = mounted && resolvedTheme === "dark";

	return (
		<button
			type="button"
			onClick={() => setTheme(usiku ? "light" : "dark")}
			aria-label={usiku ? labels.toMchana : labels.toUsiku}
			title={usiku ? labels.toMchana : labels.toUsiku}
			className={cn(
				"inline-flex h-9 items-center justify-center gap-2 rounded-md border-2 border-mstari bg-card px-2 text-sm font-semibold text-foreground transition-[transform,box-shadow] duration-100 hover:-translate-x-px hover:-translate-y-px hover:shadow-kivuli-sm active:translate-0 active:shadow-none",
				withLabel ? "px-3" : "w-9",
				className,
			)}
		>
			{usiku ? <Moon className="size-4" aria-hidden /> : <Sun className="size-4" aria-hidden />}
			{withLabel && <span>{usiku ? labels.usiku : labels.mchana}</span>}
		</button>
	);
}
