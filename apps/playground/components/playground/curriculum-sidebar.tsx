"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
	BookOpen,
	ChevronDown,
	CheckCircle2,
	CircleDot,
	BarChart3,
	Lock,
} from "lucide-react";
import { cn } from "@nuru/ui/lib/utils";
import { ScrollArea } from "@/components/playground/scroll-area";
import { usePlayground } from "./playground-context";
import { Button } from "@nuru/ui/components/button";

export function CurriculumSidebar({ isMobile = false }: { isMobile?: boolean }) {
	const {
		module,
		allModules,
		state: { currentLessonIndex = 0, completedLessonIndices },
		actions: { onLessonChange },
		lang,
		setViewMode,
	} = usePlayground();
	const router = useRouter();

	const modules =
		allModules && allModules.length > 0
			? allModules
			: module
				? [module]
				: [];

	// Track client-mount so progress numbers are deterministic on first paint.
	// Server render and first client render both see the same defaults (zeros);
	// localStorage-backed values are applied only AFTER mount.
	const [mounted, setMounted] = useState(false);
	useEffect(() => {
		setMounted(true);
	}, []);

	// Hydrate completed indices for non-current modules from localStorage.
	const [completedByModule, setCompletedByModule] = useState<Record<string, Set<number>>>({});
	useEffect(() => {
		const next: Record<string, Set<number>> = {};
		for (const m of modules) {
			try {
				const raw = window.localStorage.getItem(`nuru-completed-${m.id}`);
				next[m.id] = raw ? new Set(JSON.parse(raw) as number[]) : new Set();
			} catch {
				next[m.id] = new Set();
			}
		}
		setCompletedByModule(next);
	}, [modules.length]);

	// Open state per module — current module open by default; others collapsed.
	const [open, setOpen] = useState<Record<string, boolean>>({});
	const initRef = useRef(false);
	useEffect(() => {
		if (initRef.current) return;
		if (modules.length === 0) return;
		const initial: Record<string, boolean> = {};
		for (const m of modules) initial[m.id] = m.id === module?.id;
		setOpen(initial);
		initRef.current = true;
	}, [modules.length, module?.id]);

	if (!module) return null;

	// Use deterministic zeros for the first render. After mount, real values
	// from props + localStorage take over (post-hydration).
	const currentCompleted = mounted ? completedLessonIndices : undefined;
	const completedByModuleSafe = mounted ? completedByModule : {};

	// Header card — overall progress across ALL modules.
	const totalAll = modules.reduce((n, m) => n + m.lessons.length, 0);
	const doneAll = modules.reduce((n, m) => {
		if (m.id === module.id) return n + (currentCompleted?.size ?? 0);
		return n + (completedByModuleSafe[m.id]?.size ?? 0);
	}, 0);
	const pctAll = totalAll === 0 ? 0 : Math.round((doneAll / totalAll) * 100);

	const setAllOpen = (value: boolean) => {
		const next: Record<string, boolean> = {};
		for (const m of modules) next[m.id] = value;
		setOpen(next);
	};

	if (isMobile) {
		return (
			<aside className="flex h-full w-full flex-col overflow-hidden rounded-[20px] border border-slate-200 bg-white shadow-sm">
				<div className="shrink-0 border-b border-slate-200 px-4 py-4">
					<div className="mb-2 flex items-center justify-between text-[12px] text-slate-500">
						<span>{pctAll}% complete</span>
						<span className="font-medium">{doneAll}/{totalAll}</span>
					</div>
					<div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
						<div
							className="h-full rounded-full bg-blue-600 transition-all duration-500"
							style={{ width: `${pctAll}%` }}
						/>
					</div>
					<div className="mt-4 flex items-center justify-between text-[13px] font-medium">
						<button type="button" onClick={() => setAllOpen(true)} className="text-blue-600">
							Expand all
						</button>
						<button type="button" onClick={() => setAllOpen(false)} className="text-slate-500">
							Collapse all
						</button>
					</div>
				</div>

				<ScrollArea className="min-h-0 flex-1">
					<div className="space-y-2 px-3 py-3">
						{modules.map((m, mi) => {
							const isCurrent = m.id === module.id;
							const isOpen = open[m.id] ?? isCurrent;
							const moduleDone = isCurrent
								? currentCompleted ?? new Set<number>()
								: completedByModuleSafe[m.id] ?? new Set<number>();
							const moduleTotal = m.lessons.length;
							const moduleDoneCount = moduleDone.size;
							const prev = modules[mi - 1];
							const prevDone = prev
								? (prev.id === module.id
									? (currentCompleted?.size ?? 0)
									: (completedByModuleSafe[prev.id]?.size ?? 0))
								: 0;
							const isUnlocked =
								mi === 0 ||
								isCurrent ||
								moduleDoneCount > 0 ||
								(prev && prevDone === prev.lessons.length);

							return (
								<div key={m.id} className="overflow-hidden rounded-2xl bg-white">
									<button
										type="button"
										onClick={() => setOpen((s) => ({ ...s, [m.id]: !isOpen }))}
										className={cn(
											"grid w-full grid-cols-[minmax(0,1fr)_auto] items-center gap-3 rounded-2xl px-3 py-3 text-left",
											isCurrent ? "bg-blue-50 text-blue-700" : "text-slate-900 hover:bg-slate-50",
											!isUnlocked && "opacity-70",
										)}
									>
										<span className="min-w-0">
											<span className="block truncate text-[15px] font-semibold">
												{m.slug || m.title[lang] || m.title.sw}
											</span>
											<span className="mt-1 block text-[12px] font-medium text-slate-500">
												{moduleDoneCount}/{moduleTotal} · {moduleTotal ? Math.round((moduleDoneCount / moduleTotal) * 100) : 0}%
											</span>
										</span>
										<span className="flex shrink-0 items-center gap-2">
											{!isUnlocked && <Lock className="h-3.5 w-3.5 text-slate-400" />}
											<ChevronDown className={cn("h-5 w-5 text-slate-400 transition-transform", !isOpen && "-rotate-90")} />
										</span>
									</button>

									{isOpen && (
										<ul className="space-y-1 px-1 py-1">
											{m.lessons.map((lesson, i) => {
												const isActive = isCurrent && i === currentLessonIndex;
												const isDone = moduleDone.has(i);
												return (
													<li key={lesson.id}>
														<button
															disabled={!isUnlocked}
															onClick={() => {
																setViewMode("lesson");
																if (isCurrent) {
																	onLessonChange?.(i);
																} else {
																	router.push(`/${lang}/anza/${m.slug}/${lesson.slug}`);
																}
															}}
															className={cn(
																"grid w-full grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 rounded-2xl px-3 py-3 text-left text-[14px] transition-colors disabled:cursor-not-allowed",
																isActive ? "bg-blue-50 text-blue-700" : "text-slate-700 hover:bg-slate-50",
															)}
														>
															<span className={cn("flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[12px] font-semibold", isActive || isDone ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-500")}>
																{isDone ? <CheckCircle2 className="h-4 w-4" /> : i + 1}
															</span>
															<span className="min-w-0 truncate">{lesson.title[lang] || lesson.title.sw}</span>
															<span className="shrink-0">
																{isActive ? (
																	<CircleDot className="h-5 w-5 text-blue-500" />
																) : !isUnlocked ? (
																	<Lock className="h-3.5 w-3.5 text-slate-300" />
																) : (
																	<span className="block h-4 w-4 rounded-full border border-slate-300" />
																)}
															</span>
														</button>
													</li>
												);
											})}
										</ul>
									)}
								</div>
							);
						})}
					</div>
				</ScrollArea>
			</aside>
		);
	}

	return (
		<aside className="flex h-full w-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
			{/* Header card */}
			<div className="border-b border-slate-200 px-5 pt-5 pb-4">
				<div className="flex items-center gap-2.5">
					<div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
						<BookOpen className="h-4 w-4" />
					</div>
					<h2 className="truncate text-[15px] font-semibold text-slate-900">
						Nuru Basics
					</h2>
				</div>
				<div className="mt-4">
					<div className="mb-1.5 flex items-center justify-between text-[11px] text-slate-500">
						<span>{pctAll}% complete</span>
						<span className="font-medium">{doneAll}/{totalAll}</span>
					</div>
					<div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
						<div
							className="h-full rounded-full bg-blue-600 transition-all duration-500"
							style={{ width: `${pctAll}%` }}
						/>
					</div>
				</div>
			</div>

			{/* All modules */}
			<ScrollArea className="min-h-0 flex-1">
				<div className="px-3 py-3">
					{modules.map((m, mi) => {
						const isCurrent = m.id === module.id;
						const isOpen = open[m.id] ?? isCurrent;
						const moduleDone = isCurrent
							? currentCompleted ?? new Set<number>()
							: completedByModuleSafe[m.id] ?? new Set<number>();
						const moduleTotal = m.lessons.length;
						const moduleDoneCount = moduleDone.size;
						// Unlocked if first module, OR previous module fully complete, OR has any progress
						const prev = modules[mi - 1];
						const prevDone = prev
							? (prev.id === module.id
								? (currentCompleted?.size ?? 0)
								: (completedByModuleSafe[prev.id]?.size ?? 0))
							: 0;
						const isUnlocked =
							mi === 0 ||
							isCurrent ||
							moduleDoneCount > 0 ||
							(prev && prevDone === prev.lessons.length);

						return (
							<div
								key={m.id}
								className={cn(
									"border-b border-slate-100 py-1 last:border-b-0",
									!isUnlocked && "opacity-70",
								)}
							>
								<button
									onClick={() =>
										setOpen((s) => ({ ...s, [m.id]: !isOpen }))
									}
									className={cn(
										"flex w-full items-center justify-between gap-2 rounded-lg px-2 py-2 text-left text-[13px] font-semibold hover:bg-slate-50",
										isCurrent ? "text-blue-700" : "text-slate-800",
									)}
								>
									<span className="flex min-w-0 items-center gap-2">
										{!isUnlocked && (
											<Lock className="h-3.5 w-3.5 shrink-0 text-slate-400" />
										)}
										<span className="truncate">
											{mi + 1}. {m.title[lang] || m.title.sw}
										</span>
									</span>
									<span className="flex shrink-0 items-center gap-2">
										<span className="text-[10.5px] font-medium text-slate-400">
											{moduleDoneCount}/{moduleTotal}
										</span>
										<ChevronDown
											className={cn(
												"h-4 w-4 text-slate-400 transition-transform",
												!isOpen && "-rotate-90",
											)}
										/>
									</span>
								</button>

								{isOpen && (
									<ul className="mt-1 space-y-0.5 pb-1">
										{m.lessons.map((lesson, i) => {
											const isActive =
												isCurrent && i === currentLessonIndex;
											const isDone = moduleDone.has(i);
											return (
												<li key={lesson.id}>
													<button
														disabled={!isUnlocked}
														onClick={() => {
															setViewMode("lesson");
															if (isCurrent) {
																onLessonChange?.(i);
															} else {
																router.push(
																	`/${lang}/anza/${m.slug}/${lesson.slug}`,
																);
															}
														}}
														className={cn(
															"group flex w-full items-center gap-3 rounded-lg px-2.5 py-2 text-left text-[13px] transition-colors disabled:cursor-not-allowed",
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
															) : !isUnlocked ? (
																<Lock className="h-3 w-3 text-slate-300" />
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
						);
					})}
				</div>
			</ScrollArea>

			{/* Footer CTA */}
			<div className="border-t border-slate-200 p-3">
				<Button
					variant="outline"
					onClick={() => setViewMode("progress")}
					className="h-10 w-full justify-between rounded-xl border-slate-200 bg-white text-[13px] font-medium text-slate-700 hover:bg-slate-50"
				>
					<span className="flex items-center gap-2">
						<BarChart3 className="h-4 w-4 text-blue-500" />
						View Progress
					</span>
					<ChevronDown className="h-4 w-4 -rotate-90 text-slate-400" />
				</Button>
			</div>
		</aside>
	);
}
