"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
	ChevronLeft,
	ChevronRight,
	Lightbulb,
	Target,
	AlertTriangle,
	CheckCircle2,
	ChevronRight as Crumb,
	Circle,
} from "lucide-react";
import { cn } from "@nuru/ui/lib/utils";
import { Button } from "@nuru/ui/components/button";
import Markdown from "react-markdown";
import { CodeEditor } from "@nuru/ui/components/code-editor";
import { useTheme } from "@wrksz/themes/client";
import { ScrollArea } from "@/components/playground/scroll-area";
import { usePlayground } from "./playground-context";
import { parseHighlights } from "@/lib/utils/highlights";
import { LessonCompleteOverlay } from "./lesson-complete-overlay";

/**
 * Middle column on desktop. Top sub-header carries breadcrumbs + language pill,
 * then a step progress strip with prev/next, then lesson body with task,
 * requirements checklist, hint and common-mistakes cards.
 */
export function LessonContentPanel() {
	const {
		module,
		state: { currentLessonIndex = 0, completedLessonIndices, testResults },
		actions: { onLessonChange },
		lang,
		labels,
		extensions,
		isCurrentLessonCompleted,
		setViewMode,
	} = usePlayground();


	const [dismissedAt, setDismissedAt] = useState<number | null>(null);
	useEffect(() => {
		setDismissedAt(null);
	}, [currentLessonIndex]);

	// Embedded code blocks follow the active theme (light until mounted, to match SSR).
	const { resolvedTheme } = useTheme();
	const [mounted, setMounted] = useState(false);
	useEffect(() => setMounted(true), []);
	const editorTheme: "dark" | "light" =
		mounted && resolvedTheme === "dark" ? "dark" : "light";
	const showOverlay =
		!!isCurrentLessonCompleted && dismissedAt !== currentLessonIndex;

	if (!module) return null;
	const lesson = module.lessons[currentLessonIndex];
	if (!lesson) return null;

	const total = module.lessons.length;
	const stepPct = total === 0 ? 0 : Math.round(((currentLessonIndex + 1) / total) * 100);

	const goPrev = () =>
		currentLessonIndex > 0 && onLessonChange?.(currentLessonIndex - 1);
	const goNext = () =>
		currentLessonIndex < total - 1 && onLessonChange?.(currentLessonIndex + 1);

	const moduleTitle = module.title[lang] || module.title.sw;
	const lessonTitle = lesson.title[lang] || lesson.title.sw;

	// Requirements derive from lesson.requirements first, otherwise from tests.
	const requirements: { label: string; passed: boolean | undefined }[] =
		(lesson.requirements?.[lang] || lesson.requirements?.sw || [])
			.map((label, i) => {
				const tid = lesson.tests?.[i]?.id;
				const r = tid ? testResults?.[tid] : undefined;
				return { label, passed: r?.passed };
			});

	// Fallback: derive from tests when no explicit requirements list.
	const fallbackReqs =
		requirements.length === 0 && lesson.tests
			? lesson.tests
					.filter((t: any) => t.isPublic !== false)
					.map((t: any, i: number) => {
						const r = testResults?.[t.id];
						const label =
							(t.message && (typeof t.message === "string" ? t.message : t.message[lang] || t.message.sw)) ||
							`Requirement ${i + 1}`;
						return { label, passed: r?.passed };
					})
			: [];

	const reqList = requirements.length > 0 ? requirements : fallbackReqs;

	const hintText = lesson.hint?.[lang] || lesson.hint?.sw;
	const mistakes = lesson.commonMistakes?.[lang] || lesson.commonMistakes?.sw;

	return (
		<div className="relative flex h-full w-full flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm">

			{showOverlay && (
				<LessonCompleteOverlay
					onDismiss={() => setDismissedAt(currentLessonIndex)}
				/>
			)}

			{/* Sub-header: breadcrumbs + language pill */}
			<div className="flex shrink-0 items-center justify-between gap-3 border-b border-border bg-card px-8 py-3">
				<nav className="flex min-w-0 items-center gap-1.5 text-[12px] text-muted-foreground">
					<button
						onClick={() => setViewMode("lesson-map")}
						className="hover:text-foreground"
					>
						{labels.modules}
					</button>
					<Crumb className="h-3 w-3 text-muted-foreground/60" />
					<button
						onClick={() => setViewMode("lesson-map")}
						className="max-w-[180px] truncate hover:text-foreground"
						title="Open Lesson Map"
					>
						{moduleTitle}
					</button>
					<Crumb className="h-3 w-3 text-muted-foreground/60" />
					<span className="max-w-[240px] truncate font-medium text-foreground">
						{lessonTitle}
					</span>
				</nav>

				<div className="flex shrink-0 items-center gap-2">
					<Link
						href={`/${lang === "en" ? "sw" : "en"}/anza/${module.slug}/${lesson.slug}`}
						className="inline-flex h-7 items-center gap-1.5 rounded-full border border-border bg-card px-2.5 text-[11px] font-semibold text-foreground hover:bg-muted"
						aria-label="Toggle language"
					>
						<span className="rounded-full bg-blue-50 px-1.5 py-0.5 text-[10px] font-bold text-blue-700">
							{lang.toUpperCase()}
						</span>
						<span className="text-muted-foreground">/ {lang === "en" ? "SW" : "EN"}</span>
					</Link>
				</div>
			</div>

			{/* Step header */}
			<div className="shrink-0 border-b border-border bg-card px-8 pt-4 pb-4">
				<div className="flex items-center justify-between gap-4">
					<div className="flex-1">
						<div className="mb-2 text-[12px] font-medium text-muted-foreground">
							Step {currentLessonIndex + 1} of {total}
						</div>
						<div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
							<div
								className="h-full rounded-full bg-blue-600 transition-all duration-500"
								style={{ width: `${stepPct}%` }}
							/>
						</div>
					</div>
					<div className="flex shrink-0 items-center gap-1">
						<Button
							variant="ghost"
							size="icon"
							onClick={goPrev}
							disabled={currentLessonIndex === 0}
							aria-label={labels.back}
							className="h-9 w-9 rounded-lg border border-border bg-card text-muted-foreground hover:bg-muted"
						>
							<ChevronLeft className="h-4 w-4" />
						</Button>
						<Button
							variant="ghost"
							size="icon"
							onClick={goNext}
							disabled={currentLessonIndex >= total - 1}
							aria-label={labels.next}
							className="h-9 w-9 rounded-lg border border-border bg-card text-muted-foreground hover:bg-muted"
						>
							<ChevronRight className="h-4 w-4" />
						</Button>
					</div>
				</div>
			</div>

			{/* Body */}
			<ScrollArea className="flex-1">
				<div className="mx-auto max-w-2xl px-8 py-8">
					<div
						key={currentLessonIndex}
						className="animate-in fade-in slide-in-from-right-2 duration-300"
					>
						<h1 className="mb-5 text-[26px] font-bold leading-tight tracking-tight text-foreground">
							{lessonTitle}
						</h1>

						<div className="prose prose-slate prose-sm max-w-none leading-relaxed text-foreground">
							<Markdown
								components={{
									code(props) {
										const { children, className, ...rest } = props;
										const match = /language-(\w+)/.exec(className || "");
										if (match) {
											const { cleanedCode, highlights } = parseHighlights(
												String(children).replace(/\n$/, ""),
											);
											return (
												<div className="not-prose my-4 overflow-hidden rounded-lg border border-border bg-muted/30">
													<CodeEditor
														code={cleanedCode}
														highlights={highlights}
														readOnly
														theme={editorTheme}
														extensions={extensions}
													/>
												</div>
											);
										}
										return (
											<code
												className="rounded-md bg-blue-50 px-1.5 py-0.5 font-mono text-[12.5px] font-medium text-blue-700"
												{...rest}
											>
												{children}
											</code>
										);
									},
									p: ({ children }) => (
										<p className="mb-4 last:mb-0 text-foreground">{children}</p>
									),
									h2: ({ children }) => (
										<h2 className="mt-6 mb-3 text-[15px] font-semibold text-foreground">
											{children}
										</h2>
									),
									h3: ({ children }) => (
										<h3 className="mt-5 mb-2 text-[14px] font-semibold text-foreground">
											{children}
										</h3>
									),
									ul: ({ children }) => (
										<ul className="mb-4 list-disc space-y-1 pl-5 text-foreground">{children}</ul>
									),
								}}
							>
								{lesson.description[lang] || lesson.description.sw}
							</Markdown>
						</div>

						{lesson.task && (
							<div className="mt-6 overflow-hidden rounded-2xl border border-amber-200 bg-amber-50/70">
								<div className="flex items-center gap-2 px-5 pt-4">
									<div className="flex h-7 w-7 items-center justify-center rounded-full bg-amber-100">
										<Target className="h-3.5 w-3.5 text-amber-600" />
									</div>
									<h4 className="text-[14px] font-semibold text-foreground">
										{labels.yourTask}
									</h4>
								</div>
								<div className="px-5 pt-2 pb-4 text-[13.5px] leading-relaxed text-foreground">
									{lesson.task[lang] || lesson.task.sw}
								</div>
							</div>
						)}

						{/* Requirements checklist (from real test results) */}
						{reqList.length > 0 && (
							<div className="mt-4 overflow-hidden rounded-2xl border border-border bg-card">
								<div className="border-b border-border px-5 py-3 text-[12px] font-semibold uppercase tracking-wider text-muted-foreground">
									Requirements
								</div>
								<ul className="divide-y divide-border">
									{reqList.map((r, i) => (
										<li key={i} className="flex items-start gap-3 px-5 py-2.5 text-[13px]">
											<span className="mt-0.5 shrink-0">
												{r.passed === true ? (
													<CheckCircle2 className="h-4 w-4 text-emerald-500" />
												) : r.passed === false ? (
													<Circle className="h-4 w-4 text-red-400" />
												) : (
													<Circle className="h-4 w-4 text-muted-foreground/60" />
												)}
											</span>
											<span
												className={cn(
													"min-w-0 flex-1 leading-relaxed",
													r.passed === true
														? "text-muted-foreground line-through"
														: "text-foreground",
												)}
											>
												{r.label}
											</span>
										</li>
									))}
								</ul>
							</div>
						)}

						{/* Hint card — only if lesson actually provides a hint */}
						{hintText && (
							<div className="mt-4 flex items-start gap-3 rounded-2xl border border-amber-100 bg-amber-50/50 px-5 py-4">
								<div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-amber-100">
									<Lightbulb className="h-3.5 w-3.5 text-amber-600" />
								</div>
								<div className="text-[13px] leading-relaxed text-foreground">
									<span className="mr-1 font-semibold text-foreground">
										{labels.hint}:
									</span>
									{hintText}
								</div>
							</div>
						)}

						{/* Common mistakes */}
						{mistakes && mistakes.length > 0 && (
							<div className="mt-4 overflow-hidden rounded-2xl border border-red-100 bg-red-50/40">
								<div className="flex items-center gap-2 px-5 pt-4">
									<div className="flex h-7 w-7 items-center justify-center rounded-full bg-red-100">
										<AlertTriangle className="h-3.5 w-3.5 text-red-600" />
									</div>
									<h4 className="text-[14px] font-semibold text-foreground">
										Common mistakes
									</h4>
								</div>
								<ul className="space-y-1.5 px-5 pb-4 pt-2 text-[13px] leading-relaxed text-foreground">
									{mistakes.map((m, i) => (
										<li key={i} className="flex gap-2">
											<span className="mt-1 h-1 w-1 shrink-0 rounded-full bg-red-400" />
											<span className="flex-1">{m}</span>
										</li>
									))}
								</ul>
							</div>
						)}

						{isCurrentLessonCompleted && (
							<div className="mt-4 flex items-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-4">
								<CheckCircle2 className="h-5 w-5 text-emerald-600" />
								<span className="text-[13.5px] font-medium text-emerald-800">
									{labels.completed} — great work!
								</span>
							</div>
						)}
					</div>
				</div>
			</ScrollArea>
		</div>
	);
}
