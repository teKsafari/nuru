"use client";

import { useEffect, useState } from "react";
import {
	CheckCircle2,
	PanelLeftClose,
	PanelLeftOpen,
	Circle,
} from "lucide-react";
import { cn } from "@nuru/ui/lib/utils";
import { ScrollArea } from "@/components/playground/scroll-area";
import { usePlayground } from "./playground-context";

const STORAGE_KEY = "nuru-sidebar-open";

export function LessonsSidebar() {
	const {
		module,
		state: { currentLessonIndex, completedLessonIndices },
		actions: { onLessonChange },
		lang,
		labels,
	} = usePlayground();

	// Default open; hydrate the persisted preference after mount to avoid SSR mismatch.
	const [open, setOpen] = useState(true);
	useEffect(() => {
		const stored = localStorage.getItem(STORAGE_KEY);
		if (stored !== null) setOpen(stored === "true");
	}, []);

	const toggle = () => {
		setOpen((prev) => {
			const next = !prev;
			localStorage.setItem(STORAGE_KEY, String(next));
			return next;
		});
	};

	if (!module || currentLessonIndex === undefined || !onLessonChange) {
		return null;
	}

	const lessons = module.lessons;
	const completed = completedLessonIndices ?? new Set<number>();

	// Collapsed: a slim rail showing only status dots + an expand affordance.
	if (!open) {
		return (
			<div className="border-border bg-card flex h-full w-12 shrink-0 flex-col items-center border-r py-3">
				<button
					onClick={toggle}
					aria-label={labels.modules}
					className="text-muted-foreground hover:bg-muted hover:text-foreground mb-3 flex h-8 w-8 items-center justify-center rounded-md transition-colors"
				>
					<PanelLeftOpen className="h-4 w-4" />
				</button>
				<ScrollArea className="w-full flex-1">
					<div className="flex flex-col items-center gap-1.5 py-1">
						{lessons.map((_, i) => {
							const isActive = i === currentLessonIndex;
							const isDone = completed.has(i);
							return (
								<button
									key={i}
									onClick={() => onLessonChange(i)}
									aria-label={`${labels.lesson} ${i + 1}`}
									title={lessons[i].title[lang] || lessons[i].title.sw}
									className={cn(
										"flex h-7 w-7 items-center justify-center rounded-md text-[11px] font-bold transition-colors",
										isActive
											? "bg-primary text-primary-foreground"
											: isDone
												? "text-success hover:bg-muted"
												: "text-muted-foreground hover:bg-muted",
									)}
								>
									{isDone && !isActive ? (
										<CheckCircle2 className="h-3.5 w-3.5" />
									) : (
										i + 1
									)}
								</button>
							);
						})}
					</div>
				</ScrollArea>
			</div>
		);
	}

	// Expanded: full list with titles, numbering, and status.
	return (
		<div className="border-border bg-card flex h-full w-64 shrink-0 flex-col border-r">
			<div className="border-border flex items-center justify-between gap-2 border-b px-4 py-3">
				<div className="flex min-w-0 flex-col">
					<span className="text-muted-foreground font-mono text-[9px] font-black tracking-widest uppercase">
						{labels.modules}
					</span>
					<h2 className="text-foreground truncate text-sm font-bold tracking-tight">
						{module.title[lang] || module.title.sw}
					</h2>
				</div>
				<button
					onClick={toggle}
					aria-label={labels.modules}
					className="text-muted-foreground hover:bg-muted hover:text-foreground flex h-8 w-8 shrink-0 items-center justify-center rounded-md transition-colors"
				>
					<PanelLeftClose className="h-4 w-4" />
				</button>
			</div>

			<ScrollArea className="flex-1">
				<div className="flex flex-col gap-0.5 p-2">
					{lessons.map((lesson, i) => {
						const isActive = i === currentLessonIndex;
						const isDone = completed.has(i);
						return (
							<button
								key={lesson.id}
								onClick={() => onLessonChange(i)}
								className={cn(
									"group flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left transition-colors",
									isActive
										? "bg-primary/10 text-primary"
										: "text-muted-foreground hover:bg-muted hover:text-foreground",
								)}
							>
								<span className="flex h-5 w-5 shrink-0 items-center justify-center">
									{isDone ? (
										<CheckCircle2 className="h-4 w-4 text-success" />
									) : isActive ? (
										<div className="bg-primary h-2 w-2 rounded-full" />
									) : (
										<Circle className="h-3.5 w-3.5 opacity-40" />
									)}
								</span>
								<span className="flex min-w-0 flex-col">
									<span className="font-mono text-[9px] tracking-widest uppercase opacity-60">
										{labels.lesson} {i + 1}
									</span>
									<span
										className={cn(
											"truncate text-[13px] leading-tight",
											isActive ? "font-semibold" : "font-medium",
										)}
									>
										{lesson.title[lang] || lesson.title.sw}
									</span>
								</span>
							</button>
						);
					})}
				</div>
			</ScrollArea>
		</div>
	);
}
