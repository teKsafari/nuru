"use client";

import React, { useContext } from "react";

import { signInAction, signOutAction } from "@/app/actions/auth";
import { AuthContext } from "@/components/providers/auth-provider";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function UserMenu() {
	const { isAuthenticated, claims } = useContext(AuthContext);

	if (!isAuthenticated) {
		return (
			<form action={signInAction}>
				<Button type="submit">Sign in</Button>
			</form>
		);
	}

	console.log({ claims });

	return (
		<DropdownMenu>
			<DropdownMenuTrigger>
				<Avatar>
					<AvatarImage src={claims.picture || undefined} />
					<AvatarFallback>
						{claims.name
							.split(" ")
							.map((el) => el[0])
							.join("")}
					</AvatarFallback>
				</Avatar>
			</DropdownMenuTrigger>
			<DropdownMenuContent className="w-44">
				<DropdownMenuLabel className="flex flex-col">
					{claims.name}
				</DropdownMenuLabel>

				<DropdownMenuSeparator />
				<form action={signOutAction}>
					<Button className="w-full" type="submit" variant="ghost">
						Sign out
					</Button>
				</form>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
