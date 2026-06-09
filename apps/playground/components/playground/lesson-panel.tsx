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
	XCircle,
	Lock,
} from "lucide-react";
import { ScrollArea } from "@/components/playground/scroll-area";
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
		state: { currentLessonIndex, completedLessonIndices, testResults, isTesting },
		actions: { onLessonChange, onNextModule },
		lang,
		labels,
		isCurrentLessonCompleted: isCompleted,
		extensions,
	} = usePlayground();

	const [showTests, setShowTests] = useState(false);

	if (!module || currentLessonIndex === undefined || !completedLessonIndices || !onLessonChange) {
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
				<h1 className="text-foreground text-2xl leading-tight font-bold tracking-tight lg:text-3xl font-mono!">
					{lesson.title[lang] || lesson.title.sw}
				</h1>
				<div className="flex items-center gap-2">
					<div className="bg-primary/30 h-px w-8" />
					<span className="text-muted-foreground font-mono text-[10px] tracking-widest uppercase">
						{labels.lesson} {currentLessonIndex + 1} {labels.of}{" "}
						{module.lessons.length}
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
				disabled={currentLessonIndex == 0}
				onClick={() => onLessonChange(currentLessonIndex - 1)}
				className="border-border/50 bg-background/50 hover:bg-muted h-9 px-3 text-xs font-bold transition-all shrink-0"
			>
				<ChevronLeft className="mr-1.5 h-4 w-4" />
				<span className="hidden @[300px]:inline">{labels.back}</span>
			</Button>

			<div className="flex flex-col items-center gap-1.5 overflow-hidden">
				<div className="flex items-center gap-1 overflow-x-auto no-scrollbar max-w-full px-2">
					{module.lessons.map((_, i) => (
						<button
							key={i}
							onClick={() => onLessonChange(i)}
							className={cn(
								"h-1.5 rounded-full transition-all duration-300 shrink-0",
								i === currentLessonIndex
									? "bg-primary w-4 shadow-[0_0_8px_rgba(var(--primary),0.4)]"
									: completedLessonIndices.has(i)
										? "w-2 bg-green-500 hover:w-3"
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

			{isLastLesson && isCompleted && onNextModule ? (
				<Button
					variant="default"
					size="sm"
					onClick={onNextModule}
					className="h-9 animate-pulse bg-green-600 px-3 text-xs font-bold text-white shadow-lg shadow-green-600/20 hover:bg-green-700 shrink-0"
				>
					<span className="hidden @[300px]:inline mr-1.5">{labels.nextModule}</span>
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
					className="bg-primary hover:bg-primary/90 h-9 px-3 text-xs font-bold shadow-md transition-all hover:translate-x-0.5 active:translate-x-0 shrink-0"
				>
					<span className="hidden @[300px]:inline mr-1.5">
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
				<h4 className="text-foreground text-sm font-bold tracking-tight uppercase flex items-center gap-2">
					Test Cases
					{isTesting && <div className="h-1.5 w-1.5 bg-primary animate-pulse rounded-full" />}
				</h4>
				<Button 
					variant="ghost" 
					size="sm" 
					onClick={() => setShowTests(!showTests)}
					className="h-7 px-2 text-[10px] font-bold uppercase tracking-wider"
				>
					{showTests ? (
						<><EyeOff className="mr-1.5 h-3.5 w-3.5" /> {labels.hideTests}</>
					) : (
						<><Eye className="mr-1.5 h-3.5 w-3.5" /> {labels.showTests}</>
					)}
				</Button>
			</div>

			{showTests && (
				<div className="space-y-2 animate-in fade-in slide-in-from-top-2 duration-300">
					{lesson.tests.map((test) => {
						const testId = test.id || 'missing-id';
						const result = testResults?.[testId];
						return (
							<div 
								key={testId} 
								className={cn(
									"rounded-lg border p-3 text-[13px] transition-all",
									result?.passed === true ? "bg-green-500/5 border-green-500/20" : 
									result?.passed === false ? "bg-red-500/5 border-red-500/20" : 
									"bg-muted/30 border-border/50"
								)}
							>
								<div className="flex items-center justify-between gap-3">
									<div className="flex items-center gap-2 min-w-0">
										{test.isPublic ? (
											<div className="flex items-center gap-1.5 truncate">
												<span className="font-bold text-foreground shrink-0 uppercase text-[10px] tracking-widest text-muted-foreground">
													{test.type === 'io' ? 'Input/Output' : 'Validation'}
												</span>
												{test.input && (
													<code className="bg-muted px-1.5 py-0.5 rounded text-[11px] font-mono truncate">
														{test.input}
													</code>
												)}
											</div>
										) : (
											<div className="flex items-center gap-1.5 text-muted-foreground italic text-xs">
												<Lock className="h-3 w-3" />
												{labels.hiddenTest}
											</div>
										)}
									</div>
									<div className="shrink-0">
										{result?.passed === true ? (
											<CheckCircle2 className="h-4 w-4 text-green-500" />
										) : result?.passed === false ? (
											<XCircle className="h-4 w-4 text-red-500" />
										) : (
											<div className="h-4 w-4 rounded-full border-2 border-muted border-t-primary/30 animate-spin" />
										)}
									</div>
								</div>
								
								{test.isPublic && result?.passed === false && (
									<div className="mt-2 space-y-2 pt-2 border-t border-red-500/10">
										<p className="text-red-500 font-medium text-xs">
											{test.message}
										</p>
										{result.actualOutput !== undefined && (
											<div className="space-y-1">
												<span className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">Your Output:</span>
												<pre className="bg-slate-950 p-2 rounded border border-white/5 font-mono text-[11px] overflow-x-auto">
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
			<div className={cn("font-mono","bg-card relative flex h-full w-full flex-col")}>
				<ScrollArea className="h-0 flex-1 [&>div]:h-full [&>div>div]:flex! [&>div>div]:h-full [&>div>div]:flex-col">
					<div className="flex w-full min-w-0 flex-1 flex-col p-6 lg:p-8">
						<div className="flex-1">
							{breadcrumbs}
							<div
								key={currentLessonIndex}
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
										{lesson.description[lang] || lesson.description.sw}
									</Markdown>
								</div>

								{lesson.task && (
									<div className="mt-6 rounded-xl border border-yellow-500/20 bg-yellow-500/5 p-4 shadow-sm">
										<h4 className="text-foreground mb-2 flex items-center gap-2 text-sm font-bold tracking-tight uppercase">
											<Lightbulb className="h-4 w-4 text-yellow-500" />
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
						{lesson.title[lang] || lesson.title.sw}
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
								key={currentLessonIndex}
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
										{lesson.description[lang] || lesson.description.sw}
									</Markdown>
								</div>
								{lesson.task && (
									<div className="mb-6 overflow-hidden rounded-xl border border-yellow-500/20 bg-yellow-500/3 shadow-xs">
										<div className="flex items-center justify-between border-b border-yellow-500/10 bg-yellow-500/10 px-3 py-2">
											<h4 className="flex items-center gap-1.5 text-[10px] font-black tracking-widest text-yellow-600 uppercase dark:text-yellow-500">
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
