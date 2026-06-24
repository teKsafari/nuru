"use client";
import React from "react";
import { Play, RotateCcw, Maximize2, MoreVertical, AlignLeft, CircleDot, ArrowRight, Eye, HelpCircle } from "lucide-react";
import { CodeEditor } from "@nuru/ui/components/code-editor";
import { OutputPanel } from "./output-panel";
import { Button } from "@nuru/ui/components/button";
import { cn } from "@nuru/ui/lib/utils";
import {
	ResizableHandle,
	ResizablePanel,
	ResizablePanelGroup,
} from "@/components/playground/resizable";
import { usePlayground } from "./playground-context";
import { ImperativePanelHandle } from "react-resizable-panels";

interface CodePanelProps {
	onRun?: () => void;
	isMobile?: boolean;
	mobileExtra?: React.ReactNode;
	/** When true, render only the editor card (no stacked output). Used by the desktop 3-column layout. */
	editorOnly?: boolean;
}

export function CodePanel({
	onRun: onRunProp,
	isMobile,
	editorOnly,
}: CodePanelProps) {
	const {
		module,
		panels: { activeMaximizedPanel, maximizePanel, restorePanels },
		state: { code },
		actions: {
			onCodeChange,
			onRun: onRunAction,
			onShowSolution,
			onShowHint,
			onReset,
		},
		theme,
		labels,
		extensions,
		isCurrentLessonCompleted: isCompleted,
		handleNextAction: onNextAction,
		nextActionLabel,
	} = usePlayground();

	const editorPanelRef = React.useRef<ImperativePanelHandle>(null);
	const outputPanelRef = React.useRef<ImperativePanelHandle>(null);

	React.useEffect(() => {
		if (module?.panels?.terminal?.defaultState === "closed") {
			outputPanelRef.current?.collapse();
		} else {
			outputPanelRef.current?.expand();
		}
	}, [module?.id, module?.panels?.terminal?.defaultState]);

	React.useEffect(() => {
		if (activeMaximizedPanel === "renderer") {
			editorPanelRef.current?.collapse();
		} else {
			editorPanelRef.current?.expand();
		}
	}, [activeMaximizedPanel]);

	const onRun = onRunProp || onRunAction;
	const isMaximized = activeMaximizedPanel === "editor";
	const isDev = process.env.NODE_ENV === "development";

	const fileExt = module?.executor === "python" ? "py" : "nr";

	const editor = (
		<div className="flex h-full w-full flex-col overflow-hidden rounded-2xl border border-slate-800 bg-[#0b1220] shadow-sm">
			{/* File tab header */}
			<div className="flex h-11 shrink-0 items-center justify-between border-b border-slate-800/80 bg-[#0b1220] pl-4 pr-2">
				<div className="flex items-center gap-2">
					<div className="flex items-center gap-2 border-b-2 border-blue-500 px-1 pb-[10px] pt-[10px] -mb-px">
						<span className="text-[12.5px] font-medium text-slate-200">
							main.{fileExt}
						</span>
						<span className="block h-1.5 w-1.5 rounded-full bg-blue-400" />
					</div>
				</div>
				<div className="flex items-center gap-1">
					<button
						onClick={() =>
							isMaximized ? restorePanels() : maximizePanel("editor")
						}
						aria-label="Maximize editor"
						className="rounded-md p-1.5 text-slate-400 hover:bg-slate-800 hover:text-slate-200"
					>
						<Maximize2 className="h-4 w-4" />
					</button>
					<button
						aria-label="More"
						className="rounded-md p-1.5 text-slate-400 hover:bg-slate-800 hover:text-slate-200"
					>
						<MoreVertical className="h-4 w-4" />
					</button>
				</div>
			</div>

			{/* Editor */}
			<div className="relative min-h-0 flex-1">
				<CodeEditor
					code={code}
					onChange={onCodeChange}
					theme="dark"
					extensions={extensions}
				/>
			</div>

			{/* Action bar */}
			<div className="flex h-12 shrink-0 items-center justify-between border-t border-slate-800/80 bg-[#0b1220] px-3">
				<div className="flex items-center gap-1">
					<button
						type="button"
						onClick={() => {
							// Basic format: convert tabs to 2 spaces, strip trailing whitespace,
							// collapse 3+ blank lines, ensure trailing newline.
							const formatted = code
								.replace(/\t/g, "  ")
								.split("\n")
								.map((l) => l.replace(/\s+$/g, ""))
								.join("\n")
								.replace(/\n{3,}/g, "\n\n")
								.replace(/\s*$/, "\n");
							if (formatted !== code) onCodeChange(formatted);
						}}
						className="flex items-center gap-2 rounded-md px-2.5 py-1.5 text-[12px] text-slate-300 hover:bg-slate-800"
					>
						<AlignLeft className="h-3.5 w-3.5" />
						<span>Format Code</span>
						<span className="ml-1 rounded bg-slate-800 px-1.5 py-0.5 text-[10px] text-slate-400">
							Ctrl+Shift+F
						</span>
					</button>
				</div>
				<div className="flex items-center gap-2">
					{onShowHint && (
						<button
							onClick={onShowHint}
							aria-label={labels.hint}
							className="rounded-md p-1.5 text-slate-400 hover:bg-slate-800 hover:text-slate-200"
						>
							<HelpCircle className="h-4 w-4" />
						</button>
					)}
					{isDev && onShowSolution && (
						<button
							onClick={onShowSolution}
							aria-label={labels.showSolution}
							className="rounded-md p-1.5 text-slate-400 hover:bg-slate-800 hover:text-slate-200"
						>
							<Eye className="h-4 w-4" />
						</button>
					)}
					<button
						onClick={onReset}
						className="flex items-center gap-1.5 rounded-md px-3 py-1.5 text-[12.5px] text-slate-300 hover:bg-slate-800"
					>
						<RotateCcw className="h-3.5 w-3.5" />
						<span>{labels.reset}</span>
					</button>
					<Button
						onClick={onRun}
						size="sm"
						className="h-8 gap-2 rounded-lg bg-blue-600 px-4 text-[12.5px] font-semibold text-white shadow-sm hover:bg-blue-700"
					>
						<Play className="h-3.5 w-3.5 fill-current" />
						<span>{labels.run}</span>
						<span className="ml-1 rounded bg-blue-700/60 px-1.5 py-0.5 text-[10px] font-medium text-blue-50">
							Ctrl+Enter
						</span>
					</Button>
					{isCompleted && onNextAction && (
						<Button
							onClick={onNextAction}
							size="sm"
							className="h-8 gap-1.5 rounded-lg bg-emerald-600 px-3 text-[12px] font-semibold text-white hover:bg-emerald-700"
						>
							{nextActionLabel}
							<ArrowRight className="h-3.5 w-3.5" />
						</Button>
					)}
				</div>
			</div>
		</div>
	);

	// Editor-only: parent renders OutputPanel separately
	if (editorOnly) {
		return <div className="h-full w-full">{editor}</div>;
	}

	// Mobile
	if (isMobile) {
		return (
			<div className="relative flex h-full flex-col overflow-hidden bg-slate-50 text-sm">
				<div className="min-h-0 flex-1 p-2">{editor}</div>
			</div>
		);
	}

	// Fallback desktop: stacked editor + output (used when no module / no sidebar)
	return (
		<div className="flex h-full flex-col bg-slate-50">
			<ResizablePanelGroup direction="vertical" className="flex-1">
				{activeMaximizedPanel !== "renderer" && (
					<>
						<ResizablePanel
							ref={editorPanelRef}
							defaultSize={60}
							minSize={30}
							collapsible
							collapsedSize={0}
						>
							<div className="h-full p-3 pb-2">{editor}</div>
						</ResizablePanel>
						<ResizableHandle />
					</>
				)}
				<ResizablePanel
					ref={outputPanelRef}
					defaultSize={activeMaximizedPanel === "renderer" ? 100 : 40}
					minSize={15}
					collapsible
					collapsedSize={0}
				>
					<div className="h-full px-3 pb-3 pt-1">
						<OutputPanel showToolbar={false} />
					</div>
				</ResizablePanel>
			</ResizablePanelGroup>
		</div>
	);
}
