"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useRef, useState, useEffect, useCallback } from "react";
import type { ImperativePanelHandle } from "react-resizable-panels";
import { LessonPanel } from "./lesson-panel";
import { CodePanel } from "./code-panel";
import { OutputPanel } from "./output-panel";
import {
	ResizableHandle,
	ResizablePanel,
	ResizablePanelGroup,
} from "@/components/playground/resizable";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { PlaygroundProps } from "@/types/playground";
import confetti from "canvas-confetti";
import { CheckCircle2 } from "lucide-react";

export function Playground({
	lesson,
	executor,
	theme = "dark",
	nextLessonId,
	lang,
	dict,
}: PlaygroundProps) {
	const router = useRouter();
	const searchParams = useSearchParams();
	const isMobile = useIsMobile();
	const [currentStepIndex, setCurrentStepIndex] = useState(0);

	// Initial step from URL
	useEffect(() => {
		const stepId = searchParams.get("step");
		if (stepId) {
			const index = lesson.steps.findIndex((s) => s.id === stepId);
			if (index !== -1) {
				setCurrentStepIndex(index);
			}
		}
	}, [searchParams, lesson.steps]);

	const currentStep = lesson.steps[currentStepIndex];

	const [code, setCode] = useState(currentStep.initialCode);
	const [output, setOutput] = useState("");
	const [isRunning, setIsRunning] = useState(false);
	const [completedStepIndices, setCompletedStepIndices] = useState<Set<number>>(new Set());
	const [lessonExpanded, setLessonExpanded] = useState(!isMobile);
	const lessonPanelRef = useRef<ImperativePanelHandle>(null);
	const codePanelRef = useRef<ImperativePanelHandle>(null);
	const bottomPanelRef = useRef<ImperativePanelHandle>(null);

	// Sync code when step changes
	useEffect(() => {
		setCode(currentStep.initialCode);
		setOutput("");
	}, [currentStepIndex, lesson.id, currentStep.initialCode]);

	// Reset progress when lesson changes
	useEffect(() => {
		setCompletedStepIndices(new Set());
	}, [lesson.id]);

	const isCurrentStepCompleted = completedStepIndices.has(currentStepIndex);

	useEffect(() => {
		executor.onOutput((output, isError) => {
			setOutput((prev) => {
				if (prev) {
					return prev + `\n${output}`;
				} else return output;
			});
		});
	}, [executor]);

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

	const checkSolution = useCallback((currentCode: string) => {
		if (!currentStep.solution) return false;
		
		// Simple normalization: remove whitespace and comments
		const normalize = (s: string) => s.replace(/\/\/.*$/gm, "").replace(/\s/g, "");
		const isCorrect = normalize(currentCode) === normalize(currentStep.solution);
		
		if (isCorrect) {
			setCompletedStepIndices(prev => new Set(prev).add(currentStepIndex));
			confetti({
				particleCount: 100,
				spread: 70,
				origin: { y: 0.6 },
				colors: ["#22c55e", "#10b981", "#3b82f6"]
			});
		}
		return isCorrect;
	}, [currentStep.solution, currentStepIndex]);

	const handleRun = async () => {
		setIsRunning(true);
		if (executor.onBeforeRun) {
			executor.onBeforeRun();
		}
		setOutput("");
		try {
			await executor.run(code);
			checkSolution(code);
		} catch (error) {
			setOutput(`${dict.playground.error}${error}`);
		} finally {
			setIsRunning(false);
		}
	};

	const handleSubmit = async () => {
		setOutput(dict.playground.testing);
		try {
			const result = await executor.submit(code);
			setOutput(result);
		} catch (error) {
			setOutput(`${dict.playground.error}${error}`);
		}
	};

	const handleShowSolution = () => {
		if (currentStep.solution) {
			setCode(currentStep.solution);
		} else if (executor.getSolution) {
			setCode(executor.getSolution());
		}
	};

	const handleShowHint = () => {
		// Basic hint: show the first line of the solution or a generic tip
		const hintMessage = dict.playground.hint;
		
		setOutput(prev => prev ? `${prev}\n\n${hintMessage}` : hintMessage);
	};

	const handleReset = () => {
		setCode(currentStep.initialCode);
		setOutput("");
	};

	const handleNextLesson = () => {
		if (nextLessonId) {
			router.push(`/${lang}/anza/${nextLessonId}`);
		} else {
			router.push(`/${lang}/anza`);
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
							currentStepIndex={currentStepIndex}
							onStepChange={setCurrentStepIndex}
							lang={lang}
							dict={dict}
							collapsible
							expanded={lessonExpanded}
							onToggle={handleLessonToggle}
							isCompleted={isCurrentStepCompleted}
							completedStepIndices={completedStepIndices}
							onNextLesson={handleNextLesson}
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
							code={code}
							output={output}
							onCodeChange={setCode}
							onRun={handleRun}
							onSubmit={handleSubmit}
							onShowSolution={handleShowSolution}
							onShowHint={handleShowHint}
							onReset={handleReset}
							isMobile
							theme={theme}
							lang={lang}
							dict={dict}
						/>
					</ResizablePanel>
					<ResizableHandle withHandle />

					{/* Output Pane */}
					<ResizablePanel
						ref={bottomPanelRef}
						defaultSize={isMobile ? 10 : 40}
						minSize={10}
					>
						<OutputPanel output={output} showToolbar={false} dict={dict} />
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
						currentStepIndex={currentStepIndex}
						onStepChange={setCurrentStepIndex}
						lang={lang}
						dict={dict}
						isCompleted={isCurrentStepCompleted}
						completedStepIndices={completedStepIndices}
						onNextLesson={handleNextLesson}
					/>
				</ResizablePanel>
				<ResizableHandle withHandle />
				<ResizablePanel defaultSize={50} minSize={25}>
					<CodePanel
						code={code}
						output={output}
						onCodeChange={setCode}
						onRun={handleRun}
						onSubmit={handleSubmit}
						onShowSolution={handleShowSolution}
						onShowHint={handleShowHint}
						onReset={handleReset}
						theme={theme}
						lang={lang}
						dict={dict}
					/>
				</ResizablePanel>
			</ResizablePanelGroup>
		</div>
	);
}

