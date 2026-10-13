"use client";

import Link from "next/link";
import { ArrowRight, Check, ChevronDown, Flag, Sparkles } from "lucide-react";

import type { Dictionary } from "@/app/(main)/[lang]/dictionaries";
import { Badge } from "@nuru/ui/components/badge";
import { Button } from "@nuru/ui/components/button";
import { cn } from "@nuru/ui/lib/utils";
import { moduleHref, rangiYaModuli } from "./rangi";
import { useLocalProgress } from "./progress-hook";

type Lang = "sw" | "en";

export interface RamaniModule {
	id: string;
	slug: string;
	title: Record<Lang, string>;
	difficulty?: string;
	lessons: { id: string; slug: string; title: Record<Lang, string> }[];
}

const DIFFICULTY_BADGE: Record<string, "success" | "info" | "purple"> = {
	mwanzilishi: "success",
	"wa kati": "info",
	"wa juu": "purple",
};

// Safari Yako: the curriculum as a journey. Each module is a stop on an ink
// path; its lessons are dots that fill in as this device completes them.
export function LessonsMap({ modules, lang, dict }: { modules: RamaniModule[]; lang: Lang; dict: Dictionary }) {
	const t = dict.tovuti.ramani;
	const progress = useLocalProgress(modules.map((m) => m.id));

	const isDone = (moduleId: string, lessonId: string) => progress?.[moduleId]?.has(lessonId) ?? false;
	const total = modules.reduce((n, m) => n + m.lessons.length, 0);
	const done = modules.reduce((n, m) => n + m.lessons.filter((l) => isDone(m.id, l.id)).length, 0);
	const percent = total ? Math.round((done / total) * 100) : 0;

	// The next lesson: the first one not yet completed, in curriculum order.
	let next: { module: RamaniModule; lesson: RamaniModule["lessons"][number]; index: number } | null = null;
	for (const [index, module] of modules.entries()) {
		const lesson = module.lessons.find((l) => !isDone(module.id, l.id));
		if (lesson) {
			next = { module, lesson, index };
			break;
		}
	}

	return (
		<div className="flex flex-col gap-12">
			{/* Summary and the one thing to do next */}
			<section className="kadi overflow-hidden" aria-label={t.title}>
				<div className="grid gap-6 p-5 sm:p-7 md:grid-cols-[auto_minmax(0,1fr)] md:items-center">
					<div className="flex items-baseline gap-1">
						<span className="font-display text-6xl leading-none font-extrabold tracking-[-0.04em] tabular-nums">{progress ? percent : "–"}</span>
						<span className="font-display text-2xl font-bold text-muted-foreground">%</span>
					</div>
					<div className="min-w-0">
						<p className="font-semibold">
							{progress ? done : "–"} {t.of} {total} {t.lessons}
						</p>
						<div className="mt-2 h-4 overflow-hidden rounded-sm border-2 border-mstari bg-karatasi-2" aria-hidden>
							<div className="h-full bg-mwani transition-[width] duration-500" style={{ width: `${percent}%` }} />
						</div>
						<p className="mt-2 text-sm text-muted-foreground">{t.savedHere}</p>
					</div>
				</div>
				<div className="border-t-2 border-mstari bg-karatasi-2 p-4 sm:px-7">
					{next ? (
						<div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
							<div className="min-w-0">
								<p className="lebo text-muted-foreground">{t.upNext}</p>
								<p className="truncate font-display text-xl font-bold">
									{next.lesson.title[lang] || next.lesson.title.sw}
									<span className="ml-2 text-base font-medium text-muted-foreground">· {next.module.title[lang] || next.module.title.sw}</span>
								</p>
							</div>
							<Button asChild size="lg" className="shrink-0">
								<Link href={`${moduleHref(lang, next.module.slug)}/${next.lesson.slug}`}>
									{done === 0 ? t.start : t.continue}
									<ArrowRight aria-hidden />
								</Link>
							</Button>
						</div>
					) : (
						<p className="flex items-center gap-2 font-display text-lg font-bold">
							<Sparkles className="size-5 text-jua" aria-hidden />
							{t.allDone}
						</p>
					)}
				</div>
			</section>

			{/* The path */}
			<div className="relative">
				<div className="absolute top-6 bottom-6 left-[1.4rem] w-0 border-l-[3px] border-dashed border-mstari/50 sm:left-[1.9rem]" aria-hidden />
				<ol className="relative flex flex-col gap-8">
				{modules.map((module, index) => {
					const rangi = rangiYaModuli(index);
					const moduleDone = module.lessons.filter((l) => isDone(module.id, l.id)).length;
					const complete = progress !== null && moduleDone === module.lessons.length && module.lessons.length > 0;
					const difficulty = module.difficulty ?? "";
					const difficultyLabel = dict.difficulty[difficulty as keyof typeof dict.difficulty] ?? difficulty;
					const title = module.title[lang] || module.title.sw;

					return (
						<li key={module.id} className={cn("relative flex gap-3 sm:gap-5", index % 2 === 1 && "md:pl-16")}>
							<div
								className={cn(
									"relative z-10 flex size-12 shrink-0 items-center justify-center rounded-full border-2 border-mstari font-display text-xl font-extrabold shadow-kivuli-sm sm:size-16 sm:text-2xl",
									rangi.bg,
									rangi.fg,
								)}
								aria-hidden
							>
								{complete ? <Check className="size-6 stroke-[3]" /> : index + 1}
							</div>

							<article className="kadi min-w-0 flex-1 overflow-hidden">
								<div className="p-4 pt-3 sm:p-6 sm:pt-4">
									<div className="flex flex-wrap items-center gap-2">
										<span className="lebo text-muted-foreground">
											{t.module} {index + 1}
										</span>
										{difficulty && (
											<Badge variant={DIFFICULTY_BADGE[difficulty] ?? "secondary"} className="-rotate-2">
												{difficultyLabel}
											</Badge>
										)}
										{complete && (
											<Badge variant="default" className="rotate-1">
												<Flag className="size-3" aria-hidden />
												{t.done}
											</Badge>
										)}
									</div>
									<h2 className="mt-2 font-display text-2xl leading-tight font-extrabold sm:text-3xl">
										<Link href={moduleHref(lang, module.slug)} className="hover:underline hover:decoration-jua hover:decoration-4 hover:underline-offset-4">
											{title}
										</Link>
									</h2>
									<p className="mt-1 text-sm text-muted-foreground">
										{progress ? moduleDone : "–"} {t.of} {module.lessons.length} {t.lessons}
									</p>

									<ul className="mt-4 flex flex-wrap gap-2" aria-label={`${title}: ${t.lessons}`}>
										{module.lessons.map((lesson, li) => {
											const lessonDone = isDone(module.id, lesson.id);
											const isNext = next?.lesson.id === lesson.id;
											const lessonTitle = lesson.title[lang] || lesson.title.sw;
											return (
												<li key={lesson.id}>
													<Link
														href={`${moduleHref(lang, module.slug)}/${lesson.slug}`}
														title={lessonTitle}
														aria-label={`${li + 1}. ${lessonTitle} (${lessonDone ? t.lessonDone : t.lessonTodo})`}
														className={cn(
															"flex size-10 items-center justify-center rounded-full border-2 font-mono text-[13px] font-bold transition-transform duration-100 hover:-translate-y-0.5 sm:size-9",
															lessonDone
																? cn("border-mstari", rangi.bg, rangi.fg)
																: isNext
																	? "animate-pulse-jua border-mstari bg-wino text-karatasi"
																	: "border-dashed border-mstari/50 bg-card text-foreground/70",
														)}
													>
														{lessonDone ? <Check className="size-4 stroke-[3]" aria-hidden /> : li + 1}
													</Link>
												</li>
											);
										})}
									</ul>

									<details className="group mt-4">
										<summary className="flex cursor-pointer list-none items-center gap-1 text-sm font-semibold text-foreground/75 hover:text-foreground [&::-webkit-details-marker]:hidden">
											<ChevronDown className="size-4 transition-transform group-open:rotate-180" aria-hidden />
											<span className="first-letter:uppercase">{t.lessons}</span>
										</summary>
										<ol className="mt-2 grid gap-x-6 gap-y-1 text-sm sm:grid-cols-2">
											{module.lessons.map((lesson, li) => (
												<li key={lesson.id}>
													<Link href={`${moduleHref(lang, module.slug)}/${lesson.slug}`} className="flex items-baseline gap-2 py-1 hover:underline">
														<span className="font-mono text-xs text-muted-foreground">{String(li + 1).padStart(2, "0")}</span>
														<span className={cn(isDone(module.id, lesson.id) && "text-muted-foreground line-through decoration-mwani decoration-2")}>
															{lesson.title[lang] || lesson.title.sw}
														</span>
													</Link>
												</li>
											))}
										</ol>
									</details>
								</div>
							</article>
						</li>
					);
				})}
			</ol>
			</div>
		</div>
	);
}
