"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import * as React from "react";

import { Book, BookOpen, ChevronRight, CheckCircle2 } from "lucide-react";

import { cn } from "@nuru/ui/lib/utils";
import { Drawer } from "@nuru/ui/components/drawer";
import { DrawerContent } from "@nuru/ui/components/drawer";
import { DrawerHeader } from "@nuru/ui/components/drawer";
import { DrawerTitle } from "@nuru/ui/components/drawer";
import { DrawerTrigger } from "@nuru/ui/components/drawer";
import { DrawerFooter } from "@nuru/ui/components/drawer";
import { Dictionary } from "@/app/(main)/[lang]/dictionaries";

interface LessonsDrawerProps {
	modules?: { id: string; slug: string; title: { sw: string; en: string } }[];
	lang: "en" | "sw";
	dict: Dictionary;
}

export function LessonsDrawer({ modules = [], lang, dict }: LessonsDrawerProps) {
	const [open, setOpen] = React.useState(false);
	const pathname = usePathname();

	const moduleItems = modules.map((module, index) => ({
		id: module.id,
		title: module.title[lang] || module.title.sw,
		enTitle: lang === 'sw' ? module.title.en : module.title.sw,
		href: module.slug === "misingi-ya-nuru" ? `/${lang}/anza` : `/${lang}/anza/${module.slug}`,
		isCompleted: index === 0, // Placeholder for actual progress logic
	}));

	return (
		<Drawer open={open} onOpenChange={setOpen}>
			<DrawerTrigger asChild>
				<button
					className="group flex items-center justify-center rounded-full p-2 transition-colors hover:bg-muted"
					aria-label="Open lessons"
				>
					{open ? (
						<BookOpen className="h-6 w-6 scale-110 transform transition-all duration-300 text-primary" />
					) : (
						<Book className="h-6 w-6 transition-all duration-300 group-hover:scale-105" />
					)}
				</button>
			</DrawerTrigger>
			<DrawerContent className="max-h-[85%]">
				<div className="mx-auto w-full max-w-xl overflow-hidden flex flex-col h-full">
					<DrawerHeader className="border-b border-border/50 pb-4">
						<DrawerTitle className="text-center text-xl font-bold flex flex-col items-center justify-center gap-2 text-foreground">
							<span>{dict.lessonsDrawer.title}</span>
							<Link 
								href={`/${lang}/masomo`} 
								onClick={() => setOpen(false)}
								className="text-xs font-medium text-primary hover:underline flex items-center gap-1"
							>
								<BookOpen className="h-3 w-3" />
								{dict.map.title}
							</Link>
						</DrawerTitle>
					</DrawerHeader>
					<div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
						<div className="grid grid-cols-1 gap-3 pb-8">
							{moduleItems.map((module, index) => (
								<Link
									key={module.id}
									href={module.href}
									onClick={() => setOpen(false)}
									className={cn(
										"group relative flex items-center gap-4 rounded-xl border p-4 transition-all duration-300 overflow-hidden",
										pathname === module.href
											? "border-primary/50 bg-primary/5 ring-1 ring-primary/20 shadow-xs"
											: "border-border hover:border-primary/30 hover:bg-muted/50 hover:shadow-md",
									)}
								>
									<div className={cn(
										"flex items-center justify-center w-8 h-8 rounded-full shrink-0 font-mono text-sm font-bold transition-colors",
										module.isCompleted ? "bg-success/10 text-success" : "bg-muted/50 text-muted-foreground group-hover:text-foreground"
									)}>
										{module.isCompleted ? <CheckCircle2 className="h-4 w-4" /> : index + 1}
									</div>
									<div className="flex-1 min-w-0">
										<h3 className={cn(
											"text-sm font-bold truncate leading-tight transition-colors",
											pathname === module.href ? "text-primary" : "group-hover:text-primary"
										)}>
											{module.title}
										</h3>
										<p className="text-[10px] text-muted-foreground italic truncate">
											{module.enTitle}
										</p>
									</div>
									<div className="flex items-center gap-2 shrink-0">
										<ChevronRight className={cn(
											"h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-1",
											pathname === module.href ? "text-primary" : ""
										)} />
									</div>
									
								</Link>
							))}
						</div>
					</div>
				</div>
			</DrawerContent>
		</Drawer>
	);
}