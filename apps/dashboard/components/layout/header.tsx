"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@nuru/ui/lib/utils";
import { AppLogo } from "@nuru/ui/components/app-logo";
import UserMenu from "@/components/UserMenu";
import { useDict } from "@/components/providers/lang-provider";
import { NAV, isActive } from "./nav";
import { LangToggle, ThemeToggle } from "./toggles";

// Phones and tablets: a top bar plus a row of nav tabs. The sidebar takes over at lg.
export function Header() {
	const pathname = usePathname();
	const { t } = useDict();

	return (
		<header className="sticky top-0 z-40 border-b-2 border-mstari bg-karatasi lg:hidden">
			<div className="flex h-14 items-center gap-2 px-4">
				<Link href="/" className="mr-auto flex items-center gap-2">
					<AppLogo size={28} />
					<span className="flex flex-col leading-none">
						<span className="font-display text-lg font-extrabold">Nuru</span>
						<span className="lebo text-[0.6rem] text-muted-foreground">Chumba cha Walimu</span>
					</span>
				</Link>
				<LangToggle />
				<ThemeToggle />
				<UserMenu compact />
			</div>
			<nav className="grid grid-cols-4 gap-1 px-2 pb-2" aria-label={t.nav.menu}>
				{NAV.map((item) => {
					const active = isActive(pathname, item.href);
					return (
						<Link
							key={item.key}
							href={item.href}
							aria-current={active ? "page" : undefined}
							className={cn(
								"flex min-h-11 flex-col items-center justify-center gap-0.5 rounded-md border-2 px-1 text-[11px] font-semibold leading-none sm:flex-row sm:gap-1.5 sm:text-sm",
								active ? "border-mstari bg-jua text-[#15120f] shadow-kivuli-sm" : "border-transparent text-muted-foreground hover:text-foreground",
							)}
						>
							<item.icon className="size-4" aria-hidden />
							{item.sw}
						</Link>
					);
				})}
			</nav>
		</header>
	);
}
