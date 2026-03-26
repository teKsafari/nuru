"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import * as React from "react";

import { Book, BookOpen, ChevronRight, CheckCircle2 } from "lucide-react";

import { cn } from "@/lib/utils";
import {
	Drawer,
	DrawerContent,
	DrawerHeader,
	DrawerTitle,
	DrawerTrigger,
	DrawerFooter,
} from "@/components/ui/drawer";

interface LessonsDrawerProps {
	lessons?: { id: string; title: { sw: string; en: string } }[];
	lang: "en" | "sw";
	dict: any;
}

export function LessonsDrawer({ lessons = [], lang, dict }: LessonsDrawerProps) {
	const [open, setOpen] = React.useState(false);
	const pathname = usePathname();

	const lessonItems = lessons.map((lesson, index) => ({
		id: lesson.id,
		title: lesson.title[lang] || lesson.title.sw,
		enTitle: lang === 'sw' ? lesson.title.en : lesson.title.sw,
		href: lesson.id === "misingi-ya-nuru" ? `/${lang}/anza` : `/${lang}/anza/${lesson.id}`,
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
						<DrawerTitle className="text-center text-xl font-bold flex items-center justify-center gap-2 text-foreground">
							{dict.lessonsDrawer?.title || "Jifunze na Nuru"}
						</DrawerTitle>
					</DrawerHeader>
					<div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
						<div className="grid grid-cols-1 gap-3 pb-8">
							{lessonItems.map((lesson, index) => (
								<Link
									key={lesson.id}
									href={lesson.href}
									onClick={() => setOpen(false)}
									className={cn(
										"group relative flex items-center gap-4 rounded-xl border p-4 transition-all duration-300 overflow-hidden",
										pathname === lesson.href
											? "border-primary/50 bg-primary/5 ring-1 ring-primary/20 shadow-xs"
											: "border-border hover:border-primary/30 hover:bg-muted/50 hover:shadow-md",
									)}
								>
									<div className={cn(
										"flex items-center justify-center w-8 h-8 rounded-full shrink-0 font-mono text-sm font-bold transition-colors",
										lesson.isCompleted ? "bg-green-500/10 text-green-500" : "bg-muted/50 text-muted-foreground group-hover:text-foreground"
									)}>
										{lesson.isCompleted ? <CheckCircle2 className="h-4 w-4" /> : index + 1}
									</div>
									<div className="flex-1 min-w-0">
										<h3 className={cn(
											"text-sm font-bold truncate leading-tight transition-colors",
											pathname === lesson.href ? "text-primary" : "group-hover:text-primary"
										)}>
											{lesson.title}
										</h3>
										<p className="text-[10px] text-muted-foreground italic truncate">
											{lesson.enTitle}
										</p>
									</div>
									<div className="flex items-center gap-2 shrink-0">
										<ChevronRight className={cn(
											"h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-1",
											pathname === lesson.href ? "text-primary" : ""
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