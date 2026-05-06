"use client";

import {
	ChevronDown,
	ChevronLeft,
	ChevronRight,
	Lightbulb,
	CheckCircle2,
	ArrowRight,
} from "lucide-react";
import { ScrollArea } from "@/components/playground/scroll-area";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import Markdown from "react-markdown";
import { CodeEditor } from "./code-editor";
import { Breadcrumbs } from "./breadcrumbs";
import { usePlayground } from "./playground-context";
import { parseHighlights } from "@/lib/utils/highlights";

interface LessonPanelProps {
	collapsible?: boolean;
	expanded?: boolean;
	onToggle?: () => void;
	hideNavigation?: boolean;
}

export function LessonPanel({
	collapsible,
	expanded,
	onToggle,
	hideNavigation,
}: LessonPanelProps) {
	const {
		lesson,
		state: { currentStepIndex, completedStepIndices },
		actions: { onStepChange, onNextLesson },
		lang,
		labels,
		isCurrentStepCompleted: isCompleted,
		extensions,
	} = usePlayground();

	const step = lesson.steps[currentStepIndex];
	const isLastStep = currentStepIndex === lesson.steps.length - 1;

	const breadcrumbs = (
		<Breadcrumbs
			items={[
				{ label: labels.lessons, href: `/${lang}/anza` },
				{
					label: lesson.title[lang] || lesson.title.sw,
					href: `/${lang}/anza/${lesson.id}`,
				},
				{
					label: `${labels.step} ${currentStepIndex + 1}`,
					current: true,
				},
			]}
			className={collapsible ? "mb-2" : "mb-6"}
		/>
	);

	const header = (
		<div className="mb-8 flex items-start justify-between gap-4">
			<div className="flex min-w-0 flex-1 flex-col gap-1.5">
				<h1 className="text-foreground text-2xl leading-tight font-bold tracking-tight lg:text-3xl font-mono!">
					{step.title[lang] || step.title.sw}
				</h1>
				<div className="flex items-center gap-2">
					<div className="bg-primary/30 h-px w-8" />
					<span className="text-muted-foreground font-mono text-[10px] tracking-widest uppercase">
						{labels.step} {currentStepIndex + 1} {labels.of}{" "}
						{lesson.steps.length}
					</span>
				</div>
			</div>
			<div className="flex shrink-0 flex-row items-center gap-2 md:flex-col md:items-end">
				<div
					className={cn(
						"flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-black tracking-wider uppercase transition-all duration-500",
						isCompleted
							? "border border-green-500/30 bg-green-500/10 text-green-500 shadow-[0_0_10px_-2px_rgba(34,197,94,0.2)]"
							: "bg-muted/50 text-muted-foreground border border-transparent",
					)}
				>
					{isCompleted ? (
						<>
							<CheckCircle2 className="h-3 w-3 stroke-3" />
							{labels.completed}
						</>
					) : (
						<>
							<div className="bg-muted-foreground/40 h-1.5 w-1.5 animate-pulse rounded-full" />
							{labels.incomplete}
						</>
					)}
				</div>
			</div>
		</div>
	);

	const navigation = !hideNavigation && (
		<div className="border-border bg-card/50 @container sticky bottom-0 mt-auto flex items-center justify-between gap-2 border-t pt-6 pb-2 backdrop-blur-xs">
			<Button
				variant="outline"
				size="sm"
				// @ts-expect-error // unknown attr 'autoComplete'; // keep this here to prevent weird disabled null hydration errors on firefox. https://github.com/vercel/next.js/discussions/21999
				autoComplete="off"
				disabled={currentStepIndex == 0}
				onClick={() => onStepChange(currentStepIndex - 1)}
				className="border-border/50 bg-background/50 hover:bg-muted h-9 px-3 text-xs font-bold transition-all shrink-0"
			>
				<ChevronLeft className="mr-1.5 h-4 w-4" />
				<span className="hidden @[300px]:inline">{labels.back}</span>
			</Button>

			<div className="flex flex-col items-center gap-1.5 overflow-hidden">
				<div className="flex items-center gap-1 overflow-x-auto no-scrollbar max-w-full px-2">
					{lesson.steps.map((_, i) => (
						<button
							key={i}
							onClick={() => onStepChange(i)}
							className={cn(
								"h-1.5 rounded-full transition-all duration-300 shrink-0",
								i === currentStepIndex
									? "bg-primary w-4 shadow-[0_0_8px_rgba(var(--primary),0.4)]"
									: completedStepIndices.has(i)
										? "w-2 bg-green-500 hover:w-3"
										: i < currentStepIndex
											? "bg-primary/40 w-1.5 hover:w-2"
											: "bg-muted w-1.5 hover:w-2",
							)}
						/>
					))}
				</div>
				<span className="text-muted-foreground font-mono text-[9px] uppercase tracking-tighter @[300px]:tracking-widest">
					{currentStepIndex + 1} / {lesson.steps.length}
				</span>
			</div>

			{isLastStep && isCompleted && onNextLesson ? (
				<Button
					variant="default"
					size="sm"
					onClick={onNextLesson}
					className="h-9 animate-pulse bg-green-600 px-3 text-xs font-bold text-white shadow-lg shadow-green-600/20 hover:bg-green-700 shrink-0"
				>
					<span className="hidden @[300px]:inline mr-1.5">{labels.nextLesson}</span>
					<ArrowRight className="h-4 w-4" />
				</Button>
			) : (
				<Button
					variant="default"
					size="sm"
					disabled={currentStepIndex === lesson.steps.length - 1}
					onClick={() => {
						if (currentStepIndex < lesson.steps.length - 1) {
							onStepChange(currentStepIndex + 1);
						}
					}}
					className="bg-primary hover:bg-primary/90 h-9 px-3 text-xs font-bold shadow-md transition-all hover:translate-x-0.5 active:translate-x-0 shrink-0"
				>
					<span className="hidden @[300px]:inline mr-1.5">
						{currentStepIndex === lesson.steps.length - 1
							? labels.finish
							: labels.next}
					</span>
					<ChevronRight className="h-4 w-4" />
				</Button>
			)}
		</div>
	);

	// Desktop: full height scrollable panel
	if (!collapsible) {
		return (
			<div className={cn("font-mono","bg-card relative flex h-full w-full flex-col")}>
				<ScrollArea className="h-0 flex-1 [&>div]:h-full [&>div>div]:flex! [&>div>div]:h-full [&>div>div]:flex-col">
					<div className="flex w-full min-w-0 flex-1 flex-col p-6 lg:p-8">
						<div className="flex-1">
							{breadcrumbs}
							<div
								key={currentStepIndex}
								className="animate-in fade-in slide-in-from-right-4 flex flex-col duration-300"
							>
								{header}
								<div className="prose prose-sm dark:prose-invert text-muted-foreground/90 max-w-none leading-relaxed">
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
														<div className="not-prose border-border bg-muted/30 my-6 overflow-hidden rounded-xl border p-2 shadow-xs">
															<CodeEditor
																code={cleanedCode}
																highlights={highlights}
																readOnly
																extensions={extensions}
															/>
														</div>
													);
												}
												return (
													<code
														className="bg-muted text-foreground rounded px-1.5 py-0.5 font-mono text-[13px] font-medium"
														{...rest}
													>
														{children}
													</code>
												);
											},
											p: ({ children }) => (
												<p className="mb-4 last:mb-0">{children}</p>
											),
										}}
									>
										{step.description[lang] || step.description.sw}
									</Markdown>
								</div>

								{step.task && (
									<div className="mt-6 rounded-xl border border-yellow-500/20 bg-yellow-500/5 p-4 shadow-sm">
										<h4 className="text-foreground mb-2 flex items-center gap-2 text-sm font-bold tracking-tight uppercase">
											<Lightbulb className="h-4 w-4 text-yellow-500" />
											{labels.yourTask}
										</h4>
										<p className="text-muted-foreground text-sm leading-normal italic">
											{step.task[lang] || step.task.sw}
										</p>
									</div>
								)}
							</div>{" "}
						</div>
						{navigation}
					</div>
				</ScrollArea>
			</div>
		);
	}

	// Mobile: collapsible panel inside a resizable pane
	return (
		<div className={cn("font-mono","bg-card flex h-full flex-col overflow-hidden")}>
			<div
				role="button"
				tabIndex={0}
				onClick={onToggle}
				onKeyDown={(e) => {
					if (e.key === "Enter" || e.key === " ") {
						onToggle?.();
					}
				}}
				className="border-border bg-muted/30 hover:bg-muted/50 flex w-full shrink-0 cursor-pointer items-center justify-between border-b px-4 py-3 text-left transition-colors"
			>
				<div className="flex items-center gap-2.5 truncate">
					<h1 className="text-foreground truncate text-sm font-bold tracking-tight">
						{step.title[lang] || step.title.sw}
					</h1>
				</div>
				<div className="flex shrink-0 items-center gap-3">
					{isCompleted ? (
						<CheckCircle2 className="h-4 w-4 text-green-500" />
					) : (
						<div className="bg-muted-foreground/40 h-1.5 w-1.5 animate-pulse rounded-full" />
					)}
					<ChevronDown
						className={cn(
							"text-muted-foreground h-4 w-4 shrink-0 transition-transform duration-300",
							expanded && "rotate-180",
						)}
					/>
				</div>
			</div>
			{expanded && (
				<ScrollArea className="flex-1 [&>div>div]:h-full">
					<div className="flex min-h-full w-full min-w-0 flex-col px-4 pt-4 pb-6 text-sm">
						<div className="flex-1">
							<div
								key={currentStepIndex}
								className="animate-in fade-in slide-in-from-bottom-2 duration-300"
							>
								<div className="text-muted-foreground/90 mb-6 leading-relaxed">
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
														<div className="not-prose border-border bg-muted/30 my-4 overflow-hidden rounded-xl border">
															<CodeEditor
																code={cleanedCode}
																highlights={highlights}
																readOnly
																extensions={extensions}
															/>
														</div>
													);
												}
												return (
													<code
														className="bg-muted text-foreground rounded px-1.5 py-0.5 font-mono text-[12px]"
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
									<div className="mb-6 overflow-hidden rounded-xl border border-yellow-500/20 bg-yellow-500/3 shadow-xs">
										<div className="flex items-center justify-between border-b border-yellow-500/10 bg-yellow-500/10 px-3 py-2">
											<h4 className="flex items-center gap-1.5 text-[10px] font-black tracking-widest text-yellow-600 uppercase dark:text-yellow-500">
												<Lightbulb className="h-3 w-3" />
												{labels.yourTask}
											</h4>
										</div>
										<div className="p-4">
											<p className="text-foreground/90 text-[13px] leading-relaxed italic">
												{step.task[lang] || step.task.sw}
											</p>
										</div>
									</div>
								)}
							</div>{" "}
						</div>
						{navigation}
					</div>
				</ScrollArea>
			)}
		</div>
	);
}

