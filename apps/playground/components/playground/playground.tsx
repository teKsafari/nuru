"use client";

import { useRef, useState, useEffect } from "react";
import type { ImperativePanelHandle } from "react-resizable-panels";
import { Terminal, Cpu, Columns2 } from "lucide-react";
import { LessonPanel } from "./lesson-panel";
import { CodePanel } from "./code-panel";
import { SimulationPanel } from "./simulation-panel";
import { OutputPanel } from "./output-panel";
import {
	ResizableHandle,
	ResizablePanel,
	ResizablePanelGroup,
} from "@/components/playground/resizable";
import { useIsMobile } from "@/hooks/use-mobile";
import { PlaygroundProps, Language, Lesson, LessonContent } from "@/types/playground";
import { Button } from "@/components/ui/button";

type BottomPaneMode = "output" | "simulation" | "split";

export function Playground({
	lesson,
	executor,
	simulation,
	nodes = [],
	edges = [],
	onNodesChange,
	onResetSimulation,
	nodeTypes,
	theme = "dark",
}: PlaygroundProps) {
	const isMobile = useIsMobile();
	const [currentStepIndex, setCurrentStepIndex] = useState(0);
	const [lang, setLang] = useState<Language>("sw");

	// Normalize lesson
	const isLegacy = "title" in lesson && typeof lesson.title === "string";
	const normalizedLesson: Lesson = isLegacy
		? {
				id: "legacy",
				title: { sw: (lesson as LessonContent).title, en: (lesson as LessonContent).title },
				steps: [
					{
						id: "legacy-step",
						title: { sw: (lesson as LessonContent).title, en: (lesson as LessonContent).title },
						description: {
							sw: (lesson as LessonContent).description,
							en: (lesson as LessonContent).description,
						},
						initialCode: (lesson as LessonContent).initialCode,
						simulation: (lesson as LessonContent).simulation,
						initialNodes: (lesson as LessonContent).initialNodes,
						initialEdges: (lesson as LessonContent).initialEdges,
						nodeTypes: (lesson as LessonContent).nodeTypes,
					},
				],
			}
		: (lesson as Lesson);

	const currentStep = normalizedLesson.steps[currentStepIndex];

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
	}, [currentStepIndex, normalizedLesson.id]);

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
		const lesson = lessonPanelRef.current;
		const code = codePanelRef.current;
		const bottom = bottomPanelRef.current;
		if (!lesson) return;
		if (lessonExpanded) {
			lesson.collapse();
			// Redistribute: lesson's 25% goes to code(40%) + bottom(60%)
			code?.resize(40);
			bottom?.resize(60);
		} else {
			// Take from both panes to give lesson 25%
			lesson.expand();
			lesson.resize(40);
			code?.resize(40);
			bottom?.resize(20);
		}
	};

	const hasSimulation = !!simulation || (nodes && nodes.length > 0) || !!currentStep.simulation;

	const [bottomPaneMode, setBottomPaneMode] =
		useState<BottomPaneMode>("simulation");

	const cycleBottomPane = () => {
		if (!hasSimulation) return;
		setBottomPaneMode((prev) => {
			if (prev === "output") return "simulation";
			if (prev === "simulation") return "split";
			return "output";
		});
	};

	const bottomPaneIcon =
		bottomPaneMode === "output"
			? Cpu
			: bottomPaneMode === "simulation"
				? Columns2
				: Terminal;

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
							lesson={normalizedLesson} 
							currentStepIndex={currentStepIndex}
							onStepChange={setCurrentStepIndex}
							lang={lang}
							onLangChange={setLang}
							collapsible 
							expanded={lessonExpanded} 
							onToggle={handleLessonToggle} 
							hideNavigation={isLegacy}
						/>
					</ResizablePanel>
					{!lessonExpanded && (
						<button
							onClick={handleLessonToggle}
							className="flex w-full shrink-0 items-center justify-between border-b border-border bg-card px-4 py-2.5 text-left"
						>
							<div className="flex items-center gap-2 truncate pr-2">
								{!isLegacy && (
									<span className="text-xs font-mono text-primary">{currentStepIndex + 1}.</span>
								)}
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
							mobileExtra={
								hasSimulation ? (
									<Button
										variant="secondary"
										size="sm"
										onClick={cycleBottomPane}
										className="h-8 w-8 p-0 shadow-md"
									>
										{(() => {
											const Icon = bottomPaneIcon;
											return <Icon className="h-3.5 w-3.5" />;
										})()}
									</Button>
								) : undefined
							}
						/>
					</ResizablePanel>
					<ResizableHandle withHandle />

					{/* Output / Simulation Pane */}
					<ResizablePanel
						ref={bottomPanelRef}
						defaultSize={isMobile ? 10 : 40}
						minSize={10}
					>
						{hasSimulation ? (
							bottomPaneMode === "output" ? (
								<OutputPanel output={output} showToolbar={false} />
							) : bottomPaneMode === "simulation" ? (
								<SimulationPanel
									nodes={nodes.length > 0 ? nodes : (currentStep.initialNodes || [])}
									edges={edges.length > 0 ? edges : (currentStep.initialEdges || [])}
									onNodesChange={onNodesChange}
									onReset={onResetSimulation}
									nodeTypes={nodeTypes || currentStep.nodeTypes}
									content={simulation || currentStep.simulation}
								/>
							) : (
								<ResizablePanelGroup direction="horizontal" className="h-full">
									<ResizablePanel defaultSize={50} minSize={20}>
										<OutputPanel output={output} showToolbar={false} />
									</ResizablePanel>
									<ResizableHandle withHandle />
									<ResizablePanel defaultSize={50} minSize={20}>
										<SimulationPanel
											nodes={nodes.length > 0 ? nodes : (currentStep.initialNodes || [])}
											edges={edges.length > 0 ? edges : (currentStep.initialEdges || [])}
											onNodesChange={onNodesChange}
											onReset={onResetSimulation}
											nodeTypes={nodeTypes || currentStep.nodeTypes}
											content={simulation || currentStep.simulation}
										/>
									</ResizablePanel>
								</ResizablePanelGroup>
							)
						) : (
							<OutputPanel output={output} showToolbar={false} />
						)}
					</ResizablePanel>
				</ResizablePanelGroup>
			</div>
		);
	}

	return (
		<div className="h-screen bg-background">
			<ResizablePanelGroup direction="horizontal" className="h-full">
				<ResizablePanel defaultSize={hasSimulation ? 30 : 40} minSize={20}>
					<LessonPanel 
						lesson={normalizedLesson} 
						currentStepIndex={currentStepIndex}
						onStepChange={setCurrentStepIndex}
						lang={lang}
						onLangChange={setLang}
						hideNavigation={isLegacy}
					/>
				</ResizablePanel>
				<ResizableHandle withHandle />
				<ResizablePanel defaultSize={hasSimulation ? 30 : 60} minSize={25}>
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
				{hasSimulation && (
					<>
						<ResizableHandle withHandle />
						<ResizablePanel defaultSize={40} minSize={15}>
							<SimulationPanel
								nodes={nodes.length > 0 ? nodes : (currentStep.initialNodes || [])}
								edges={edges.length > 0 ? edges : (currentStep.initialEdges || [])}
								onNodesChange={onNodesChange}
								onReset={onResetSimulation}
								nodeTypes={nodeTypes || currentStep.nodeTypes}
								content={simulation || currentStep.simulation}
							/>
						</ResizablePanel>
					</>
				)}
			</ResizablePanelGroup>
		</div>
	);
}
