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
	{ name: "Overview", href: "/educator", icon: LayoutDashboard },
	{ name: "My Lessons", href: "/educator/lessons", icon: BookOpen },
	{ name: "Organizations", href: "/educator/organizations", icon: Users },
	{ name: "Marketplace", href: "/marketplace", icon: ShoppingBag },
];

const secondaryNavigation = [
	{ name: "Settings", href: "/settings", icon: Settings },
];

export function Sidebar() {
	const pathname = usePathname();

	return (
		<div className="flex h-full w-64 flex-col border-r bg-muted/30">
			<div className="flex h-14 items-center border-b px-6">
				<Link href="/" className="flex items-center gap-2 font-semibold">
					<AppLogo size={24} />
					<span>Nuru Educator</span>
				</Link>
			</div>
			<div className="flex-1 overflow-y-auto py-4">
				<nav className="space-y-1 px-3">
					{navigation.map((item) => {
						const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
						return (
							<Link
								key={item.name}
								href={item.href}
								className={cn(
									"flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
									isActive 
										? "bg-secondary text-secondary-foreground" 
										: "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
								)}
							>
								<item.icon className="h-4 w-4" />
								{item.name}
							</Link>
						);
					})}
				</nav>
				
				<div className="mt-8 px-6">
					<h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
						Administration
					</h3>
					<nav className="mt-2 space-y-1">
						{secondaryNavigation.map((item) => {
							const isActive = pathname === item.href;
							return (
								<Link
									key={item.name}
									href={item.href}
									className={cn(
										"flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
										isActive 
											? "bg-secondary text-secondary-foreground" 
											: "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
									)}
								>
									<item.icon className="h-4 w-4" />
									{item.name}
								</Link>
							);
						})}
					</nav>
				</div>
			</div>
			
			<div className="p-4">
				<Link href="/educator/lessons/create">
					<button className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors">
						<PlusCircle className="h-4 w-4" />
						New Lesson
					</button>
				</Link>
			</div>
		</div>
	);
}
