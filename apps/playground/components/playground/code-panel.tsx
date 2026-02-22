"use client";

import React from "react";
import { Play } from "lucide-react";
import { CodeEditor } from "./code-editor";
import { OutputPanel } from "./output-panel";
import { Button } from "@/components/ui/button";
import {
	ResizableHandle,
	ResizablePanel,
	ResizablePanelGroup,
} from "@/components/playground/resizable";

interface CodePanelProps {
	code: string;
	output: string;
	onCodeChange: (code: string) => void;
	onRun: () => void;
	onSubmit: () => void;
	onShowSolution: () => void;
	isMobile?: boolean;
	mobileExtra?: React.ReactNode;
	theme?: "light" | "dark";
}

export function CodePanel({
	code,
	output,
	onCodeChange,
	onRun,
	onSubmit,
	onShowSolution,
	isMobile,
	mobileExtra,
  theme
}: CodePanelProps) {

	const runButton = (
		<Button
			onClick={onRun}
			size="sm"
			className="h-8 bg-primary px-3 text-xs text-primary-foreground shadow-md hover:bg-primary/90"
		>
			<Play className="mr-1.5 h-3 w-3" />
			Run
		</Button>
	);

	// Mobile: editor with floating action group (output is handled by parent)
	if (isMobile) {
		return (
			<div className="bg-background relative flex h-full flex-col">
				<CodeEditor code={code} onChange={onCodeChange} theme={theme}/>
				<div className="absolute bottom-3 right-3 z-10 flex items-center gap-2">
					{mobileExtra}
					{runButton}
				</div>
			</div>
		);
	}

	// Desktop: editor with floating run button + output
	return (
		<div className="bg-background flex h-full flex-col">
			<ResizablePanelGroup direction="vertical" className="flex-1">
				<ResizablePanel defaultSize={60} minSize={30}>
					<div className="relative h-full">
						<CodeEditor code={code} onChange={onCodeChange} theme={theme} />
						<div className="absolute bottom-3 right-3 z-10">{runButton}</div>
					</div>
				</ResizablePanel>
				<ResizableHandle withHandle />
				<ResizablePanel defaultSize={40} minSize={15}>
					<OutputPanel output={output} showToolbar={false} />
				</ResizablePanel>
			</ResizablePanelGroup>
		</div>
	);
}
