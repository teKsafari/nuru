"use client";

import { useRef, useState } from "react";
import type { ImperativePanelHandle } from "react-resizable-panels";
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
import { PlaygroundProps } from "@/types/playground";

export function Playground({
	lesson,
	executor,
	simulation,
	nodes = [],
	edges = [],
	onNodesChange,
	onResetSimulation,
	nodeTypes,
}: PlaygroundProps) {
	const isMobile = useIsMobile();
	const [code, setCode] = useState(lesson.initialCode);
	const [output, setOutput] = useState("");
	const [lessonExpanded, setLessonExpanded] = useState(true);
	const lessonPanelRef = useRef<ImperativePanelHandle>(null);

	const handleLessonToggle = () => {
		const panel = lessonPanelRef.current;
		if (!panel) return;
		if (lessonExpanded) {
			panel.collapse();
		} else {
			panel.expand();
		}
	};

	const hasSimulation = !!simulation || (nodes && nodes.length > 0);

	const handleRun = async () => {
		if (executor.onBeforeRun) {
			executor.onBeforeRun();
		}
		setOutput("Running...");
		try {
			const result = await executor.run(code);
			setOutput(result);
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
		if (executor.getSolution) {
			setCode(executor.getSolution());
		}
	};

	if (isMobile) {
		return (
			<div className="flex max-h-full flex-1 flex-col bg-background overflow-hidden">
				<ResizablePanelGroup direction="vertical" className="flex-1">
					{/* Lesson Pane */}
					<ResizablePanel
						ref={lessonPanelRef}
						defaultSize={30}
						minSize={5}
						collapsible
						collapsedSize={5}
						onCollapse={() => setLessonExpanded(false)}
						onExpand={() => setLessonExpanded(true)}
					>
						<LessonPanel
							lesson={lesson}
							collapsible
							expanded={lessonExpanded}
							onToggle={handleLessonToggle}
						/>
					</ResizablePanel>
					<ResizableHandle withHandle />

					{/* Code Pane */}
					<ResizablePanel defaultSize={40} minSize={15}>
						<CodePanel
							code={code}
							output={output}
							onCodeChange={setCode}
							onRun={handleRun}
							onSubmit={handleSubmit}
							onShowSolution={handleShowSolution}
							isMobile
						/>
					</ResizablePanel>
					<ResizableHandle withHandle />

					{/* Output / Simulation Pane */}
					<ResizablePanel defaultSize={30} minSize={10}>
						{hasSimulation ? (
							<ResizablePanelGroup
								direction="horizontal"
								className="h-full"
							>
								<ResizablePanel
									defaultSize={50}
									minSize={20}
									collapsible
									collapsedSize={0}
								>
									<OutputPanel
										output={output}
										showToolbar={false}
									/>
								</ResizablePanel>
								<ResizableHandle withHandle />
								<ResizablePanel
									defaultSize={50}
									minSize={20}
									collapsible
									collapsedSize={0}
								>
									<SimulationPanel
										nodes={nodes}
										edges={edges}
										onNodesChange={onNodesChange}
										onReset={onResetSimulation}
										nodeTypes={nodeTypes}
										content={simulation}
									/>
								</ResizablePanel>
							</ResizablePanelGroup>
						) : (
							<OutputPanel
								output={output}
								showToolbar={false}
							/>
						)}
					</ResizablePanel>
				</ResizablePanelGroup>
			</div>
		);
	}

	return (
		<div className="h-screen bg-background">
			<ResizablePanelGroup direction="horizontal" className="h-full">
				<ResizablePanel defaultSize={hasSimulation ? 35 : 40} minSize={20}>
					<LessonPanel lesson={lesson} />
				</ResizablePanel>
				<ResizableHandle withHandle />
				<ResizablePanel defaultSize={hasSimulation ? 40 : 60} minSize={25}>
					<CodePanel
						code={code}
						output={output}
						onCodeChange={setCode}
						onRun={handleRun}
						onSubmit={handleSubmit}
						onShowSolution={handleShowSolution}
					/>
				</ResizablePanel>
				{hasSimulation && (
					<>
						<ResizableHandle withHandle />
						<ResizablePanel defaultSize={25} minSize={15}>
							<SimulationPanel
								nodes={nodes}
								edges={edges}
								onNodesChange={onNodesChange}
								onReset={onResetSimulation}
								nodeTypes={nodeTypes}
								content={simulation}
							/>
						</ResizablePanel>
					</>
				)}
			</ResizablePanelGroup>
		</div>
	);
}
