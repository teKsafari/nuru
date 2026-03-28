"use client";
import React from "react";
import { Play, RotateCcw, Eye, HelpCircle, ArrowRight } from "lucide-react";
import { CodeEditor } from "./code-editor";
import { OutputPanel } from "./output-panel";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
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
import { PlaygroundLabels } from "@/types/playground";
import { Extension } from "@codemirror/state";

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
	labels: PlaygroundLabels;
	extensions?: Extension[];
	isCompleted?: boolean;
	onNextAction?: () => void;
	nextActionLabel?: string;
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
  labels,
  extensions,
  isCompleted,
  onNextAction,
  nextActionLabel
}: CodePanelProps) {
	const isDev = process.env.NODE_ENV === "development";

	const actions = (isMobileLayout: boolean) => (
		<TooltipProvider>
			<div className={cn(
				"flex items-center gap-1.5 transition-all",
				!isMobileLayout && "rounded-xl border border-border/50 bg-background/60 p-1.5 backdrop-blur-md shadow-lg"
			)}>
				<Tooltip>
					<TooltipTrigger asChild>
						<Button
							variant="ghost"
							size="icon"
							onClick={onReset}
							className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
						>
							<RotateCcw className="h-4 w-4" />
						</Button>
					</TooltipTrigger>
					<TooltipContent side="top" className="text-[10px] uppercase font-bold tracking-wider">
						{labels.reset}
					</TooltipContent>
				</Tooltip>

				<Tooltip>
					<TooltipTrigger asChild>
						<Button
							variant="ghost"
							size="icon"
							onClick={onShowHint}
							className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
						>
							<HelpCircle className="h-4 w-4" />
						</Button>
					</TooltipTrigger>
					<TooltipContent side="top" className="text-[10px] uppercase font-bold tracking-wider">
						{labels.hint}
					</TooltipContent>
				</Tooltip>

				{isDev && (
					<Tooltip>
						<TooltipTrigger asChild>
							<Button
								variant="ghost"
								size="icon"
								onClick={onShowSolution}
								className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
							>
								<Eye className="h-4 w-4" />
							</Button>
						</TooltipTrigger>
						<TooltipContent side="top" className="text-[10px] uppercase font-bold tracking-wider">
							{labels.showSolution}
						</TooltipContent>
					</Tooltip>
				)}

				<div className="mx-1 h-4 w-px bg-border/50" />

				<Button
					onClick={onRun}
					size="sm"
					className="h-8 bg-primary px-3 text-[11px] font-black tracking-wider uppercase text-primary-foreground shadow-lg shadow-primary/20 hover:bg-primary/90 hover:scale-[1.02] active:scale-95 transition-all flex items-center gap-2"
				>
					<Play className="h-3 w-3 fill-current" />
					{labels.run}
				</Button>

				{isCompleted && onNextAction && (
					<>
						<div className="mx-1 h-4 w-px bg-border/50" />
						<Button
							onClick={onNextAction}
							size="sm"
							className="h-8 bg-green-600 px-3 text-[11px] font-black tracking-wider uppercase text-white shadow-lg shadow-green-600/20 hover:bg-green-700 hover:scale-[1.02] active:scale-95 transition-all flex items-center gap-2 animate-pulse"
						>
							{nextActionLabel}
							<ArrowRight className="h-3 w-3" />
						</Button>
					</>
				)}
			</div>
		</TooltipProvider>
	);

	// Mobile: editor with bottom toolbar (above terminal)
	if (isMobile) {
		return (
			<div className="bg-background relative flex h-full flex-col overflow-hidden text-sm">
				<div className="flex-1 overflow-hidden">
					<CodeEditor code={code} onChange={onCodeChange} theme={theme} extensions={extensions}/>
				</div>
				<div className="flex-none flex items-center justify-end p-2 border-t border-border bg-muted/5 backdrop-blur-sm z-10 shrink-0">
					{actions(true)}
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
						<CodeEditor code={code} onChange={onCodeChange} theme={theme} extensions={extensions} />
						<div className="absolute bottom-3 right-3 z-10">{actions(false)}</div>
					</div>
				</ResizablePanel>
				<ResizableHandle withHandle />
				<ResizablePanel defaultSize={40} minSize={15}>
					<OutputPanel output={output} showToolbar={false} labels={labels} />
				</ResizablePanel>
			</ResizablePanelGroup>
		</div>
	);
}