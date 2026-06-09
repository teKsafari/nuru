"use client";

import UserMenu from "@/components/UserMenu";
import { Search, Bell } from "lucide-react";
import { Input } from "@nuru/ui/components/input";

export function Header() {
	return (
		<header className="sticky top-0 z-40 flex h-16 items-center justify-between bg-white/80 dark:bg-slate-900/80 backdrop-blur-md px-8 border-b border-slate-200 dark:border-slate-800">
			<div className="flex flex-1 items-center gap-4">
				<div className="relative w-full max-w-md group">
					<Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-primary transition-colors" />
					<Input
						type="search"
						placeholder="Search your library..."
						className="w-full h-10 bg-slate-100 dark:bg-slate-800 border-none rounded-2xl pl-10 focus-visible:ring-2 focus-visible:ring-primary/20 transition-all"
					/>
				</div>
			</div>
			<div className="flex items-center gap-4">
				{/* <div className="flex items-center gap-2 mr-2">
					<button className="p-2 rounded-xl text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition-all">
						<Bell className="h-5 w-5" />
					</button>
				</div> */}
				<div className="h-8 w-px bg-slate-200 dark:bg-slate-800 mr-2" />
				<UserMenu />
			</div>
		</header>
	);
}
