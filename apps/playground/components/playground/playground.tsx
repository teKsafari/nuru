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
import { PlaygroundProps, Language } from "@/types/playground";

export function Playground({
	lesson,
	executor,
	theme = "dark",
}: PlaygroundProps) {
	const isMobile = useIsMobile();
	const [currentStepIndex, setCurrentStepIndex] = useState(0);
	const [lang, setLang] = useState<Language>("sw");

	const currentStep = lesson.steps[currentStepIndex];

	const [code, setCode] = useState(currentStep.initialCode);
	const [output, setOutput] = useState("");
	const [lessonExpanded, setLessonExpanded] = useState(!isMobile);
	const lessonPanelRef = useRef<ImperativePanelHandle>(null);
	const codePanelRef = useRef<ImperativePanelHandle>(null);
	const bottomPanelRef = useRef<ImperativePanelHandle>(null);

	// Sync code when step changes
	useEffect(() => {
		setCode(currentStep.initialCode);
		setOutput("");
	}, [currentStepIndex, lesson.id]);

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

	const handleRun = async () => {
		if (executor.onBeforeRun) {
			executor.onBeforeRun();
		}
		try {
			await executor.run(code);
		} catch (error) {
			setOutput(`Error: ${error}`);
		}
	};

	const handleSubmit = async () => {
		setOutput("Testing...");
		try {
			const result = await executor.submit(code);
			setOutput(result);
		} catch (error) {
			setOutput(`Error: ${error}`);
		}
	};

	const handleShowSolution = () => {
		if (currentStep.solution) {
			setCode(currentStep.solution);
		} else if (executor.getSolution) {
			setCode(executor.getSolution());
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
							onLangChange={setLang}
							collapsible
							expanded={lessonExpanded}
							onToggle={handleLessonToggle}
						/>
					</ResizablePanel>
					{!lessonExpanded && (
						<button
							onClick={handleLessonToggle}
							className="flex w-full shrink-0 items-center justify-between border-b border-border bg-card px-4 py-2.5 text-left"
						>
							<div className="flex items-center gap-2 truncate pr-2">
								<span className="text-xs font-mono text-primary">
									{currentStepIndex + 1}.
								</span>
								<h1 className="truncate text-sm font-semibold text-foreground">
									{currentStep.title[lang]}
								</h1>
							</div>
							<svg
								className={`h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200 ${lessonExpanded ? "rotate-180" : ""}`}
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
						</button>
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
							isMobile
							theme={theme}
						/>
					</ResizablePanel>
					<ResizableHandle withHandle />

					{/* Output Pane */}
					<ResizablePanel
						ref={bottomPanelRef}
						defaultSize={isMobile ? 10 : 40}
						minSize={10}
					>
						<OutputPanel output={output} showToolbar={false} />
					</ResizablePanel>
				</ResizablePanelGroup>
			</div>
		);
	}

	return (
		<div className="h-screen bg-background">
			<ResizablePanelGroup direction="horizontal" className="h-full">
				<ResizablePanel defaultSize={40} minSize={20}>
					<LessonPanel
						lesson={lesson}
						currentStepIndex={currentStepIndex}
						onStepChange={setCurrentStepIndex}
						lang={lang}
						onLangChange={setLang}
					/>
				</ResizablePanel>
				<ResizableHandle withHandle />
				<ResizablePanel defaultSize={60} minSize={25}>
					<CodePanel
						code={code}
						output={output}
						onCodeChange={setCode}
						onRun={handleRun}
						onSubmit={handleSubmit}
						onShowSolution={handleShowSolution}
						theme={theme}
					/>
				</ResizablePanel>
			</ResizablePanelGroup>
		</div>
	);
}
