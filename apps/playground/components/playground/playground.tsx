"use client";

import { useState, useEffect } from "react";
import { LessonPanel } from "./lesson-panel";
import { LessonContentPanel } from "./lesson-content-panel";
import { CurriculumSidebar } from "./curriculum-sidebar";
import { CodePanel } from "./code-panel";
import { OutputPanel } from "./output-panel";
import { MergedView } from "./merged-view";
import {
	ResizableHandle,
	ResizablePanel,
	ResizablePanelGroup,
} from "@/components/playground/resizable";
import { useIsMobile } from "@/hooks/use-mobile";
import { PlaygroundProps } from "@/types/playground";

import {
	BarChart3,
	BookOpen,
	ChevronLeft,
	Code2,
	ListTree,
	Map,
	TerminalSquare,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { cn } from "@nuru/ui/lib/utils";
import {
	PlaygroundProvider,
	PlaygroundContextValue,
	PlaygroundViewMode,
} from "./playground-context";


export function Playground(props: PlaygroundProps) {
	const { module, state, actions, labels, lang } = props;
	const router = useRouter();
	const isMobileRaw = useIsMobile();
	const [mounted, setMounted] = useState(false);
	useEffect(() => {
		setMounted(true);
	}, []);
	// Until mounted on the client, render the deterministic desktop shell so
	// the server HTML and the first client render match. Switch to the mobile
	// tree only AFTER hydration.
	const isMobile = mounted && isMobileRaw;

	const [activeMaximizedPanel, setActiveMaximizedPanel] = useState<
		string | null
	>(null);
	const [viewMode, setViewMode] = useState<PlaygroundViewMode>("lesson");
	const [lessonExpanded, setLessonExpanded] = useState(true);

	// Return to lesson view whenever the lesson changes (e.g. user clicked a node).
	useEffect(() => {
		setViewMode("lesson");
	}, [module?.id, state.currentLessonIndex]);


	useEffect(() => {
		if (!isMobile) {
			if (module?.panels?.renderer?.defaultState === "maximized") {
				setActiveMaximizedPanel("renderer");
			} else {
				setActiveMaximizedPanel(null);
			}
		}
	}, [isMobile, module?.id, module?.panels]);

	const currentLesson = module?.lessons[state.currentLessonIndex ?? 0];
	const isCurrentLessonCompleted = module
		? (state.completedLessonIndices?.has(state.currentLessonIndex ?? 0) ?? false)
		: undefined;
	const isLastLesson = module
		? state.currentLessonIndex === module.lessons.length - 1
		: undefined;
	const nextActionLabel = isLastLesson ? labels.nextModule : labels.next;
	let handleNextAction: (() => void) | undefined = undefined;
	if (module) {
		handleNextAction = isLastLesson
			? actions.onNextModule
			: actions.onLessonChange
				? () => actions.onLessonChange!((state.currentLessonIndex ?? 0) + 1)
				: undefined;
	}

	const handleRun = () => {
		actions.onRun();
		if (isMobile) {
			setViewMode("output");
		}
	};

	const maximizePanel = (panelId: string) => setActiveMaximizedPanel(panelId);
	const restorePanels = () => setActiveMaximizedPanel(null);
	const togglePanel = (_panelId: string) => {};

	const contextValue: PlaygroundContextValue = {
		...props,
		isCurrentLessonCompleted,
		isLastLesson,
		handleNextAction,
		nextActionLabel,
		viewMode,
		setViewMode,
		panels: {
			maximizePanel,
			restorePanels,
			togglePanel,
			activeMaximizedPanel,
		},

	};

	// ---------- Mobile: mockup-driven shell; desktop untouched ----------
	if (isMobile) {
		const progressWidth = module
			? `${(((state.currentLessonIndex ?? 0) + 1) / module.lessons.length) * 100}%`
			: "0%";
		const mobileTabs: Array<{
			mode: PlaygroundViewMode;
			label: string;
			Icon: typeof BookOpen;
		}> = [
			{ mode: "lesson", label: "Lesson", Icon: BookOpen },
			{ mode: "code", label: "Code", Icon: Code2 },
			{ mode: "output", label: "Output", Icon: TerminalSquare },
			{ mode: "lesson-map", label: "Map", Icon: Map },
			{ mode: "progress", label: "Progress", Icon: BarChart3 },
			{ mode: "curriculum", label: "Modules", Icon: ListTree },
		];

		return (
			<PlaygroundProvider value={contextValue}>
				<div className="relative flex h-full max-h-full flex-1 flex-col overflow-hidden bg-white">
				<div className="shrink-0 border-b border-slate-200 bg-white px-3 pb-2 pt-2">
					<div className="flex items-center justify-between gap-3">
						<button
							type="button"
							onClick={() => router.push(`/${lang}/anza`)}
							className="inline-flex h-7 shrink-0 items-center gap-1 rounded-full px-2 text-[12px] font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900"
							aria-label="Back"
						>
							<ChevronLeft className="h-4 w-4" />
							<span>Back</span>
						</button>
						{module && (
							<div className="min-w-0 flex-1 text-right text-[11px] font-medium text-slate-500">
								Step {(state.currentLessonIndex ?? 0) + 1} / {module.lessons.length}
							</div>
						)}
					</div>

					{module && (
						<div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-100">
							<div className="h-full rounded-full bg-blue-500" style={{ width: progressWidth }} />
						</div>
					)}

					<div className="mt-2 flex gap-1.5 overflow-x-auto pb-0.5 no-scrollbar">
						{mobileTabs.map(({ mode, label, Icon }) => (
							<button
								key={mode}
								type="button"
								onClick={() => setViewMode(mode)}
								className={cn(
									"inline-flex h-7 shrink-0 items-center gap-1 rounded-full border px-2.5 text-[11px] font-semibold transition-colors",
									viewMode === mode
										? "border-blue-600 bg-blue-600 text-white"
										: "border-slate-200 bg-white text-slate-600 hover:bg-slate-50",
								)}
							>
								<Icon className="h-3 w-3" />
								<span>{label}</span>
							</button>
						))}
					</div>
				</div>

					<div className="min-h-0 flex-1 overflow-hidden bg-white px-3 pb-3 pt-3">
						<div className="h-full min-h-0 overflow-hidden">
							{viewMode === "lesson" && (
								<LessonPanel
									collapsible
									expanded={lessonExpanded}
									onToggle={() => setLessonExpanded((value) => !value)}
								/>
							)}
							{viewMode === "code" && <CodePanel onRun={handleRun} isMobile />}
							{viewMode === "output" && <OutputPanel isMobile />}
							{viewMode === "lesson-map" && <MergedView isMobile />}
							{viewMode === "progress" && <MergedView isMobile />}
							{viewMode === "curriculum" && <CurriculumSidebar isMobile />}
						</div>
					</div>
				</div>
			</PlaygroundProvider>
		);
	}

	// ---------- Desktop: 3-column shell matching the mockups ----------
	const showSidebar = !!module;
	const isMerged = showSidebar && (viewMode === "lesson-map" || viewMode === "progress");

	return (
		<PlaygroundProvider value={contextValue}>
			<div className="relative h-full min-h-0 overflow-hidden bg-slate-50 p-3">
				<ResizablePanelGroup direction="horizontal" className="h-full min-h-0 overflow-hidden">
					{showSidebar && (
						<>
							<ResizablePanel
								defaultSize={20}
								minSize={14}
								maxSize={30}
								collapsible
								collapsedSize={0}
								className="min-h-0 overflow-hidden"
							>
								<CurriculumSidebar />
							</ResizablePanel>
							<ResizableHandle />
						</>
					)}

					{isMerged ? (
						<ResizablePanel defaultSize={80} minSize={40} className="min-h-0 overflow-hidden">
							<MergedView />
						</ResizablePanel>
					) : (
						<>
							{showSidebar && (
								<>
									<ResizablePanel defaultSize={38} minSize={24} className="min-h-0 overflow-hidden">
										<LessonContentPanel />
									</ResizablePanel>
									<ResizableHandle />
								</>
							)}

							<ResizablePanel defaultSize={showSidebar ? 42 : 100} minSize={28} className="min-h-0 overflow-hidden">
								<ResizablePanelGroup direction="vertical" className="h-full min-h-0 overflow-hidden">
									<ResizablePanel defaultSize={62} minSize={25} className="min-h-0 overflow-hidden">
										<div className="h-full pb-1.5">
											<CodePanel editorOnly />
										</div>
									</ResizablePanel>
									<ResizableHandle className="!bg-transparent" />
									<ResizablePanel
										defaultSize={38}
										minSize={15}
										collapsible
										collapsedSize={0}
										className="min-h-0 overflow-hidden"
									>
										<div className="h-full pt-1.5">
											<OutputPanel showToolbar={false} />
										</div>
									</ResizablePanel>
								</ResizablePanelGroup>
							</ResizablePanel>
						</>
					)}
				</ResizablePanelGroup>
			</div>
		</PlaygroundProvider>

	);
}
