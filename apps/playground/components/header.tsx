"use client";

import Link from "next/link";

import UserMenu from "@/components/UserMenu";
import { LessonsDrawer } from "@/components/lessons-drawer";
import { ThemeToggle } from "@/components/tovuti/theme-toggle";
import { LangSwitch } from "@/components/tovuti/lang-switch";
import { useNavItems, Wordmark } from "@/components/tovuti/nav";
import { cn } from "@nuru/ui/lib/utils";
import { DarasaBadge } from "@/components/darasa/darasa-badge";
import type { Dictionary } from "@/app/(main)/[lang]/dictionaries";

interface SiteHeaderProps {
	modules?: { id: string; slug: string; title: { sw: string; en: string } }[];
	lang: "en" | "sw";
	dict: Dictionary;
}

// Header: paper ground, a 2px ink rule, one row 56px tall so the lesson
// and Uwanja apps below keep their height.
export function SiteHeader({ modules = [], lang, dict }: SiteHeaderProps) {
	const nav = useNavItems(lang, dict);
	const themeLabels = { mchana: dict.header.mchana, usiku: dict.header.usiku, toUsiku: dict.header.toUsiku, toMchana: dict.header.toMchana };

	return (
		<header className="relative z-40 shrink-0 border-b-2 border-mstari bg-karatasi text-foreground">
			<a
				href="#maudhui"
				className="lebo sr-only z-50 rounded-md border-2 border-mstari bg-jua px-3 py-2 text-wino focus:not-sr-only focus:absolute focus:top-2 focus:left-2"
			>
				{dict.header.skip}
			</a>
			<div className="flex h-14 items-center gap-3 px-3 sm:px-5 lg:px-8">
				<Link href={`/${lang}`} className="group -ml-1 flex items-center rounded-md px-1 py-1" aria-label={`nuru, ${dict.header.home}`}>
					<Wordmark />
				</Link>

				<nav aria-label={dict.header.mainNav} className="ml-4 hidden items-center gap-1 lg:flex">
					{nav.map((item) => (
						<Link
							key={item.key}
							href={item.href}
							aria-current={item.active ? "page" : undefined}
							className={cn(
								"flex h-9 items-center gap-1.5 rounded-md border-2 px-3 text-sm font-semibold transition-colors",
								item.active
									? "border-mstari bg-wino text-karatasi"
									: "border-transparent text-foreground/80 hover:border-mstari hover:bg-card hover:text-foreground",
							)}
						>
							<item.icon className="size-4" aria-hidden />
							{item.label}
						</Link>
					))}
				</nav>

				<div className="ml-auto flex items-center gap-2">
					<DarasaBadge />
					<LangSwitch lang={lang} label={dict.header.language} />
					<ThemeToggle labels={themeLabels} className="hidden sm:inline-flex" />
					<UserMenu
						labels={{
							signIn: dict.header.signIn,
							signOut: dict.header.signOut,
							account: dict.header.account,
							user: dict.header.user,
						}}
					/>
					<div className="lg:hidden">
						<LessonsDrawer modules={modules} lang={lang} dict={dict} />
					</div>
				</div>
			</div>
		</header>
	);
}
