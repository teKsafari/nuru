"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import * as React from "react";

import { Book, BookOpen, ChevronRight } from "lucide-react";

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
}

export function LessonsDrawer({ lessons = [] }: LessonsDrawerProps) {
	const [open, setOpen] = React.useState(false);
	const pathname = usePathname();

	const lessonItems = lessons.map(lesson => ({
		id: lesson.id,
		title: lesson.title.sw, // Default to Swahili for the drawer list
		enTitle: lesson.title.en,
		href: lesson.id === "misingi-ya-nuru" ? "/anza" : `/anza/${lesson.id}`,
		icon: <BookOpen className="h-5 w-5 text-blue-500" />,
	}));

	return (
		<Drawer open={open} onOpenChange={setOpen}>
			<DrawerTrigger asChild>
				<button
					className="group flex items-center justify-center rounded-full p-2 transition-colors hover:bg-muted"
					aria-label="Open lessons"
				>
					{open ? (
						<BookOpen className="h-6 w-6 scale-110 transform transition-all duration-300" />
					) : (
						<Book className="h-6 w-6 transition-all duration-300 group-hover:scale-105" />
					)}
				</button>
			</DrawerTrigger>
			<DrawerContent className="max-h-[80%]">
				<div className="mx-auto w-full max-w-sm overflow-y-auto">
					<DrawerHeader>
						<DrawerTitle className="text-center text-xl font-bold">
							Mafunzo (Lessons)
						</DrawerTitle>
					</DrawerHeader>
					<div className="flex flex-col space-y-3 p-4">
						{lessonItems.map((lesson) => (
							<Link
								key={lesson.id}
								href={lesson.href}
								onClick={() => setOpen(false)}
								className={cn(
									"flex items-center gap-4 rounded-xl border p-4 transition-all duration-200",
									pathname === lesson.href
										? "border-primary/50 bg-primary/5 shadow-sm"
										: "border-border hover:border-foreground/20 hover:bg-muted/50",
								)}
							>
								<div className="rounded-lg border border-border/50 bg-background p-2 shadow-sm">
									{lesson.icon}
								</div>
								<div className="flex-1">
									<h3 className="text-base font-medium">{lesson.title}</h3>
									<p className="text-xs text-muted-foreground italic">
										{lesson.enTitle}
									</p>
								</div>
								<ChevronRight className="h-4 w-4 text-muted-foreground" />
							</Link>
						))}
					</div>
					<DrawerFooter className="pt-2 pb-6">
						<p className="text-center text-[10px] text-muted-foreground uppercase tracking-widest">
							teKsafari © 2026
						</p>
					</DrawerFooter>
				</div>
			</DrawerContent>
		</Drawer>
	);
}
