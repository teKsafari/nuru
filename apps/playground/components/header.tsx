"use client";

import React, { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";

import UserMenu from "@/components/UserMenu";

import { MobileMenuDrawer } from "@/components/mobile-menu-drawer";
import { LessonsDrawer } from "@/components/lessons-drawer";

import { AppLogo } from "@/components/app-logo";

import { Menu, BookOpen, ChevronDown, Languages } from "lucide-react";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Dictionary } from "@/app/(main)/[lang]/dictionaries";

interface SiteHeaderProps {
	onMenuClick?: () => void;
	lessons?: { id: string; title: { sw: string; en: string } }[];
	lang: "en" | "sw";
	dict: Dictionary;
}

export function SiteHeader({ onMenuClick, lessons = [], lang, dict }: SiteHeaderProps) {
	const pathname = usePathname();
	const router = useRouter();
	const [menuOpen, setMenuOpen] = useState(false);

	const navItems = [
		{ label: dict.header.home, href: `/${lang}`, active: pathname === `/${lang}` },
		{ label: dict.header.anza, href: `/${lang}/anza`, active: pathname.startsWith(`/${lang}/anza`) },
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
			<MobileMenuDrawer isOpen={menuOpen} onClose={() => setMenuOpen(false)} lang={lang} dict={dict} />

			{/* Main Header Container */}
			<header className="sticky left-0 right-0 top-0 z-40 border-b border-border/50 bg-background/80 shadow-xs backdrop-blur-md">
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
								<button className="flex items-center gap-1 rounded-full px-4 py-2 text-sm font-medium text-muted-foreground transition-all hover:bg-muted/50 hover:text-foreground">
									{dict.header.masomo}
									<ChevronDown className="h-3 w-3 opacity-50" />
								</button>
							</DropdownMenuTrigger>
							<DropdownMenuContent align="center" className="w-56 rounded-xl p-2">
								{lessons.map((lesson) => (
									<DropdownMenuItem key={lesson.id} asChild className="rounded-lg">
										<Link
											href={lesson.id === "misingi-ya-nuru" ? `/${lang}/anza` : `/${lang}/anza/${lesson.id}`}
											className="flex items-center gap-2 py-2"
										>
											<div className="flex flex-col">
												<span className="text-sm font-medium">{lesson.title[lang] || lesson.title.sw}</span>
												<span className="text-[10px] text-muted-foreground">{lang === 'sw' ? lesson.title.en : lesson.title.sw}</span>
											</div>
										</Link>
									</DropdownMenuItem>
								))}
							</DropdownMenuContent>
						</DropdownMenu>
					</nav>

					{/* Right Section: User Menu & Mobile Menu */}
					<div className="flex items-center gap-2 md:order-3">
						{/* Desktop Language Switcher */}
						<button
							onClick={toggleLanguage}
							className="hidden items-center gap-2  bg-background/50 px-3 py-1.5 text-sm font-medium text-muted-foreground transition-all hover:bg-muted/50 hover:text-foreground md:flex"
						>
							<Languages className="size-4" />
							{lang === "sw" ? "English" : "Kiswahili"}
						</button>

						<UserMenu/>

						{/* Mobile Language Switcher */}
						<button
							onClick={toggleLanguage}
							className="flex h-8 w-8 items-center justify-center rounded-full border border-border/50 bg-background/50 text-muted-foreground transition-all hover:bg-muted/50 hover:text-foreground md:hidden"
						>
							<Languages className="h-4 w-4" />
						</button>

						{/* Mobile Lessons Drawer Trigger */}
						<div className="md:hidden">
							<LessonsDrawer lessons={lessons} lang={lang} dict={dict} />
						</div>

						{/* Mobile Menu Toggle (Moved to Right) */}
						<div className="flex items-center md:hidden">
							<button
								onClick={() => {
									setMenuOpen(true);
									onMenuClick?.();
								}}
								className="-mr-2 rounded-md p-2 transition-colors hover:bg-muted"
								aria-label="Menu"
							>
								<Menu className="h-6 w-6" />
							</button>
						</div>
					</div>
				</div>
			</header>
		</>
	);
}
