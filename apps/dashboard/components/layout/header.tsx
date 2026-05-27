"use client";

import UserMenu from "@/components/UserMenu";
import { Search, Bell } from "lucide-react";
import { Input } from "@nuru/ui";

export function Header() {
	return (
		<header className="flex h-14 items-center justify-between border-b bg-background px-6">
			<div className="flex flex-1 items-center gap-4">
				<div className="relative w-full max-w-md">
					<Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
					<Input
						type="search"
						placeholder="Search lessons, modules..."
						className="w-full bg-muted/50 pl-8 focus-visible:bg-background"
					/>
				</div>
			</div>
			<div className="flex items-center gap-4">
				{/* Notifications hidden for now */}
				<UserMenu />
			</div>
		</header>
	);
}
