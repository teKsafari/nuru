"use client";

import React from "react";
import { Play, RotateCcw, Eye, HelpCircle } from "lucide-react";
import { CodeEditor } from "./code-editor";
import { OutputPanel } from "./output-panel";
import { Button } from "@/components/ui/button";
import {
	ResizableHandle,
	ResizablePanel,
	ResizablePanelGroup,
} from "@/components/playground/resizable";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { Dictionary } from "@/app/(main)/[lang]/dictionaries";

interface CodePanelProps {
	code: string;
	output: string;
	onCodeChange: (code: string) => void;
	onRun: () => void;
	onSubmit: () => void;
	onShowSolution: () => void;
	onShowHint: () => void;
	onReset: () => void;
	isMobile?: boolean;
	mobileExtra?: React.ReactNode;
	theme?: "light" | "dark";
	lang: "en" | "sw";
	dict: Dictionary;
}

export function CodePanel({
	code,
	output,
	onCodeChange,
	onRun,
	onSubmit,
	onShowSolution,
	onShowHint,
	onReset,
	isMobile,
	mobileExtra,
  theme,
  lang,
  dict
}: CodePanelProps) {
	const isDev = process.env.NODE_ENV === "development";

	const actions = (
		<TooltipProvider>
			<div className="flex items-center gap-2">
				<Tooltip>
					<TooltipTrigger asChild>
						<Button
							variant="outline"
							size="icon"
							onClick={onReset}
							className="h-8 w-8 text-muted-foreground hover:text-foreground border-border/50 bg-background/50 shadow-xs"
						>
							<RotateCcw className="h-4 w-4" />
						</Button>
					</TooltipTrigger>
					<TooltipContent side="top" className="text-[10px] uppercase font-bold tracking-wider">
						{dict.codePanel.reset}
					</TooltipContent>
				</Tooltip>

				<Tooltip>
					<TooltipTrigger asChild>
						<Button
							variant="outline"
							size="icon"
							onClick={onShowHint}
							className="h-8 w-8 text-muted-foreground hover:text-foreground border-border/50 bg-background/50 shadow-xs"
						>
							<HelpCircle className="h-4 w-4" />
						</Button>
					</TooltipTrigger>
					<TooltipContent side="top" className="text-[10px] uppercase font-bold tracking-wider">
						{dict.codePanel.hint}
					</TooltipContent>
				</Tooltip>

				{isDev && (
					<Tooltip>
						<TooltipTrigger asChild>
							<Button
								variant="outline"
								size="icon"
								onClick={onShowSolution}
								className="h-8 w-8 text-muted-foreground hover:text-foreground border-border/50 bg-background/50 shadow-xs"
							>
								<Eye className="h-4 w-4" />
							</Button>
						</TooltipTrigger>
						<TooltipContent side="top" className="text-[10px] uppercase font-bold tracking-wider">
							{dict.codePanel.showSolution}
						</TooltipContent>
					</Tooltip>
				)}

				<Button
					onClick={onRun}
					size="icon"
					className="h-8 bg-primary text-xs font-bold text-primary-foreground shadow-md hover:bg-primary/90 hover:scale-[1.02] active:scale-95 transition-all flex items-center gap-2"
				>
					<Play className="h-3.5 w-3.5 fill-current" />
				</Button>
			</div>
		</TooltipProvider>
	);

	// Mobile: editor with floating action group (output is handled by parent)
	if (isMobile) {
		return (
			<div className="bg-background relative flex h-full flex-col">
				<CodeEditor code={code} onChange={onCodeChange} theme={theme}/>
				<div className="absolute bottom-3 right-3 z-10">
					{actions}
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
						<div className="absolute bottom-3 right-3 z-10">{actions}</div>
					</div>
				</ResizablePanel>
				<ResizableHandle withHandle />
				<ResizablePanel defaultSize={40} minSize={15}>
					<OutputPanel output={output} showToolbar={false} dict={dict} />
				</ResizablePanel>
			</ResizablePanelGroup>
		</div>
	);
}