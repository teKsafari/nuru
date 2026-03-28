"use client";

import { useRef, useState, useEffect } from "react";
import type { ImperativePanelHandle } from "react-resizable-panels";
import { LessonPanel } from "./lesson-panel";
import { CodePanel } from "./code-panel";
import { OutputPanel } from "./output-panel";
import {
	ResizableHandle,
	ResizablePanel,
	ResizablePanelGroup,
} from "@/components/playground/resizable";
import { useIsMobile } from "@/hooks/use-mobile";
import { PlaygroundProps } from "@/types/playground";
import { CheckCircle2, BookOpen, Terminal, ChevronDown } from "lucide-react";
import { Drawer, DrawerContent, DrawerTrigger, DrawerTitle, DrawerDescription } from "@/components/ui/drawer";

export function Playground({
	lesson,
	state,
	actions,
	labels,
	theme = "dark",
	lang,
	extensions,
}: PlaygroundProps) {
	const isMobile = useIsMobile();
	const [lessonDrawerOpen, setLessonDrawerOpen] = useState(false);
	const [lessonExpanded, setLessonExpanded] = useState(!isMobile);
	const lessonPanelRef = useRef<ImperativePanelHandle>(null);
	const codePanelRef = useRef<ImperativePanelHandle>(null);
	const bottomPanelRef = useRef<ImperativePanelHandle>(null);

	// Automatically open lesson drawer on mobile if it's the first step of a lesson
	useEffect(() => {
		if (isMobile && state.currentStepIndex === 0) {
			// Small delay to ensure smooth entry
			const timer = setTimeout(() => setLessonDrawerOpen(true), 500);
			return () => clearTimeout(timer);
		}
	}, [isMobile, lesson.id]); // Only run when lesson changes or on mount

	const currentStep = lesson.steps[state.currentStepIndex];
	const isCurrentStepCompleted = state.completedStepIndices.has(state.currentStepIndex);
	const isLastStep = state.currentStepIndex === lesson.steps.length - 1;
	const nextActionLabel = isLastStep ? labels.nextLesson : labels.next;
	const handleNextAction = isLastStep
		? actions.onNextLesson
		: () => actions.onStepChange(state.currentStepIndex + 1);

	const handleRun = () => {
		actions.onRun();
		if (isMobile) {
			bottomPanelRef.current?.expand();
			bottomPanelRef.current?.resize(20);
		}
	};

	const handleLessonToggle = () => {
		const lessonPanel = lessonPanelRef.current;
		const codePanel = codePanelRef.current;
		const bottomPanel = bottomPanelRef.current;

		if (!lessonPanel) return;

		if (lessonExpanded) {
			lessonPanel.collapse();
			// Redistribute: lesson's 25% goes to code(40%) + bottom(60%)
			codePanel?.resize(40);
			bottomPanel?.resize(60);
		} else {
			// Take from both panes to give lesson 25%
			lessonPanel.expand();
			lessonPanel.resize(40);
			codePanel?.resize(40);
			bottomPanel?.resize(20);
		}
	};

	if (isMobile) {
		return (
			<div className="flex max-h-full flex-1 flex-col overflow-hidden bg-background relative">
				<Drawer open={lessonDrawerOpen} onOpenChange={setLessonDrawerOpen}>
					<DrawerTrigger asChild>
						<button className="flex w-full shrink-0 items-center justify-between border-b border-border bg-muted/5 px-4 py-3 text-left hover:bg-muted/10 transition-colors shadow-sm z-10">
							<div className="flex items-center gap-3 min-w-0 flex-1 mr-4">
								<div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 shadow-inner">
									<BookOpen className="h-4.5 w-4.5 text-primary shrink-0" />
								</div>
								<div className="flex flex-col min-w-0">
									<span className="text-[9px] font-black uppercase tracking-widest text-primary/70">{labels.step} {state.currentStepIndex + 1}</span>
									<h1 className="truncate text-sm font-bold text-foreground tracking-tight">
										{currentStep.title[lang] || currentStep.title.sw}
									</h1>
								</div>
							</div>
							<div className="flex items-center gap-3 shrink-0">
								<div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-primary text-primary-foreground text-[10px] font-black uppercase tracking-wider shadow-sm active:scale-95 transition-transform">
									<span>View</span>
									<ChevronDown className="h-3 w-3" />
								</div>
								{isCurrentStepCompleted ? (
									<CheckCircle2 className="h-5 w-5 text-green-500" />
								) : (
									<div className="h-2 w-2 rounded-full bg-muted-foreground/40" />
								)}
							</div>
						</button>
					</DrawerTrigger>
					<DrawerContent className="max-h-[85vh]">
						<DrawerTitle className="sr-only">
							{currentStep.title[lang] || currentStep.title.sw}
						</DrawerTitle>
						<DrawerDescription className="sr-only">
							Lesson instructions for {currentStep.title[lang] || currentStep.title.sw}
						</DrawerDescription>
						<div className="overflow-y-auto px-4 pb-8 pt-2 h-full">
							<LessonPanel
								lesson={lesson}
								currentStepIndex={state.currentStepIndex}
								onStepChange={actions.onStepChange}
								lang={lang}
								labels={labels}
								collapsible={false}
								expanded={true}
								isCompleted={isCurrentStepCompleted}
								completedStepIndices={state.completedStepIndices}
								onNextLesson={actions.onNextLesson}
							/>
						</div>
					</DrawerContent>
				</Drawer>

				<div className="flex-1 overflow-hidden relative">
					<ResizablePanelGroup direction="vertical">
						<ResizablePanel defaultSize={80} minSize={20}>
							<CodePanel
								code={state.code}
								output={state.output}
								onCodeChange={actions.onCodeChange}
								onRun={handleRun}
								onSubmit={actions.onSubmit}
								onShowSolution={actions.onShowSolution}
								onShowHint={actions.onShowHint}
								onReset={actions.onReset}
								isMobile
								theme={theme}
								lang={lang}
								labels={labels}
								extensions={extensions}
								isCompleted={isCurrentStepCompleted}
								onNextAction={handleNextAction}
								nextActionLabel={nextActionLabel}
							/>
						</ResizablePanel>
						<ResizableHandle withHandle />
						<ResizablePanel
							ref={bottomPanelRef}
							defaultSize={20}
							minSize={10}
							collapsible
							collapsedSize={0}
						>
							<div className="flex h-full flex-col bg-background">
								<div className="flex-1 overflow-hidden">
									<OutputPanel output={state.output} showToolbar={false} labels={labels} />
								</div>
							</div>
						</ResizablePanel>
					</ResizablePanelGroup>
				</div>
			</div>
		);
	}

	return (
		<div className="h-screen bg-background">
			<ResizablePanelGroup direction="horizontal" className="h-full">
				<ResizablePanel defaultSize={50} minSize={20}>
					<LessonPanel
						lesson={lesson}
						currentStepIndex={state.currentStepIndex}
						onStepChange={actions.onStepChange}
						lang={lang}
						labels={labels}
						isCompleted={isCurrentStepCompleted}
						completedStepIndices={state.completedStepIndices}
						onNextLesson={actions.onNextLesson}
					/>
				</ResizablePanel>
				<ResizableHandle withHandle />
				<ResizablePanel defaultSize={50} minSize={25}>
					<CodePanel
						code={state.code}
						output={state.output}
						onCodeChange={actions.onCodeChange}
						onRun={actions.onRun}
						onSubmit={actions.onSubmit}
						onShowSolution={actions.onShowSolution}
						onShowHint={actions.onShowHint}
						onReset={actions.onReset}
						theme={theme}
						lang={lang}
						labels={labels}
						extensions={extensions}
						isCompleted={isCurrentStepCompleted}
						onNextAction={handleNextAction}
						nextActionLabel={nextActionLabel}
					/>
				</ResizablePanel>
			</ResizablePanelGroup>
		</div>
	);
}
