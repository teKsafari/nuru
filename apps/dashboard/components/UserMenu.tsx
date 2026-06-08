"use client";

import React, { useContext } from "react";

import { signInAction, signOutAction } from "@/app/actions/auth";
import { AuthContext } from "@/components/providers/auth-provider";

import {
	Avatar,
	AvatarFallback,
	AvatarImage,
	Button,
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@nuru/ui";
import { User, Sprout, LayoutDashboard, LogOut, Settings } from "lucide-react";
import Link from "next/link";

export default function UserMenu() {
	const { isAuthenticated, claims } = useContext(AuthContext);

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant="ghost" size="icon" className="rounded-full h-8 w-8">
					{isAuthenticated && claims ? (
						<Avatar className="h-8 w-8">
							<AvatarImage src={claims.picture || undefined} />
							<AvatarFallback>
								{claims.name
									? claims.name
											.split(" ")
											.map((el) => el[0])
											.join("")
									: claims.username[0].toUpperCase()}
							</AvatarFallback>
						</Avatar>
					) : (
						<User className="h-5 w-5 text-muted-foreground" />
					)}
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end" className="w-56 rounded-xl p-2">
				{isAuthenticated && claims ? (
					<>
						<DropdownMenuLabel className="flex flex-col">
							<span className="text-sm font-medium">{claims.name || claims.username}</span>
							<span className="text-xs text-muted-foreground truncate">{claims.email}</span>
						</DropdownMenuLabel>
						<DropdownMenuSeparator />
						<DropdownMenuItem asChild className="rounded-lg mb-1">
							<Link href="/educator/modules" className="flex items-center gap-2 cursor-pointer py-2">
								<LayoutDashboard className="h-4 w-4" />
								<span>Dashboard</span>
							</Link>
						</DropdownMenuItem>
						<DropdownMenuItem asChild className="rounded-lg mb-1">
							<Link href="/settings" className="flex items-center gap-2 cursor-pointer py-2">
								<Settings className="h-4 w-4" />
								<span>Settings</span>
							</Link>
						</DropdownMenuItem>
						<DropdownMenuSeparator />
					</>
				) : null}

				<DropdownMenuItem asChild className="rounded-lg mb-1">
					<a href="https://teksafari.org" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 cursor-pointer py-2">
						<Sprout className="h-4 w-4 text-[#00b4d8]" />
						<span>teKsafari</span>
					</a>
				</DropdownMenuItem>

				<DropdownMenuSeparator />
				
				{isAuthenticated ? (
					<form action={signOutAction}>
						<Button className="w-full justify-start px-2 py-1.5 h-auto font-normal rounded-lg text-destructive hover:text-destructive hover:bg-destructive/10" type="submit" variant="ghost">
							<LogOut className="mr-2 h-4 w-4" />
							Sign out
						</Button>
					</form>
				) : (
					<form action={signInAction}>
						<Button className="w-full justify-start px-2 py-1.5 h-auto font-normal rounded-lg" type="submit" variant="ghost">
							Sign in
						</Button>
					</form>
				)}
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
