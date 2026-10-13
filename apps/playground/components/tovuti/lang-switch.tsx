"use client";

import { usePathname, useRouter } from "next/navigation";
import { cn } from "@nuru/ui/lib/utils";

const LOCALES = ["sw", "en"] as const;

/** Swaps the locale segment of the current path, keeping query and hash. */
export function swapLocale(pathname: string, to: string) {
	const segments = pathname.split("/");
	if ((LOCALES as readonly string[]).includes(segments[1])) segments[1] = to;
	else segments.splice(1, 0, to);
	return segments.join("/") || `/${to}`;
}

/** SW | EN segmented switch. The middleware remembers the choice in the nuru-lang cookie. */
export function LangSwitch({ lang, label, className }: { lang: string; label: string; className?: string }) {
	const pathname = usePathname();
	const router = useRouter();

	return (
		<div role="group" aria-label={label} className={cn("inline-flex h-9 overflow-hidden rounded-md border-2 border-mstari bg-card", className)}>
			{LOCALES.map((l) => {
				const active = l === lang;
				const href = swapLocale(pathname, l);
				return (
					<a
						key={l}
						href={href}
						hrefLang={l}
						lang={l}
						aria-current={active ? "true" : undefined}
						onClick={(e) => {
							e.preventDefault();
							if (active) return;
							router.push(href + window.location.search + window.location.hash);
						}}
						className={cn(
							"lebo flex min-w-10 items-center justify-center px-2 text-[0.72rem] transition-colors",
							active ? "bg-wino text-karatasi" : "text-foreground hover:bg-karatasi-2",
							l === "en" && "border-l-2 border-mstari",
						)}
					>
						{l.toUpperCase()}
					</a>
				);
			})}
		</div>
	);
}
