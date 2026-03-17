"use client";

import React, { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";

import UserMenu from "@/components/UserMenu";

import { MobileMenuDrawer } from "@/components/mobile-menu-drawer";
import { LessonsDrawer } from "@/components/lessons-drawer";

import { AppLogo } from "@/components/app-logo";

import { Menu } from "lucide-react";

interface SiteHeaderProps {
	onMenuClick?: () => void;
	lessons?: { id: string; title: { sw: string; en: string } }[];
}

export function SiteHeader({ onMenuClick, lessons = [] }: SiteHeaderProps) {
	const pathname = usePathname();
	const [menuOpen, setMenuOpen] = useState(false);

	const navItems = [
		{ label: "Home", href: "/", active: pathname === "/" },
		{ label: "Anza", href: "/anza", active: pathname === "/anza" },
	];

	return (
		<>
			<MobileMenuDrawer isOpen={menuOpen} onClose={() => setMenuOpen(false)} />

			{/* Main Header Container */}
			<header className="sticky left-0 right-0 top-0 z-40 border-b border-border/50 bg-background/80 shadow-sm backdrop-blur-md">
				<div className="flex h-14 items-center justify-between px-4 md:px-8">
					{/* Logo Section (Left on Mobile & Desktop) */}
					<div className="flex items-center gap-2 md:order-1">
						<Link
							href="/"
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
					<nav className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-1 md:order-2 md:flex">
						{navItems.map((item) => (
							<Link
								key={item.href}
								href={item.href}
								className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${
									item.active
										? "bg-foreground text-background shadow-sm"
										: "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
								}`}
							>
								{item.label}
							</Link>
						))}
					</nav>

					{/* Right Section: User Menu & Mobile Menu */}
					<div className="flex items-center gap-2 md:order-3">
						<UserMenu/>

						{/* Mobile Lessons Drawer Trigger */}
						<div className="md:hidden">
							<LessonsDrawer lessons={lessons} />
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
