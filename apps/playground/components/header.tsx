"use client";

import React from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";

import UserMenu from "@/components/UserMenu";

import { LessonsDrawer } from "@/components/lessons-drawer";

import {AppLogo} from "@nuru/ui/components/app-logo"
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@nuru/ui/components/dropdown-menu";

import { BookOpen, ChevronDown, Languages } from "lucide-react";
import { Dictionary } from "@/app/(main)/[lang]/dictionaries";

interface SiteHeaderProps {
	modules?: { id: string; slug: string; title: { sw: string; en: string } }[];
	lang: "en" | "sw";
	dict: Dictionary;
}

export function SiteHeader({ modules = [], lang, dict }: SiteHeaderProps) {
	const pathname = usePathname();
	const router = useRouter();

	const navItems = [
		{
			label: dict.header.home,
			href: `/${lang}`,
			active: pathname === `/${lang}`,
		},
		{
			label: dict.header.anza,
			href: `/${lang}/anza`,
			active: pathname.startsWith(`/${lang}/anza`),
		},
	];

	const toggleLanguage = () => {
		const newLang = lang === "sw" ? "en" : "sw";
		// Replace the language segment in the URL
		const segments = pathname.split("/");
		if (segments[1] === lang) {
			segments[1] = newLang;
			router.push(segments.join("/"));
		} else {
			router.push(`/${newLang}`);
		}
	};

	return (
		<>
			{/* Main Header Container */}
			<header className="border-border/50 bg-background/80 sticky top-0 right-0 left-0 z-40 border-b shadow-xs backdrop-blur-md">
				<div className="flex h-14 items-center justify-between px-4 md:px-8">
					{/* Logo Section (Left on Mobile & Desktop) */}
					<div className="flex items-center gap-2 md:order-1">
						<Link
							href={`/${lang}`}
							className="group flex items-center gap-3 transition-opacity hover:opacity-90"
						>
							<div className="relative">
								<div className="absolute inset-0 rounded-full bg-yellow-500/20 opacity-0 blur-lg transition-opacity duration-500 group-hover:opacity-100" />
								<AppLogo
									size={32}
									className="relative z-10 group-hover:animate-[logo-hover_3s_ease-in-out_infinite]"
								/>
							</div>

							<span className="hidden text-lg font-bold tracking-tight md:block">
								Nuru
							</span>
						</Link>
					</div>

					{/* Desktop Center Navigation */}
					<nav className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-2 md:order-2 md:flex">
						{navItems.map((item) => (
							<Link
								key={item.href}
								href={item.href}
								className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${
									item.active
										? "bg-foreground text-background shadow-xs"
										: "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
								}`}
							>
								{item.label}
							</Link>
						))}

						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<button className="text-muted-foreground hover:bg-muted/50 hover:text-foreground flex items-center gap-1 rounded-full px-4 py-2 text-sm font-medium transition-all">
									{dict.header.masomo}
									<ChevronDown className="h-3 w-3 opacity-50" />
								</button>
							</DropdownMenuTrigger>
							<DropdownMenuContent
								align="center"
								className="w-56 rounded-xl p-2"
							>
								<DropdownMenuItem
									asChild
									className="bg-muted/50 mb-1 rounded-lg"
								>
									<Link
										href={`/${lang}/masomo`}
										className="text-primary flex items-center gap-2 py-2 font-bold"
									>
										<BookOpen className="h-4 w-4" />
										<span>{dict.map.title}</span>
									</Link>
								</DropdownMenuItem>
								{modules.map((module) => (
									<DropdownMenuItem
										key={module.id}
										asChild
										className="rounded-lg"
									>
										<Link
											href={
												module.slug === "misingi-ya-nuru"
													? `/${lang}/anza`
													: `/${lang}/anza/${module.slug}`
											}
											className="flex items-center gap-2 py-2"
										>
											<div className="flex flex-col">
												<span className="text-sm font-medium">
													{module.title[lang] || module.title.sw}
												</span>
												<span className="text-muted-foreground text-[10px]">
													{lang === "sw" ? module.title.en : module.title.sw}
												</span>
											</div>
										</Link>
									</DropdownMenuItem>
								))}
							</DropdownMenuContent>
						</DropdownMenu>
					</nav>

					{/* Right Section: User Menu & Mobile Menu */}
					<div className="flex items-center gap-2 md:order-3">
						{/* Language Switcher */}
						<button
							onClick={toggleLanguage}
							className="bg-background/50 text-muted-foreground hover:bg-muted/50 hover:text-foreground flex items-center gap-2 rounded px-3 py-1.5 text-sm font-medium transition-all"
						>
							<Languages className="size-4" />
							<p className="hidden md:block">
								{lang === "sw" ? "English" : "Kiswahili"}
							</p>
						</button>

						{/* Mobile Lessons Drawer Trigger */}
						<div className="md:hidden">
							<LessonsDrawer modules={modules} lang={lang} dict={dict} />
						</div>
						<UserMenu />
					</div>
				</div>
			</header>
		</>
	);
}
