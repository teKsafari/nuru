"use client";

import React, { useContext } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";

import UserMenu from "@/components/UserMenu";

import { LessonsDrawer } from "@/components/lessons-drawer";

import { AppLogo } from "@nuru/ui/components/app-logo";
import { Dictionary } from "@/app/(main)/[lang]/dictionaries";
import { AuthContext } from "@/components/providers/auth-provider";

interface SiteHeaderProps {
	modules?: { id: string; slug: string; title: { sw: string; en: string } }[];
	lang: "en" | "sw";
	dict: Dictionary;
}

export function SiteHeader({ modules = [], lang, dict }: SiteHeaderProps) {
	const pathname = usePathname();
	useContext(AuthContext);

	const navItems = [
		{
			label: "Home",
			href: `/${lang}`,
			active: pathname === `/${lang}`,
		},
		{
			label: "Playground",
			href: `/${lang}/anza`,
			active: pathname.startsWith(`/${lang}/anza`),
		},
	];

	return (
		<header className="sticky top-0 right-0 left-0 z-40 border-b border-slate-200 bg-white/95 shadow-[0_1px_0_rgba(15,23,42,0.02)] backdrop-blur-md">
			<div className="mx-auto flex h-10 max-w-[1280px] items-center justify-between gap-4 px-5">
				<Link
					href={`/${lang}`}
					title="Home"
					className="group flex shrink-0 items-center gap-2.5"
				>
					<AppLogo size={22} className="rounded-md" />
					<span className="text-[15px] font-bold tracking-tight text-slate-900">Nuru</span>
				</Link>

				<nav className="hidden h-full min-w-0 flex-1 items-center justify-center gap-8 md:flex">
					{navItems.map((item) => (
						<Link
							key={item.href}
							href={item.href}
							className={`relative flex h-full shrink-0 items-center whitespace-nowrap text-[14px] font-semibold transition-colors ${
								item.active ? "text-slate-950" : "text-slate-500 hover:text-slate-800"
							}`}
						>
							{item.label}
							{item.active && (
								<span className="absolute right-0 bottom-0 left-0 h-0.5 rounded-full bg-blue-600" />
							)}
						</Link>
					))}
				</nav>


				<div className="flex shrink-0 items-center gap-5">
					<div className="md:hidden">
						<LessonsDrawer modules={modules} lang={lang} dict={dict} />
					</div>
					<UserMenu />
				</div>

			</div>
		</header>
	);
}
