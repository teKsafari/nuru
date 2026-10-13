"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { School } from "lucide-react";

import { cn } from "@nuru/ui/lib/utils";
import { readHint, type DarasaHint } from "@/lib/darasa/shared";

/**
 * Small sticker with the signed-in darasa learner's name, for the site header.
 * On a shared phone it tells the next child whose session is open. Renders nothing
 * when no learner is signed in on this device.
 */
export function DarasaBadge({ className }: { className?: string }) {
	const pathname = usePathname() ?? "";
	const [hint, setHint] = useState<DarasaHint | null>(null);
	const lang = pathname.split("/")[1] === "en" ? "en" : "sw";

	useEffect(() => {
		const read = () => setHint(readHint());
		read();
		window.addEventListener("nuru:darasa", read);
		window.addEventListener("focus", read);
		return () => {
			window.removeEventListener("nuru:darasa", read);
			window.removeEventListener("focus", read);
		};
	}, [pathname]);

	if (!hint) return null;
	const label = lang === "en" ? `Signed in as ${hint.jina}, class ${hint.darasa}` : `Umeingia kama ${hint.jina}, darasa ${hint.darasa}`;

	return (
		<Link
			href={`/${lang}/darasa`}
			title={label}
			aria-label={label}
			className={cn(
				"lebo flex h-9 max-w-[13rem] shrink-0 items-center gap-1 rounded-md border-2 border-mstari bg-mwani px-2 text-white shadow-kivuli-sm transition-transform hover:-translate-y-px dark:text-[#15120f]",
				className,
			)}
		>
			<School className="size-4 shrink-0" aria-hidden />
			{/* Phones show the initial only; the header has no room for a full name at 360px. */}
			<span className="font-display text-sm font-extrabold sm:hidden">{hint.jina.slice(0, 1).toUpperCase()}</span>
			<span className="hidden truncate text-[0.8rem] tracking-normal normal-case sm:inline">{hint.jina}</span>
		</Link>
	);
}
