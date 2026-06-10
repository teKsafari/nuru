"use client";

import React, { useContext } from "react";

import { signInAction, signOutAction } from "@/app/actions/auth";
import { AuthContext } from "@/components/providers/auth-provider";

import { cn } from "@nuru/ui/lib/utils";

import { Avatar, AvatarFallback, AvatarImage } from "@nuru/ui/components/avatar";
import { Button } from "@nuru/ui/components/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@nuru/ui/components/dropdown-menu";
import { User, Sprout, LayoutDashboard, LogOut, Settings, ChevronsUpDown } from "lucide-react";
import Link from "next/link";

export default function UserMenu({ className }: { className?: string }) {
	const { isAuthenticated, claims } = useContext(AuthContext);

	return (
		<div className={cn("w-full", className)}>
			{!isAuthenticated ? (
				<form action={signInAction}>
					<Button className="w-full justify-start rounded-xl px-4 py-6 font-semibold" type="submit" variant="default">
						<User className="mr-2 h-5 w-5" />
						Sign in
					</Button>
				</form>
			) : (
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button variant="ghost" className="w-full h-auto flex items-center justify-between p-3 rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
							<div className="flex items-center gap-3 overflow-hidden">
								<Avatar className="h-10 w-10 border-2 border-primary/10">
									<AvatarImage src={claims?.picture || undefined} />
									<AvatarFallback className="bg-primary/5 text-primary font-semibold">
										{claims?.name
											? claims.name
													.split(" ")
													.map((el) => el[0])
													.join("")
											: claims?.username?.[0]?.toUpperCase()}
									</AvatarFallback>
								</Avatar>
								<div className="flex flex-col items-start overflow-hidden text-left">
									<span className="text-sm font-semibold truncate w-full text-slate-900 dark:text-slate-100">{claims?.name || claims?.username}</span>
									<span className="text-xs text-slate-500 dark:text-slate-400 truncate w-full">{claims?.email}</span>
								</div>
							</div>
							<ChevronsUpDown className="h-4 w-4 text-slate-400 flex-shrink-0" />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end" side="right" sideOffset={12} className="w-64 rounded-2xl p-2 shadow-xl border-slate-200 dark:border-slate-800">
						<DropdownMenuLabel className="flex flex-col p-2">
							<span className="text-sm font-semibold">{claims?.name || claims?.username}</span>
							<span className="text-xs text-muted-foreground truncate">{claims?.email}</span>
						</DropdownMenuLabel>
						<DropdownMenuSeparator />
						<DropdownMenuItem asChild className="rounded-xl p-2.5 cursor-pointer">
							<Link href="/educator/modules" className="flex items-center gap-3">
								<LayoutDashboard className="h-4 w-4 text-slate-500" />
								<span className="font-medium">Dashboard</span>
							</Link>
						</DropdownMenuItem>
						<DropdownMenuItem asChild className="rounded-xl p-2.5 cursor-pointer">
							<Link href="https://id.teksafari.org/account/security" className="flex items-center gap-3">
								<Settings className="h-4 w-4 text-slate-500" />
								<span className="font-medium">Account settings</span>
							</Link>
						</DropdownMenuItem>
						<DropdownMenuSeparator />

						<DropdownMenuItem asChild className="rounded-xl p-2.5 cursor-pointer">
							<a href="https://teksafari.org" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3">
								<Sprout className="h-4 w-4 text-[#00b4d8]" />
								<span className="font-medium">teKsafari</span>
							</a>
						</DropdownMenuItem>

						<DropdownMenuSeparator />

						<form action={signOutAction}>
							<Button className="w-full justify-start p-2.5 h-auto font-medium rounded-xl hover:bg-destructive/10 hover:text-destructive text-slate-600 dark:text-slate-300 transition-colors" type="submit" variant="ghost">
								<LogOut className="mr-3 h-4 w-4" />
								Sign out
							</Button>
						</form>
					</DropdownMenuContent>
				</DropdownMenu>
			)}
		</div>
	);
}
