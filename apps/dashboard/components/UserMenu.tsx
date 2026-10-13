"use client";

import React, { useContext } from "react";
import Link from "next/link";

import { signInAction, signOutAction } from "@/app/actions/auth";
import { AuthContext } from "@/components/providers/auth-provider";
import { useDict } from "@/components/providers/lang-provider";

import { cn } from "@nuru/ui/lib/utils";

import { Avatar, AvatarFallback, AvatarImage } from "@nuru/ui/components/avatar";
import { Button } from "@nuru/ui/components/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@nuru/ui/components/dropdown-menu";
import { User, Sprout, LogOut, Settings, ChevronsUpDown, BookOpen } from "lucide-react";

function initials(name?: string | null, username?: string | null) {
	if (name) return name.split(" ").filter(Boolean).slice(0, 2).map((el) => el[0]).join("").toUpperCase();
	return username?.[0]?.toUpperCase() ?? "M";
}

/** `tone="ink"` sits on the dark sidebar. `compact` shows only the avatar (phone header). */
export default function UserMenu({ className, tone = "paper", compact = false }: { className?: string; tone?: "paper" | "ink"; compact?: boolean }) {
	const { isAuthenticated, claims } = useContext(AuthContext);
	const { t } = useDict();

	if (!isAuthenticated) {
		return (
			<form action={signInAction} className={className}>
				<Button type="submit" variant="outline" className={cn(!compact && "w-full")}>
					<User />
					{t.nav.signIn}
				</Button>
			</form>
		);
	}

	const avatar = (
		<Avatar className="size-9">
			<AvatarImage src={claims?.picture || undefined} />
			<AvatarFallback className="bg-jua font-display text-sm font-bold text-[#15120f]">{initials(claims?.name, claims?.username)}</AvatarFallback>
		</Avatar>
	);

	return (
		<div className={cn(!compact && "w-full", className)}>
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					{compact ? (
						<button type="button" className="rounded-full" aria-label={t.nav.account}>
							{avatar}
						</button>
					) : (
						<button
							type="button"
							className={cn(
								"flex w-full items-center gap-3 rounded-md border-2 p-2 text-left transition-colors",
								tone === "ink" ? "border-[#fff3d6]/30 hover:border-[#fff3d6]/70" : "border-mstari bg-card hover:bg-karatasi-2",
							)}
						>
							{avatar}
							<span className="flex min-w-0 flex-1 flex-col">
								<span className="truncate text-sm font-semibold">{claims?.name || claims?.username}</span>
								<span className={cn("truncate text-xs", tone === "ink" ? "text-[#fff3d6]/60" : "text-muted-foreground")}>{claims?.email}</span>
							</span>
							<ChevronsUpDown className="size-4 shrink-0 opacity-60" />
						</button>
					)}
				</DropdownMenuTrigger>
				<DropdownMenuContent align={compact ? "end" : "start"} side={compact ? "bottom" : "top"} sideOffset={8} className="w-64">
					<DropdownMenuLabel className="flex flex-col">
						<span className="text-sm font-semibold">{claims?.name || claims?.username}</span>
						<span className="truncate text-xs font-normal text-muted-foreground">{claims?.email}</span>
					</DropdownMenuLabel>
					<DropdownMenuSeparator />
					<DropdownMenuItem asChild>
						<Link href="/educator/modules">
							<BookOpen />
							Moduli
						</Link>
					</DropdownMenuItem>
					<DropdownMenuItem asChild>
						<Link href="/settings">
							<Settings />
							{t.nav.mipangilio}
						</Link>
					</DropdownMenuItem>
					<DropdownMenuItem asChild>
						<a href="https://teksafari.org" target="_blank" rel="noopener noreferrer">
							<Sprout className="text-mwani" />
							teKsafari
						</a>
					</DropdownMenuItem>
					<DropdownMenuSeparator />
					<form action={signOutAction}>
						<DropdownMenuItem asChild>
							<button type="submit" className="w-full text-pilipili">
								<LogOut />
								{t.nav.signOut}
							</button>
						</DropdownMenuItem>
					</form>
				</DropdownMenuContent>
			</DropdownMenu>
		</div>
	);
}
