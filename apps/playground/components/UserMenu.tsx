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
import { User, Sprout } from "lucide-react";
import { SiGithub } from "@icons-pack/react-simple-icons";

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
									.split(" ")
									.map((el) => el[0])
									.join("")}
							</AvatarFallback>
						</Avatar>
					) : (
						<User className="h-5 w-5 text-muted-foreground" />
					)}
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end" className="w-48 rounded-xl p-2">
				{isAuthenticated && claims ? (
					<>
						<DropdownMenuLabel className="flex flex-col">
							{claims.name}
						</DropdownMenuLabel>
						<DropdownMenuSeparator />
					</>
				) : null}

				<DropdownMenuItem asChild className="rounded-lg mb-1">
					<a href="https://github.com/nuruprogramming" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 cursor-pointer py-2">
						<SiGithub className="h-4 w-4" />
						<span>GitHub</span>
					</a>
				</DropdownMenuItem>
				<DropdownMenuItem asChild className="rounded-lg mb-1">
					<a href="https://teksafari.org" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 cursor-pointer py-2">
						<Sprout className="h-4 w-4 text-[#00b4d8]" />
						<span>teKsafari</span>
					</a>
				</DropdownMenuItem>

				<DropdownMenuSeparator />
				
				{isAuthenticated ? (
					<form action={signOutAction}>
						<Button className="w-full justify-start px-2 py-1.5 h-auto font-normal rounded-lg" type="submit" variant="ghost">
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
