"use client";

import { useState } from "react";
import {
	ChevronDown,
	ChevronLeft,
	ChevronRight,
	Lightbulb,
	CheckCircle2,
	ArrowRight,
	Eye,
	EyeOff,
	Lock,
	Circle,
	AlertCircle,
	Play,
} from "lucide-react";
import { ScrollArea } from "@/components/playground/scroll-area";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@nuru/ui/lib/utils";
import { Button } from "@nuru/ui/components/button";
import Markdown from "react-markdown";
import { CodeEditor } from "@nuru/ui/components/code-editor";
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
		module,
		state: {
			currentLessonIndex,
			completedLessonIndices,
			testResults,
			isTesting,
		},
		actions: { onLessonChange, onNextModule },
		lang,
		labels,
		isCurrentLessonCompleted: isCompleted,
		extensions,
	} = usePlayground();

	const [showTests, setShowTests] = useState(false);
	const isMobile = useIsMobile();

	// A run has happened once we have at least one result; until then, checks sit in a
	// neutral "awaiting run" state rather than looking like they're loading forever.
	const hasRun = !!testResults && Object.keys(testResults).length > 0;

	if (
		!module ||
		currentLessonIndex === undefined ||
		!completedLessonIndices ||
		!onLessonChange
	) {
		return null;
	}

	const lesson = module.lessons[currentLessonIndex];
	const isLastLesson = currentLessonIndex === module.lessons.length - 1;

	const breadcrumbs = (
		<Breadcrumbs
			items={[
				{ label: labels.modules, href: `/${lang}/anza` },
				{
					label: module.title[lang] || module.title.sw,
					href: `/${lang}/anza/${module.slug}`,
				},
				{
					label: `${labels.lesson} ${currentLessonIndex + 1}`,
					current: true,
				},
			]}
			className={collapsible ? "mb-2" : "mb-6"}
		/>
	);

	const header = (
		<div className="mb-8 flex items-start justify-between gap-4">
			<div className="flex min-w-0 flex-1 flex-col gap-1.5">
				<h1 className="text-foreground text-2xl leading-tight font-bold tracking-tight lg:text-3xl">
					{lesson.title[lang] || lesson.title.sw}
				</h1>
			</div>
			{/* Completion status lives in the sidebar on desktop; only surface a badge on
			    mobile, where there is no persistent sidebar. There it earns a green highlight. */}
			{isMobile && (
				<div className="flex shrink-0 flex-row items-center gap-2 md:flex-col md:items-end">
					<div
						className={cn(
							"flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-black tracking-wider uppercase transition-all duration-500",
							isCompleted
								? "border-success/30 bg-success/10 text-success border"
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
			)}
		</div>
	);

	const navigation = !hideNavigation && (
		<div className="border-border bg-card/50 @container sticky bottom-0 mt-auto flex items-center justify-between gap-2 border-t pt-6 pb-2 backdrop-blur-xs">
			<Button
				variant="outline"
				size="sm"
				// @ts-expect-error // unknown attr 'autoComplete'; // keep this here to prevent weird disabled null hydration errors on firefox. https://github.com/vercel/next.js/discussions/21999
				autoComplete="off"
				disabled={currentLessonIndex == 0}
				onClick={() => onLessonChange(currentLessonIndex - 1)}
				className="border-border/50 bg-background/50 hover:bg-muted h-9 shrink-0 px-3 text-xs font-bold transition-all"
			>
				<ChevronLeft className="mr-1.5 h-4 w-4" />
				<span className="hidden @[300px]:inline">{labels.back}</span>
			</Button>

			{/* 
			<div className="flex flex-col items-center gap-1.5 overflow-hidden">
				<div className="flex items-center gap-1 overflow-x-auto no-scrollbar max-w-full px-2">
					{module.lessons.map((_, i) => (
						<button
							key={i}
							onClick={() => onLessonChange(i)}
							className={cn(
								"h-1.5 rounded-full transition-all duration-300 shrink-0",
								i === currentLessonIndex
									? "bg-primary w-4"
									: completedLessonIndices.has(i)
										? "bg-primary/60 w-2 hover:w-3"
										: i < currentLessonIndex
											? "bg-primary/40 w-1.5 hover:w-2"
											: "bg-muted w-1.5 hover:w-2",
							)}
						/>
					))}
				</div>
				<span className="text-muted-foreground font-mono text-[9px] uppercase tracking-tighter @[300px]:tracking-widest">
					{currentLessonIndex + 1} / {module.lessons.length}
				</span>
			</div>
			*/}

			{isLastLesson && isCompleted && onNextModule ? (
				<Button
					variant="default"
					size="sm"
					onClick={onNextModule}
					className="bg-primary hover:bg-primary/90 text-primary-foreground h-9 shrink-0 animate-pulse px-3 text-xs font-bold"
				>
					<span className="mr-1.5 hidden @[300px]:inline">
						{labels.nextModule}
					</span>
					<ArrowRight className="h-4 w-4" />
				</Button>
			) : (
				<Button
					variant="default"
					size="sm"
					disabled={currentLessonIndex === module.lessons.length - 1}
					onClick={() => {
						if (currentLessonIndex < module.lessons.length - 1) {
							onLessonChange(currentLessonIndex + 1);
						}
					}}
					className="bg-primary hover:bg-primary/90 h-9 shrink-0 px-3 text-xs font-bold transition-all hover:translate-x-0.5 active:translate-x-0"
				>
					<span className="mr-1.5 hidden @[300px]:inline">
						{currentLessonIndex === module.lessons.length - 1
							? labels.finish
							: labels.next}
					</span>
					<ChevronRight className="h-4 w-4" />
				</Button>
			)}
		</div>
	);

	const testCasesSection = lesson.tests && lesson.tests.length > 0 && (
		<div className="mt-8 space-y-4">
			<div className="flex items-center justify-between">
				<h4 className="text-foreground flex items-center gap-2 text-sm font-bold tracking-tight uppercase">
					{labels.testsTitle}
					{isTesting && (
						<div className="bg-primary h-1.5 w-1.5 animate-pulse rounded-full" />
					)}
				</h4>
				<Button
					variant="ghost"
					size="sm"
					onClick={() => setShowTests(!showTests)}
					className="h-7 px-2 text-[10px] font-bold tracking-wider uppercase"
				>
					{showTests ? (
						<>
							<EyeOff className="mr-1.5 h-3.5 w-3.5" /> {labels.hideTests}
						</>
					) : (
						<>
							<Eye className="mr-1.5 h-3.5 w-3.5" /> {labels.showTests}
						</>
					)}
				</Button>
			</div>

			{showTests && (
				<div className="animate-in fade-in slide-in-from-top-2 space-y-2 duration-300">
					{!hasRun && !isTesting && (
						<div className="text-muted-foreground bg-muted/30 border-border/50 flex items-center gap-2 rounded-lg border border-dashed px-3 py-2.5 text-xs">
							<Play className="h-3.5 w-3.5 shrink-0" />
							<span>{labels.runFirst}</span>
						</div>
					)}
					{lesson.tests.map((test) => {
						const testId = test.id || "missing-id";
						const result = testResults?.[testId];
						const passed = result?.passed === true;
						const notYet = hasRun && result?.passed === false;
						return (
							<div
								key={testId}
								className={cn(
									"rounded-lg border p-3 text-[13px] transition-all",
									passed
										? "bg-success/10 border-success/30"
										: notYet
											? "bg-warning/10 border-warning/30"
											: "bg-muted/40 border-border",
								)}
							>
								<div className="flex items-center justify-between gap-3">
									<div className="flex min-w-0 items-center gap-2">
										{test.isPublic ? (
											<div className="flex items-center gap-1.5 truncate">
												<span className="text-muted-foreground shrink-0 text-[10px] font-bold tracking-widest uppercase">
													{test.type === "io"
														? labels.inputOutputLabel
														: labels.validationLabel}
												</span>
												{test.input && (
													<code className="bg-muted truncate rounded px-1.5 py-0.5 font-mono text-[11px]">
														{test.input}
													</code>
												)}
											</div>
										) : (
											<div className="text-muted-foreground flex items-center gap-1.5 text-xs italic">
												<Lock className="h-3 w-3" />
												{labels.hiddenTest}
											</div>
										)}
									</div>
									<div className="shrink-0">
										{isTesting ? (
											<div className="border-muted border-t-primary/40 h-4 w-4 animate-spin rounded-full border-2" />
										) : passed ? (
											<CheckCircle2 className="text-success h-4 w-4" />
										) : notYet ? (
											<AlertCircle className="text-warning h-4 w-4" />
										) : (
											<Circle className="text-muted-foreground/40 h-3.5 w-3.5" />
										)}
									</div>
								</div>

								{test.isPublic && notYet && (
									<div className="border-border mt-2 space-y-2 border-t pt-2">
										<p className="text-foreground/90 text-xs font-medium">
											{test.message}
										</p>
										{result?.actualOutput !== undefined && (
											<div className="space-y-1">
												<span className="text-muted-foreground text-[10px] font-bold tracking-widest uppercase">
													{labels.yourOutput}
												</span>
												<pre className="bg-muted text-foreground border-border overflow-x-auto rounded border p-2 font-mono text-[11px]">
													{result.actualOutput || "(no output)"}
												</pre>
											</div>
										)}
									</div>
								)}
							</div>
						);
					})}
				</div>
			)}
		</div>
	);

	// Desktop: full height scrollable panel
	if (!collapsible) {
		return (
			<div className={cn("bg-card relative flex h-full w-full flex-col")}>
				<ScrollArea className="h-0 flex-1 [&>div]:h-full [&>div>div]:flex! [&>div>div]:h-full [&>div>div]:flex-col">
					<div className="flex w-full min-w-0 flex-1 flex-col p-6 lg:p-8">
						<div className="flex-1">
							{breadcrumbs}
							<div
								key={currentLessonIndex}
								className="animate-in fade-in slide-in-from-right-4 flex flex-col duration-300"
							>
								{header}
								<div className="prose prose-sm dark:prose-invert text-foreground/80 max-w-none leading-relaxed">
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
										{lesson.description[lang] || lesson.description.sw}
									</Markdown>
								</div>

								{lesson.task && (
									<div className="border-warning/30 bg-warning/10 mt-6 rounded-xl border p-4 shadow-sm">
										<h4 className="text-foreground mb-2 flex items-center gap-2 text-sm font-bold tracking-tight uppercase">
											<Lightbulb className="text-warning h-4 w-4" />
											{labels.yourTask}
										</h4>
										<p className="text-muted-foreground text-sm leading-normal italic">
											{lesson.task[lang] || lesson.task.sw}
										</p>
									</div>
								)}

								{testCasesSection}
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
		<div className={cn("bg-card flex h-full flex-col overflow-hidden")}>
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
						{lesson.title[lang] || lesson.title.sw}
					</h1>
				</div>
				<div className="flex shrink-0 items-center gap-3">
					{isCompleted ? (
						<CheckCircle2 className="text-success h-4 w-4" />
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
								key={currentLessonIndex}
								className="animate-in fade-in slide-in-from-bottom-2 duration-300"
							>
								<div className="text-foreground/80 mb-6 leading-relaxed">
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
										{lesson.description[lang] || lesson.description.sw}
									</Markdown>
								</div>
								{lesson.task && (
									<div className="border-warning/30 bg-warning/10 mb-6 overflow-hidden rounded-xl border shadow-xs">
										<div className="border-warning/20 bg-warning/15 flex items-center justify-between border-b px-3 py-2">
											<h4 className="text-warning flex items-center gap-1.5 text-[10px] font-black tracking-widest uppercase">
												<Lightbulb className="h-3 w-3" />
												{labels.yourTask}
											</h4>
										</div>
										<div className="p-4">
											<p className="text-foreground/90 text-[13px] leading-relaxed italic">
												{lesson.task[lang] || lesson.task.sw}
											</p>
										</div>
									</div>
								)}

								{testCasesSection}
							</div>{" "}
						</div>
						{navigation}
					</div>
				</ScrollArea>
			)}
		</div>
	);
}
