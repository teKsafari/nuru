"use client";

import { useEffect, useState } from "react";
import { useTheme } from "@wrksz/themes/client";
import { Moon, Sun } from "lucide-react";
import { cn } from "@nuru/ui/lib/utils";
import { useDict, useSetLang } from "@/components/providers/lang-provider";
import type { Lang } from "@/lib/dict";

/** SW | EN segmented switch. `tone="ink"` is for the dark sidebar. */
export function LangToggle({ tone = "paper", className }: { tone?: "paper" | "ink"; className?: string }) {
	const { lang, t } = useDict();
	const { setLang, pending } = useSetLang();
	return (
		<div
			role="group"
			aria-label={t.nav.lang}
			className={cn(
				"inline-flex h-9 overflow-hidden rounded-md border-2 p-0.5",
				tone === "ink" ? "border-[#fff3d6]/80" : "border-mstari bg-card",
				pending && "opacity-60",
				className,
			)}
		>
			{(["sw", "en"] as Lang[]).map((l) => (
				<button
					key={l}
					type="button"
					aria-pressed={lang === l}
					onClick={() => lang !== l && setLang(l)}
					className={cn(
						"lebo min-w-9 rounded-[4px] px-2 transition-colors",
						lang === l ? "bg-jua text-[#15120f]" : tone === "ink" ? "text-[#fff3d6]/75 hover:text-[#fff3d6]" : "text-muted-foreground hover:text-foreground",
					)}
				>
					{l}
				</button>
			))}
		</div>
	);
}

export function ThemeToggle({ tone = "paper", withLabel = false, className }: { tone?: "paper" | "ink"; withLabel?: boolean; className?: string }) {
	const { t } = useDict();
	const { resolvedTheme, setTheme } = useTheme();
	const [mounted, setMounted] = useState(false);
	useEffect(() => setMounted(true), []);
	const usiku = mounted && resolvedTheme === "dark";
	const label = usiku ? t.nav.mchana : t.nav.usiku;

	return (
		<button
			type="button"
			onClick={() => setTheme(usiku ? "light" : "dark")}
			aria-label={`${t.nav.theme}: ${label}`}
			title={label}
			className={cn(
				"inline-flex h-9 items-center justify-center gap-2 rounded-md border-2 text-sm font-semibold transition-colors",
				tone === "ink" ? "border-[#fff3d6]/80 text-[#fff3d6] hover:bg-[#fff3d6]/10" : "border-mstari bg-card text-foreground hover:bg-karatasi-2",
				withLabel ? "px-3" : "w-9",
				className,
			)}
		>
			{usiku ? <Moon className="size-4" aria-hidden /> : <Sun className="size-4" aria-hidden />}
			{withLabel && <span>{usiku ? t.nav.usiku : t.nav.mchana}</span>}
		</button>
	);
}
