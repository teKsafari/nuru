"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@nuru/ui/lib/utils";
import { AppLogo } from "@nuru/ui/components/app-logo";
import UserMenu from "@/components/UserMenu";
import { useDict } from "@/components/providers/lang-provider";
import { NAV, isActive, navLabels } from "./nav";
import { LangToggle, ThemeToggle } from "./toggles";

export function Sidebar() {
	const pathname = usePathname();
	const { t, lang } = useDict();

	return (
		<aside className="relative hidden h-full w-64 shrink-0 flex-col border-r-2 border-mstari bg-[#15120f] text-[#fff3d6] lg:flex">
			<Link href="/" className="flex items-center gap-3 px-5 pt-5 pb-6">
				<AppLogo size={36} />
				<span className="flex flex-col leading-none">
					<span className="font-display text-2xl font-extrabold tracking-tight">Nuru</span>
					<span className="lebo mt-1 text-jua">Chumba cha Walimu</span>
				</span>
			</Link>

			<nav className="flex-1 space-y-1.5 overflow-y-auto px-3" aria-label={t.nav.menu}>
				{NAV.map((item) => {
					const active = isActive(pathname, item.href);
					const { primary, secondary } = navLabels(item, t, lang);
					return (
						<Link
							key={item.key}
							href={item.href}
							aria-current={active ? "page" : undefined}
							className={cn(
								"group flex min-h-11 items-center gap-3 rounded-md border-2 px-3 py-2 transition-[background-color,transform] duration-100",
								active
									? "border-[#fff3d6] bg-jua text-[#15120f] shadow-[3px_3px_0_0_#fff3d6]"
									: "border-transparent text-[#fff3d6]/85 hover:border-[#fff3d6]/40 hover:text-[#fff3d6]",
							)}
						>
							<item.icon className="size-5 shrink-0" aria-hidden />
							<span className="flex flex-col leading-tight">
								<span className="font-semibold">{primary}</span>
								{secondary && <span className={cn("text-xs", active ? "text-[#15120f]/70" : "text-[#fff3d6]/55")}>{secondary}</span>}
							</span>
						</Link>
					);
				})}
			</nav>

			<div className="space-y-3 px-4 pb-4">
				<div className="flex items-center gap-2">
					<LangToggle tone="ink" />
					<ThemeToggle tone="ink" />
				</div>
				<UserMenu tone="ink" />
			</div>
		</aside>
	);
}
