"use client";

import { useState } from "react";
import { LessonPanel } from "./lesson-panel";
import { CodePanel } from "./code-panel";
import {
	ResizableHandle,
	ResizablePanel,
	ResizablePanelGroup,
} from "@/components/playground/resizable";
import { useIsMobile } from "@/hooks/use-mobile";
import { MobileNav } from "./mobile-nav";
import { PlaygroundProps } from "@/types/playground";

export function Playground({
	lesson,
	executor,
	simulation,
	nodes = [],
	edges = [],
	onNodesChange,
	nodeTypes,
}: PlaygroundProps) {
	const isMobile = useIsMobile();
	const [activeTab, setActiveTab] = useState<"lesson" | "code">("lesson");
	const [code, setCode] = useState(lesson.initialCode);
	const [output, setOutput] = useState("");

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

	const codePanelProps = {
		code,
		output,
		onCodeChange: setCode,
		onRun: handleRun,
		onSubmit: handleSubmit,
		onShowSolution: handleShowSolution,
		hasSimulation,
		nodes,
		edges,
		onNodesChange,
		nodeTypes,
		simulationContent: simulation,
	};

	if (isMobile) {
		return (
			<div className="flex max-h-full flex-1 flex-col bg-background">
				<MobileNav activeTab={activeTab} onTabChange={setActiveTab} />
				<div className="flex-1 overflow-hidden">
					{activeTab === "lesson" ? (
						<LessonPanel lesson={lesson} />
					) : (
						<CodePanel {...codePanelProps} />
					)}
				</div>
			</div>
		);
	}

	return (
		<div className="h-screen bg-background">
			<ResizablePanelGroup direction="horizontal" className="h-full">
				<ResizablePanel defaultSize={35} minSize={20}>
					<LessonPanel lesson={lesson} />
				</ResizablePanel>
				<ResizableHandle withHandle />
				<ResizablePanel defaultSize={65} minSize={30}>
					<CodePanel {...codePanelProps} />
				</ResizablePanel>
			</ResizablePanelGroup>
		</div>
	);
}
