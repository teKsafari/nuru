"use client";
import React from "react";
import {
	Play,
	RotateCcw,
	Maximize2,
	MoreVertical,
	AlignLeft,
	ArrowRight,
	Eye,
	HelpCircle,
	BookOpen,
	TerminalSquare,
} from "lucide-react";
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
		labels,
		extensions,
		isCurrentLessonCompleted: isCompleted,
		handleNextAction: onNextAction,
		nextActionLabel,
		viewMode,
		setViewMode,
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

	const mobileEditor = (
		<div className="flex h-full min-h-0 w-full flex-col overflow-hidden rounded-[20px] border border-slate-200 bg-[#071225] shadow-[0_18px_46px_-30px_rgba(15,23,42,0.55)]">
			<div className="flex h-12 shrink-0 items-center justify-between border-b border-slate-700/70 px-4">
				<div className="flex min-w-0 items-center gap-2.5">
					<span className="truncate font-mono text-[14px] font-medium text-blue-400">
						main.{fileExt}
					</span>
					<span className="block h-2.5 w-2.5 shrink-0 rounded-full bg-blue-500" />
				</div>
				<div className="flex items-center gap-1.5">
					<button
						onClick={() =>
							isMaximized ? restorePanels() : maximizePanel("editor")
						}
						aria-label="Maximize editor"
						className="rounded-md p-1.5 text-slate-400 hover:bg-slate-800 hover:text-slate-100"
					>
						<Maximize2 className="h-4 w-4" />
					</button>
					<button
						aria-label="More"
						className="rounded-md p-1.5 text-slate-400 hover:bg-slate-800 hover:text-slate-100"
					>
						<MoreVertical className="h-4 w-4" />
					</button>
				</div>
			</div>

			<div className="relative min-h-0 flex-1">
				<CodeEditor
					code={code}
					onChange={onCodeChange}
					theme="dark"
					extensions={extensions}
					className="[&_.cm-content]:text-[13px] [&_.cm-gutters]:text-[12px]"
				/>
			</div>

			<div className="flex shrink-0 items-center justify-between gap-2 border-t border-slate-700/70 px-3 py-3">
				<div className="grid grid-cols-3 gap-1.5">
					<button
						type="button"
						onClick={() => setViewMode("lesson")}
						className={cn(
							"flex h-12 w-14 flex-col items-center justify-center gap-0.5 rounded-xl text-[10.5px] font-medium transition-colors",
							viewMode === "lesson"
								? "bg-slate-800/90 text-blue-400"
								: "text-slate-300 hover:bg-slate-800/70",
						)}
					>
						<BookOpen className="h-4 w-4" />
						<span>Lesson</span>
					</button>
					<button
						type="button"
						onClick={() => setViewMode("output")}
						className={cn(
							"flex h-12 w-14 flex-col items-center justify-center gap-0.5 rounded-xl text-[10.5px] font-medium transition-colors",
							viewMode === "output"
								? "bg-slate-800/90 text-blue-400"
								: "text-slate-300 hover:bg-slate-800/70",
						)}
					>
						<TerminalSquare className="h-4 w-4" />
						<span>Output</span>
					</button>
					<button
						type="button"
						onClick={onReset}
						className="flex h-12 w-14 flex-col items-center justify-center gap-0.5 rounded-xl text-[10.5px] font-medium text-slate-300 transition-colors hover:bg-slate-800/70"
					>
						<RotateCcw className="h-4 w-4" />
						<span>{labels.reset}</span>
					</button>
				</div>

				<div className="flex items-center gap-2">
					{onShowHint && (
						<button
							onClick={onShowHint}
							aria-label={labels.hint}
							className="hidden h-12 rounded-2xl border border-slate-600/80 px-4 text-[12px] font-medium text-blue-300 shadow-sm hover:bg-slate-800/70 sm:inline-flex sm:items-center sm:gap-2"
						>
							<HelpCircle className="h-4 w-4" />
							<span>{labels.hint}</span>
						</button>
					)}
					<Button
						onClick={onRun}
						className="h-12 min-w-[104px] rounded-2xl bg-blue-500 px-4 text-[14px] font-semibold text-white shadow-[0_14px_34px_-18px_rgba(59,130,246,0.9)] hover:bg-blue-600"
					>
						<Play className="mr-2 h-5 w-5 fill-current" />
						<span>{labels.run}</span>
					</Button>
				</div>
			</div>
		</div>
	);

	const desktopEditor = (
		<div className="flex h-full w-full flex-col overflow-hidden rounded-2xl border border-slate-800 bg-[#0b1220] shadow-sm">
			<div className="flex h-11 shrink-0 items-center justify-between border-b border-slate-800/80 bg-[#0b1220] pl-4 pr-2">
				<div className="flex items-center gap-2">
					<div className="-mb-px flex items-center gap-2 border-b-2 border-blue-500 px-1 pb-[10px] pt-[10px]">
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

			<div className="relative min-h-0 flex-1">
				<CodeEditor
					code={code}
					onChange={onCodeChange}
					theme="dark"
					extensions={extensions}
				/>
			</div>

			<div className="flex h-12 shrink-0 items-center justify-between border-t border-slate-800/80 bg-[#0b1220] px-3">
				<div className="flex items-center gap-1">
					<button
						type="button"
						onClick={() => {
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

	if (editorOnly) {
		return <div className="h-full w-full">{desktopEditor}</div>;
	}

	if (isMobile) {
		return <div className="h-full w-full">{mobileEditor}</div>;
	}

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
							<div className="h-full p-3 pb-2">{desktopEditor}</div>
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
