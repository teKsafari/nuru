"use client";

import { CheckCircle2, X, TrendingUp, ArrowRight } from "lucide-react";
import { Button } from "@nuru/ui/components/button";
import { usePlayground } from "./playground-context";

interface Props {
	onDismiss: () => void;
}

/**
 * Centered success card shown after a learner completes a lesson, matching
 * the "Lesson Complete" mockup. Avoids fake XP — only shows real signals
 * (tests passed, progress step). Dismiss via close button or Next Lesson.
 */
export function LessonCompleteOverlay({ onDismiss }: Props) {
	const {
		module,
		state: { currentLessonIndex = 0, testResults },
		lang,
		handleNextAction,
		nextActionLabel,
	} = usePlayground();

	if (!module) return null;
	const lesson = module.lessons[currentLessonIndex];
	if (!lesson) return null;

	const results = testResults ? Object.values(testResults) : [];
	const total = results.length;
	const passed = results.filter((r) => r.passed).length;
	const total_lessons = module.lessons.length;

	return (
		<div className="absolute inset-0 z-20 flex items-center justify-center bg-slate-900/10 p-6 backdrop-blur-[1px]">
			<div className="relative w-full max-w-md rounded-2xl border border-border bg-card p-8 shadow-2xl animate-in fade-in zoom-in-95 duration-300">
				<button
					onClick={onDismiss}
					aria-label="Close"
					className="absolute right-4 top-4 rounded-md p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground"
				>
					<X className="h-4 w-4" />
				</button>

				<div className="flex flex-col items-center text-center">
					<div className="mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-50 ring-8 ring-emerald-50/60">
						<CheckCircle2 className="h-10 w-10 text-emerald-500" />
					</div>

					<h2 className="text-[22px] font-bold tracking-tight text-foreground">
						Lesson Complete <span aria-hidden>🎉</span>
					</h2>
					<p className="mt-2 text-[13.5px] text-muted-foreground">
						Hongera! You've successfully completed
					</p>
					<p className="mt-1 text-[14px] font-semibold text-blue-600">
						{lesson.title[lang] || lesson.title.sw}
					</p>

					<div className="mt-6 grid w-full grid-cols-2 gap-3">
						{total > 0 && (
							<div className="rounded-xl border border-border bg-muted/60 px-3 py-3 text-center">
								<CheckCircle2 className="mx-auto mb-1 h-5 w-5 text-emerald-500" />
								<div className="text-[12.5px] font-semibold text-foreground">
									All Tests Passed
								</div>
								<div className="text-[11px] text-muted-foreground">
									{passed} / {total} tests passed
								</div>
							</div>
						)}
						<div className="rounded-xl border border-border bg-muted/60 px-3 py-3 text-center">
							<TrendingUp className="mx-auto mb-1 h-5 w-5 text-blue-500" />
							<div className="text-[12.5px] font-semibold text-foreground">
								Progress Updated
							</div>
							<div className="text-[11px] text-muted-foreground">
								Step {currentLessonIndex + 1} of {total_lessons}
							</div>
						</div>
					</div>

					<div className="mt-5 w-full rounded-xl border border-emerald-200 bg-emerald-50/70 px-4 py-3 text-left">
						<div className="flex items-center gap-2">
							<CheckCircle2 className="h-4 w-4 text-emerald-600" />
							<span className="text-[13px] font-semibold text-foreground">
								Excellent work!
							</span>
						</div>
						<p className="mt-1 text-[12.5px] text-muted-foreground">
							You've taken another great step in your coding journey.
						</p>
					</div>

					<div className="mt-6 flex w-full gap-2">
						{handleNextAction && (
							<Button
								onClick={() => {
									handleNextAction();
									onDismiss();
								}}
								className="h-10 flex-1 gap-2 rounded-xl bg-blue-600 text-[13px] font-semibold text-white hover:bg-blue-700"
							>
								{nextActionLabel || "Next Lesson"}
								<ArrowRight className="h-4 w-4" />
							</Button>
						)}
						<Button
							variant="outline"
							onClick={onDismiss}
							className="h-10 flex-1 rounded-xl border-border text-[13px] font-medium text-foreground"
						>
							Review Output
						</Button>
					</div>
				</div>
			</div>
		</div>
	);
}
