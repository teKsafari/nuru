"use client";

import { useRef, useState, useEffect } from "react";
import type { ImperativePanelHandle } from "react-resizable-panels";
import { LessonPanel } from "./lesson-panel";
import { LessonContentPanel } from "./lesson-content-panel";
import { CurriculumSidebar } from "./curriculum-sidebar";
import { CodePanel } from "./code-panel";
import { OutputPanel } from "./output-panel";
import {
	ResizableHandle,
	ResizablePanel,
	ResizablePanelGroup,
} from "@/components/playground/resizable";
import { useIsMobile } from "@/hooks/use-mobile";
import { PlaygroundProps } from "@/types/playground";
import { CheckCircle2, BookOpen, ChevronDown } from "lucide-react";
import { Drawer } from "@nuru/ui/components/drawer";
import { DrawerContent } from "@nuru/ui/components/drawer";
import { DrawerTrigger } from "@nuru/ui/components/drawer";
import { DrawerTitle } from "@nuru/ui/components/drawer";
import { DrawerDescription } from "@nuru/ui/components/drawer";
import {
	PlaygroundProvider,
	PlaygroundContextValue,
} from "./playground-context";

export function Playground(props: PlaygroundProps) {
	const { module, state, actions, labels, lang } = props;
	const isMobile = useIsMobile();
	const [moduleDrawerOpen, setModuleDrawerOpen] = useState(false);

	const bottomPanelRef = useRef<ImperativePanelHandle>(null);

	const [activeMaximizedPanel, setActiveMaximizedPanel] = useState<
		string | null
	>(null);

	useEffect(() => {
		if (!isMobile) {
			if (module?.panels?.renderer?.defaultState === "maximized") {
				setActiveMaximizedPanel("renderer");
			} else {
				setActiveMaximizedPanel(null);
			}
		}
	}, [isMobile, module?.id, module?.panels]);

	useEffect(() => {
		if (isMobile && module && state.currentLessonIndex === 0) {
			const timer = setTimeout(() => setModuleDrawerOpen(true), 500);
			return () => clearTimeout(timer);
		}
	}, [isMobile, module?.id, state.currentLessonIndex]);

	const currentLesson = module?.lessons[state.currentLessonIndex ?? 0];
	const isCurrentLessonCompleted = module
		? (state.completedLessonIndices?.has(state.currentLessonIndex ?? 0) ??
			false)
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
			bottomPanelRef.current?.expand();
			bottomPanelRef.current?.resize(20);
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
		panels: {
			maximizePanel,
			restorePanels,
			togglePanel,
			activeMaximizedPanel,
		},
	};

	// ---------- Mobile (unchanged behavior, light surfaces) ----------
	if (isMobile) {
		return (
			<PlaygroundProvider value={contextValue}>
				<div className="relative flex max-h-full flex-1 flex-col overflow-hidden bg-slate-50">
					{module && (
						<Drawer open={moduleDrawerOpen} onOpenChange={setModuleDrawerOpen}>
							<DrawerTrigger asChild>
								<button className="z-10 flex w-full shrink-0 items-center justify-between border-b border-slate-200 bg-white px-4 py-3 text-left shadow-sm">
									<div className="mr-4 flex min-w-0 flex-1 items-center gap-3">
										<div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50">
											<BookOpen className="h-4 w-4 text-blue-600" />
										</div>
										<div className="flex min-w-0 flex-col">
											<span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
												{labels.lesson} {(state.currentLessonIndex ?? 0) + 1}
											</span>
											<h1 className="truncate text-sm font-semibold text-slate-900">
												{currentLesson?.title[lang] || currentLesson?.title.sw}
											</h1>
										</div>
									</div>
									<div className="flex shrink-0 items-center gap-2">
										{isCurrentLessonCompleted ? (
											<CheckCircle2 className="h-5 w-5 text-emerald-500" />
										) : (
											<div className="h-2 w-2 rounded-full bg-slate-300" />
										)}
										<ChevronDown className="h-4 w-4 text-slate-400" />
									</div>
								</button>
							</DrawerTrigger>
							<DrawerContent className="max-h-[85vh]">
								<DrawerTitle className="sr-only">
									{currentLesson?.title[lang] || currentLesson?.title.sw}
								</DrawerTitle>
								<DrawerDescription className="sr-only">
									Lesson instructions
								</DrawerDescription>
								<div className="h-full overflow-y-auto px-4 pt-2 pb-8">
									<LessonPanel collapsible={false} expanded={true} />
								</div>
							</DrawerContent>
						</Drawer>
					)}

					<div className="relative flex-1 overflow-hidden">
						<ResizablePanelGroup direction="vertical">
							<ResizablePanel defaultSize={80} minSize={20}>
								<CodePanel onRun={handleRun} isMobile />
							</ResizablePanel>
							<ResizableHandle withHandle />
							<ResizablePanel
								ref={bottomPanelRef}
								defaultSize={20}
								minSize={10}
								collapsible
								collapsedSize={0}
							>
								<div className="h-full bg-slate-50 p-2">
									<OutputPanel showToolbar={false} />
								</div>
							</ResizablePanel>
						</ResizablePanelGroup>
					</div>
				</div>
			</PlaygroundProvider>
		);
	}

	// ---------- Desktop: 3-column shell matching the mockups ----------
	const showSidebar = !!module;

	return (
		<PlaygroundProvider value={contextValue}>
			<div className="relative h-screen bg-slate-100/70">
				<ResizablePanelGroup direction="horizontal" className="h-full">
					{showSidebar && (
						<>
							<ResizablePanel
								defaultSize={20}
								minSize={14}
								maxSize={30}
								collapsible
								collapsedSize={0}
							>
								<CurriculumSidebar />
							</ResizablePanel>
							<ResizableHandle />
						</>
					)}

					{showSidebar && (
						<>
							<ResizablePanel defaultSize={38} minSize={24}>
								<LessonContentPanel />
							</ResizablePanel>
							<ResizableHandle />
						</>
					)}

					<ResizablePanel defaultSize={showSidebar ? 42 : 100} minSize={28}>
						<div className="flex h-full flex-col bg-slate-100/60 p-3">
							<ResizablePanelGroup direction="vertical">
								<ResizablePanel defaultSize={62} minSize={25}>
									<CodePanel editorOnly />
								</ResizablePanel>
								<ResizableHandle />
								<ResizablePanel
									defaultSize={38}
									minSize={15}
									collapsible
									collapsedSize={0}
								>
									<div className="h-full pt-3">
										<OutputPanel showToolbar={false} />
									</div>
								</ResizablePanel>
							</ResizablePanelGroup>
						</div>
					</ResizablePanel>
				</ResizablePanelGroup>
			</div>
		</PlaygroundProvider>
	);
}
