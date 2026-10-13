import { BookOpen, School, Store, Settings, type LucideIcon } from "lucide-react";
import type { Dict } from "@/lib/dict";

export type NavKey = "moduli" | "madarasa" | "soko" | "mipangilio";

export const NAV: { key: NavKey; href: string; icon: LucideIcon; sw: string }[] = [
	{ key: "moduli", href: "/educator/modules", icon: BookOpen, sw: "Moduli" },
	{ key: "madarasa", href: "/educator/madarasa", icon: School, sw: "Madarasa" },
	{ key: "soko", href: "/marketplace", icon: Store, sw: "Soko" },
	{ key: "mipangilio", href: "/settings", icon: Settings, sw: "Mipangilio" },
];

export function isActive(pathname: string, href: string) {
	return pathname === href || pathname.startsWith(href + "/");
}

/** Swahili name first; the English gloss only when the room is in English. */
export function navLabels(item: (typeof NAV)[number], t: Dict, lang: string) {
	return { primary: item.sw, secondary: lang === "en" ? t.nav[item.key] : null };
}
