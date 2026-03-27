"use client";

import { useRef, useState } from "react";
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
import { CheckCircle2 } from "lucide-react";

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
	const [lessonExpanded, setLessonExpanded] = useState(!isMobile);
	const lessonPanelRef = useRef<ImperativePanelHandle>(null);
	const codePanelRef = useRef<ImperativePanelHandle>(null);
	const bottomPanelRef = useRef<ImperativePanelHandle>(null);

	const currentStep = lesson.steps[state.currentStepIndex];
	const isCurrentStepCompleted = state.completedStepIndices.has(state.currentStepIndex);

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
			<div className="flex max-h-full flex-1 flex-col overflow-hidden bg-background">
				<ResizablePanelGroup direction="vertical" className="flex-1">
					{/* Lesson Content Pane */}
					<ResizablePanel
						ref={lessonPanelRef}
						defaultSize={isMobile ? 0 : 25}
						minSize={0}
						collapsible
						collapsedSize={0}
						onCollapse={() => setLessonExpanded(false)}
						onExpand={() => setLessonExpanded(true)}
						style={{ overflow: "hidden" }}
					>
						<LessonPanel
							lesson={lesson}
							currentStepIndex={state.currentStepIndex}
							onStepChange={actions.onStepChange}
							lang={lang}
							labels={labels}
							collapsible
							expanded={lessonExpanded}
							onToggle={handleLessonToggle}
							isCompleted={isCurrentStepCompleted}
							completedStepIndices={state.completedStepIndices}
							onNextLesson={actions.onNextLesson}
						/>
					</ResizablePanel>
					{!lessonExpanded && (
						<div
							role="button"
							tabIndex={0}
							onClick={handleLessonToggle}
							onKeyDown={(e) => {
								if (e.key === "Enter" || e.key === " ") {
									handleLessonToggle();
								}
							}}
							className="flex w-full shrink-0 items-center justify-between border-b border-border bg-muted/30 px-4 py-2.5 text-left cursor-pointer"
						>
							<div className="flex items-center gap-2 truncate">
								<h1 className="truncate text-sm font-bold text-foreground">
									{currentStep.title[lang] || currentStep.title.sw}
								</h1>
							</div>
							<div className="flex items-center gap-3 shrink-0">
								{isCurrentStepCompleted ? (
									<CheckCircle2 className="h-4 w-4 text-green-500" />
								) : (
									<div className="h-2 w-2 rounded-full bg-muted-foreground/40" />
								)}
								<svg
									className="h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200"
									xmlns="http://www.w3.org/2000/svg"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									strokeWidth="2"
									strokeLinecap="round"
									strokeLinejoin="round"
								>
									<path d="m6 9 6 6 6-6" />
								</svg>
							</div>
						</div>
					)}
					<ResizableHandle withHandle />

					{/* Code Pane */}
					<ResizablePanel
						ref={codePanelRef}
						defaultSize={isMobile ? 40 : 35}
						minSize={15}
					>
						<CodePanel
							code={state.code}
							output={state.output}
							onCodeChange={actions.onCodeChange}
							onRun={actions.onRun}
							onSubmit={actions.onSubmit}
							onShowSolution={actions.onShowSolution}
							onShowHint={actions.onShowHint}
							onReset={actions.onReset}
							isMobile
							theme={theme}
							lang={lang}
							labels={labels}
							extensions={extensions}
						/>
					</ResizablePanel>
					<ResizableHandle withHandle />

					{/* Output Pane */}
					<ResizablePanel
						ref={bottomPanelRef}
						defaultSize={isMobile ? 10 : 40}
						minSize={10}
					>
						<OutputPanel output={state.output} showToolbar={false} labels={labels} />
					</ResizablePanel>
				</ResizablePanelGroup>
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
					/>
				</ResizablePanel>
			</ResizablePanelGroup>
		</div>
	);
}
