"use client";

import { CheckCircle2, Circle } from "lucide-react";
import { cn } from "@nuru/ui/lib/utils";
import { usePlayground } from "./playground-context";

/**
 * The single source of truth for lesson requirements, shared by the desktop
 * lesson-content panel and the mobile lesson panel. Renders the human-readable
 * (localized) requirement list, flagged against live test results:
 *   met = green check + strikethrough, unmet = red circle,
 *   not-yet-run = neutral circle (no spinner).
 * Requirements come from lesson.requirements first, otherwise derive from tests.
 */
export function RequirementsChecklist({ className }: { className?: string }) {
	const {
		module,
		state: { currentLessonIndex = 0, testResults },
		lang,
	} = usePlayground();

	const lesson = module?.lessons[currentLessonIndex];
	if (!lesson) return null;

	const requirements: { label: string; passed: boolean | undefined }[] = (
		lesson.requirements?.[lang] ||
		lesson.requirements?.sw ||
		[]
	).map((label, i) => {
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
							(t.message &&
								(typeof t.message === "string"
									? t.message
									: t.message[lang] || t.message.sw)) ||
							`Requirement ${i + 1}`;
						return { label, passed: r?.passed };
					})
			: [];

	const reqList = requirements.length > 0 ? requirements : fallbackReqs;
	if (reqList.length === 0) return null;

	return (
		<div
			className={cn(
				"overflow-hidden rounded-2xl border border-border bg-card",
				className,
			)}
		>
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
	);
}
