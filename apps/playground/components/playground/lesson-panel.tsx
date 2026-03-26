"use client";

import {
	ChevronDown,
	Languages,
	ChevronLeft,
	ChevronRight,
	Lightbulb,
	CheckCircle2,
	ArrowRight,
} from "lucide-react";
import { ScrollArea } from "@/components/playground/scroll-area";
import { Lesson, Language } from "@/types/playground";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import Markdown from "react-markdown";
import { CodeEditor } from "./code-editor";
import { Breadcrumbs } from "./breadcrumbs";

interface LessonPanelProps {
	lesson: Lesson;
	currentStepIndex: number;
	onStepChange: (index: number) => void;
	lang: Language;
	dict: any;
	collapsible?: boolean;
	expanded?: boolean;
	onToggle?: () => void;
	hideNavigation?: boolean;
	isCompleted?: boolean;
	completedStepIndices?: Set<number>;
	onNextLesson?: () => void;
}

export function LessonPanel({
	lesson,
	currentStepIndex,
	onStepChange,
	lang,
	dict,
	collapsible,
	expanded,
	onToggle,
	hideNavigation,
	isCompleted,
	completedStepIndices = new Set(),
	onNextLesson,
}: LessonPanelProps) {
	const step = lesson.steps[currentStepIndex];
	const isLastStep = currentStepIndex === lesson.steps.length - 1;

	const breadcrumbs = (
		<Breadcrumbs
			items={[
				{ label: dict.lessonPanel?.lessons || "Lessons", href: `/${lang}/anza` },
				{ label: lesson.title[lang] || lesson.title.sw, href: `/${lang}/anza/${lesson.id}` },
				{
					label: `${dict.lessonPanel?.step || "Step"} ${currentStepIndex + 1}`,
					current: true,
				},
			]}
			className={collapsible ? "mb-2" : "mb-6"}
		/>
	);

	const header = (
		<div className="mb-6 flex items-start justify-between gap-4">
			<div className="flex min-w-0 flex-1 flex-col gap-1">
				<h1 className="text-foreground text-2xl leading-tight font-bold lg:text-3xl">
					{step.title[lang] || step.title.sw}
				</h1>
			</div>
			<div className="flex shrink-0 flex-row items-center gap-2 md:flex-col md:items-end">
				{/* Status Indicator (Persistent to avoid layout shifts) */}
				<div
					className={cn(
						"flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[10px] font-bold tracking-wider uppercase transition-all duration-500",
						isCompleted
							? "border border-green-500/20 bg-green-500/10 text-green-500 shadow-xs"
							: "bg-muted/50 text-muted-foreground border border-transparent",
					)}
				>
					{isCompleted ? (
						<>
							<CheckCircle2 className="h-3 w-3" />
							{dict.lessonPanel?.completed || "Completed"}
						</>
					) : (
						<>
							<div className="bg-muted-foreground/40 h-1.5 w-1.5 animate-pulse rounded-full" />
							{dict.lessonPanel?.incomplete || "Incomplete"}
						</>
					)}
				</div>
			</div>
		</div>
	);

	const navigation = !hideNavigation && (
		<div className="border-border @container mt-8 flex items-center gap-4 border-t pt-4">
			<Button
				variant="outline"
				size="sm"
				// @ts-expect-error // unknown attr 'autoComplete'; needed for firefox
				autoComplete="off" // keep this here to prevent weird disabled null hydration errors on firefox. https://github.com/vercel/next.js/discussions/21999
				disabled={currentStepIndex == 0}
				onClick={() => onStepChange(currentStepIndex - 1)}
				className="h-8 text-xs"
			>
				<ChevronLeft className="mr-1 h-3 w-3" />
				{dict.lessonPanel?.back || "Back"}
			</Button>

			<div className="mx-auto flex flex-col items-center gap-1">
				<div className="text-muted-foreground font-mono text-[10px] tracking-wider uppercase">
					{dict.lessonPanel?.step || "Step"} {currentStepIndex + 1} /{" "}
					{lesson.steps.length}
				</div>
				<div className="hidden @md:flex">
					{lesson.steps.map((_, i) => (
						<button
							key={i}
							onClick={() => onStepChange(i)}
							className={cn(
								"h-1 w-4 rounded-full transition-all hover:scale-x-110",
								completedStepIndices.has(i)
									? "bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.4)]"
									: i === currentStepIndex
										? "bg-primary"
										: i < currentStepIndex
											? "bg-primary/40"
											: "bg-muted",
							)}
						/>
					))}
				</div>
			</div>

			{isLastStep && isCompleted && onNextLesson ? (
				<Button
					variant="default"
					size="sm"
					onClick={onNextLesson}
					className="h-8 animate-pulse bg-green-600 text-xs text-white hover:bg-green-700"
				>
					{dict.lessonPanel?.nextLesson || "Next Lesson"}
					<ArrowRight className="ml-1 h-3 w-3" />
				</Button>
			) : (
				<Button
					variant="default"
					size="sm"
					onClick={() => {
						if (currentStepIndex < lesson.steps.length - 1) {
							onStepChange(currentStepIndex + 1);
						}
					}}
					className="bg-primary hover:bg-primary/90 h-8 text-xs"
				>
					{currentStepIndex === lesson.steps.length - 1
						? dict.lessonPanel?.finish || "Finish"
						: dict.lessonPanel?.next || "Next"}
					<ChevronRight className="ml-1 h-3 w-3" />
				</Button>
			)}
		</div>
	);

	// Desktop: full height scrollable panel
	if (!collapsible) {
		return (
			<div className="bg-card relative flex h-full w-full flex-col">
				<ScrollArea className="h-0 flex-1 [&>div]:h-full [&>div>div]:flex! [&>div>div]:h-full [&>div>div]:flex-col">
					<div className="flex w-full min-w-0 flex-1 flex-col p-6 lg:p-8">
						<div className="flex-1">
							{breadcrumbs}
							{header}
							<div className="prose prose-sm dark:prose-invert text-muted-foreground max-w-none leading-relaxed">
								<Markdown
									components={{
										code(props) {
											const { children, className, ...rest } = props;
											const match = /language-(\w+)/.exec(className || "");
											return match ? (
												<div className="not-prose border-border bg-muted/30 my-4 overflow-hidden rounded-xl border p-2">
													<CodeEditor
														code={String(children).replace(/\n$/, "")}
														readOnly
													/>
												</div>
											) : (
												<code
													className="bg-muted text-foreground rounded px-1.5 py-0.5 font-mono text-sm"
													{...rest}
												>
													{children}
												</code>
											);
										},
									}}
								>
									{step.description[lang] || step.description.sw}
								</Markdown>
							</div>

							{step.task && (
								<div className="mt-6 rounded-xl border border-yellow-500/20 bg-yellow-500/5 p-4 shadow-xs">
									<h4 className="text-foreground mb-2 flex items-center gap-2 text-sm font-bold tracking-tight uppercase">
										<Lightbulb className="h-4 w-4 text-yellow-500" />
										{dict.lessonPanel?.yourTask || "Your Task:"}
									</h4>
									<p className="text-muted-foreground text-sm leading-normal italic">
										{step.task[lang] || step.task.sw}
									</p>
								</div>
							)}
						</div>
						{navigation}
					</div>
				</ScrollArea>
			</div>
		);
	}

	// Mobile: collapsible panel inside a resizable pane
	return (
		<div className="bg-card flex h-full flex-col overflow-hidden">
			<div
				role="button"
				tabIndex={0}
				onClick={onToggle}
				onKeyDown={(e) => {
					if (e.key === "Enter" || e.key === " ") {
						onToggle?.();
					}
				}}
				className="border-border bg-muted/30 flex w-full shrink-0 cursor-pointer items-center justify-between border-b px-4 py-2.5 text-left"
			>
				<div className="flex items-center gap-2 truncate">
					<h1 className="text-foreground truncate text-sm font-bold">
						{step.title[lang] || step.title.sw}
					</h1>
				</div>
				<div className="flex shrink-0 items-center gap-3">
					{isCompleted ? (
						<CheckCircle2 className="h-4 w-4 text-green-500" />
					) : (
						<div className="bg-muted-foreground/40 h-2 w-2 rounded-full" />
					)}
					<ChevronDown
						className={cn(
							"text-muted-foreground h-4 w-4 shrink-0 transition-transform duration-200",
							expanded && "rotate-180",
						)}
					/>
				</div>
			</div>
			{expanded && (
				<ScrollArea className="flex-1 [&>div>div]:h-full">
					<div className="flex min-h-full w-full min-w-0 flex-col px-4 py-4 text-sm">
						<div className="flex-1">
							<div className="text-muted-foreground mb-6 leading-relaxed">
								<Markdown
									components={{
										code(props) {
											const { children, className, ...rest } = props;
											const match = /language-(\w+)/.exec(className || "");
											return match ? (
												<div className="not-prose border-border bg-muted/30 my-4 overflow-hidden rounded-xl border">
													<CodeEditor
														code={String(children).replace(/\n$/, "")}
														readOnly
													/>
												</div>
											) : (
												<code
													className="bg-muted text-foreground rounded px-1.5 py-0.5 font-mono text-xs"
													{...rest}
												>
													{children}
												</code>
											);
										},
									}}
								>
									{step.description[lang] || step.description.sw}
								</Markdown>
							</div>
							{step.task && (
								<div className="mb-4 rounded-xl border border-yellow-500/20 bg-yellow-500/5 p-3 shadow-xs">
									<h4 className="text-foreground mb-1 flex items-center gap-2 text-xs font-bold tracking-tight uppercase">
										<Lightbulb className="h-3 w-3 text-yellow-500" />
										{dict.lessonPanel?.yourTask || "Your Task:"}
									</h4>
									<p className="text-muted-foreground text-xs leading-normal italic">
										{step.task[lang] || step.task.sw}
									</p>
								</div>
							)}
						</div>
						{navigation}
					</div>
				</ScrollArea>
			)}
		</div>
	);
}