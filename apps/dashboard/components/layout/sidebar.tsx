"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@nuru/ui";
import { 
	LayoutDashboard, 
	BookOpen, 
	Users, 
	ShoppingBag, 
	Settings, 
	PlusCircle,
} from "lucide-react";
import { AppLogo } from "@nuru/ui";

const navigation = [
	{ name: "My Modules", href: "/educator/modules", icon: BookOpen },
	{ name: "Marketplace", href: "/marketplace", icon: ShoppingBag },
];

const secondaryNavigation = [
	// { name: "Settings", href: "/settings", icon: Settings },
];

export function Sidebar() {
	const pathname = usePathname();

	return (
		<div className="flex h-full w-72 flex-col bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 shadow-sm">
			<div className="flex h-16 items-center px-8">
				<Link href="/" className="flex items-center gap-3 transition-opacity hover:opacity-80">
					<div className="bg-primary/10 p-2 rounded-xl">
						<AppLogo size={24} className="text-primary" />
					</div>
					<span className="font-bold text-xl tracking-tight text-slate-900 dark:text-white">Nuru Educator</span>
				</Link>
			</div>
			
			<div className="flex-1 overflow-y-auto py-8">
				<div className="px-4 mb-8">
					<h3 className="px-4 mb-3 text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">
						Main Menu
					</h3>
					<nav className="space-y-1.5">
						{navigation.map((item) => {
							const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
							return (
								<Link
									key={item.name}
									href={item.href}
									className={cn(
										"flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition-all duration-200",
										isActive 
											? "bg-primary text-primary-foreground shadow-lg shadow-primary/20" 
											: "text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white"
									)}
								>
									<item.icon className={cn("h-5 w-5", isActive ? "text-primary-foreground" : "text-slate-400")} />
									{item.name}
								</Link>
							);
						})}
					</nav>
				</div>
				
				<div className="px-4">
					<h3 className="px-4 mb-3 text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">
						Settings
					</h3>
					<nav className="space-y-1.5">
						<Link
							href="/settings"
							className={cn(
								"flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition-all duration-200",
								pathname === "/settings"
									? "bg-primary text-primary-foreground shadow-lg shadow-primary/20" 
									: "text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white"
							)}
						>
							<Settings className={cn("h-5 w-5", pathname === "/settings" ? "text-primary-foreground" : "text-slate-400")} />
							General Settings
						</Link>
					</nav>
				</div>
			</div>
			
			<div className="p-6">
				<Link href="/educator/modules/create">
					<button className="group relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-2xl bg-primary px-4 py-4 text-sm font-bold text-primary-foreground transition-all hover:shadow-xl active:scale-95">
						<PlusCircle className="h-5 w-5" />
						Create Module
						<div className="absolute inset-0 translate-y-[100%] bg-white/10 to-transparent transition-transform group-hover:translate-y-[50%]" />
					</button>
				</Link>
			</div>
		</div>
	);
}
