"use client";

import React, { useContext } from "react";

import { signInAction, signOutAction } from "@/app/actions/auth";
import { AuthContext } from "@/components/providers/auth-provider";

import { Avatar, AvatarFallback, AvatarImage } from "@nuru/ui/components/avatar";
import { Button } from "@nuru/ui/components/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@nuru/ui/components/dropdown-menu";
import { User, Sprout, UserCogIcon, LogOutIcon } from "lucide-react";
import { SiGithub } from "@icons-pack/react-simple-icons";
import Link from "next/link";

export default function UserMenu() {
	const { isAuthenticated, claims } = useContext(AuthContext);

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
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
						<User className="text-muted-foreground h-5 w-5" />
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

				<DropdownMenuItem asChild className="mb-1 rounded-lg">
					<a
						href="https://github.com/nuruprogramming"
						target="_blank"
						rel="noopener noreferrer"
						className="flex cursor-pointer items-center gap-2 py-2"
					>
						<SiGithub className="h-4 w-4" />
						<span>GitHub</span>
					</a>
				</DropdownMenuItem>
				<DropdownMenuItem asChild className="mb-1 rounded-lg">
					<a
						href="https://teksafari.org"
						target="_blank"
						rel="noopener noreferrer"
						className="flex cursor-pointer items-center gap-2 py-2"
					>
						<Sprout className="h-4 w-4 text-[#00b4d8]" />
						<span>teKsafari</span>
					</a>
				</DropdownMenuItem>

				<DropdownMenuSeparator />

				{isAuthenticated ? (
					<>
						<Link href={"https://id.teksafari.org/account/security"}>
							<DropdownMenuItem>
								<UserCogIcon size={16} />
								Account Settings
							</DropdownMenuItem>
						</Link>
						<form action={signOutAction}>
							<Button
								className="h-auto w-full justify-start rounded-lg px-2 py-1.5 font-normal"
								type="submit"
								variant="ghost"
							>
								<LogOutIcon size={16} />
								Sign out
							</Button>
						</form>
					</>
				) : (
					<form action={signInAction}>
						<Button
							className="h-auto w-full justify-start rounded-lg px-2 py-1.5 font-normal"
							type="submit"
							variant="ghost"
						>
							Sign in
						</Button>
					</form>
				)}
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
