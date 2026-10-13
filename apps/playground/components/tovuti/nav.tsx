"use client";

import { usePathname } from "next/navigation";
import { BookA, Footprints, Map, School, SquareTerminal, type LucideIcon } from "lucide-react";

import { AppLogo } from "@nuru/ui/components/app-logo";
import { cn } from "@nuru/ui/lib/utils";
import type { Dictionary } from "@/app/(main)/[lang]/dictionaries";

export type NavKey = "masomo" | "anza" | "uwanja" | "kamusi" | "darasa";
export type NavItem = { key: NavKey; href: string; label: string; icon: LucideIcon; active: boolean };

export const NAV: [NavKey, LucideIcon][] = [
	["masomo", Map],
	["anza", Footprints],
	["uwanja", SquareTerminal],
	["kamusi", BookA],
	["darasa", School],
];

export function useNavItems(lang: string, dict: Dictionary): NavItem[] {
	const pathname = usePathname() ?? "";
	return NAV.map(([key, icon]) => {
		const href = `/${lang}/${key}`;
		return { key, href, label: dict.header[key], icon, active: pathname === href || pathname.startsWith(`${href}/`) };
	});
}

/** The sun mark and the "nuru" wordmark. */
export function Wordmark({ size = 30, className }: { size?: number; className?: string }) {
	return (
		<span className={cn("flex items-center gap-2", className)}>
			<AppLogo size={size} className="shrink-0 transition-transform duration-300 group-hover:rotate-45 motion-reduce:transition-none" />
			<span className="font-display text-[1.45rem] leading-none font-extrabold tracking-[-0.04em]">nuru</span>
		</span>
	);
}
