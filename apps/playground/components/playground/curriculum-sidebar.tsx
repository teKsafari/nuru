"use client";

import Link from "next/link";
import { useState } from "react";
import { BookOpen, ChevronDown, CheckCircle2, CircleDot, Trophy } from "lucide-react";
import { cn } from "@nuru/ui/lib/utils";
import { ScrollArea } from "@/components/playground/scroll-area";
import { usePlayground } from "./playground-context";
import { Button } from "@nuru/ui/components/button";

/**
 * Left curriculum sidebar shown on desktop. Mirrors the uploaded mockups:
 * - Module title card with progress bar
 * - Expandable section list (currently we render a single section based on the active module)
 * - Numbered lesson rows with active / completed states
 * - "View Progress" CTA pinned to the bottom
 */
export function CurriculumSidebar() {
	const {
		module,
		state: { currentLessonIndex = 0, completedLessonIndices },
		actions: { onLessonChange },
		lang,
		labels,
	} = usePlayground();

	const [expanded, setExpanded] = useState(true);

	if (!module) return null;

	const total = module.lessons.length;
	const completed = completedLessonIndices?.size ?? 0;
	const pct = total === 0 ? 0 : Math.round((completed / total) * 100);

	return (
		<aside className="flex h-full w-full flex-col border-r border-slate-200 bg-white">
			{/* Module header card */}
			<div className="border-b border-slate-200 px-5 pt-5 pb-4">
				<div className="flex items-center gap-2.5">
					<div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
						<BookOpen className="h-4 w-4" />
					</div>
					<h2 className="truncate text-[15px] font-semibold text-slate-900">
						{module.title[lang] || module.title.sw}
					</h2>
				</div>
				<div className="mt-4">
					<div className="mb-1.5 flex items-center justify-between text-[11px] text-slate-500">
						<span>{pct}% complete</span>
						<span className="font-medium">{completed}/{total}</span>
					</div>
					<div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
						<div
							className="h-full rounded-full bg-blue-600 transition-all duration-500"
							style={{ width: `${pct}%` }}
						/>
					</div>
				</div>
			</div>

			{/* Lessons */}
			<ScrollArea className="flex-1">
				<div className="px-3 py-3">
					<button
						onClick={() => setExpanded((v) => !v)}
						className="flex w-full items-center justify-between rounded-lg px-2 py-2 text-left text-[13px] font-semibold text-blue-700 hover:bg-slate-50"
					>
						<span className="truncate">
							{module.title[lang] || module.title.sw}
						</span>
						<ChevronDown
							className={cn(
								"h-4 w-4 shrink-0 text-slate-400 transition-transform",
								!expanded && "-rotate-90",
							)}
						/>
					</button>

					{expanded && (
						<ul className="mt-1 space-y-0.5">
							{module.lessons.map((lesson, i) => {
								const isActive = i === currentLessonIndex;
								const isDone = completedLessonIndices?.has(i) ?? false;
								return (
									<li key={lesson.id}>
										<button
											onClick={() => onLessonChange?.(i)}
											className={cn(
												"group flex w-full items-center gap-3 rounded-lg px-2.5 py-2 text-left text-[13px] transition-colors",
												isActive
													? "bg-blue-50 text-blue-700"
													: "text-slate-600 hover:bg-slate-50 hover:text-slate-900",
											)}
										>
											<span
												className={cn(
													"flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[11px] font-semibold",
													isActive
														? "bg-blue-600 text-white"
														: isDone
															? "bg-slate-100 text-slate-500"
															: "bg-slate-100 text-slate-500",
												)}
											>
												{i + 1}
											</span>
											<span className="min-w-0 flex-1 truncate">
												{lesson.title[lang] || lesson.title.sw}
											</span>
											<span className="shrink-0">
												{isDone ? (
													<CheckCircle2 className="h-4 w-4 text-emerald-500" />
												) : isActive ? (
													<CircleDot className="h-4 w-4 text-blue-500" />
												) : (
													<span className="block h-3.5 w-3.5 rounded-full border border-slate-300" />
												)}
											</span>
										</button>
									</li>
								);
							})}
						</ul>
					)}
				</div>
			</ScrollArea>

			{/* Footer CTA */}
			<div className="border-t border-slate-200 p-3">
				<Button
					asChild
					variant="outline"
					className="h-10 w-full justify-between rounded-xl border-slate-200 bg-white text-[13px] font-medium text-slate-700 hover:bg-slate-50"
				>
					<Link href={`/${lang}/masomo`}>
						<span className="flex items-center gap-2">
							<Trophy className="h-4 w-4 text-amber-500" />
							View Progress
						</span>
						<ChevronDown className="h-4 w-4 -rotate-90 text-slate-400" />
					</Link>
				</Button>
			</div>
		</aside>
	);
}
