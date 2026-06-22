"use client";

import { useRef, useState, useEffect } from "react";
import type { ImperativePanelHandle } from "react-resizable-panels";
import { LessonPanel } from "./lesson-panel";
import { CodePanel } from "./code-panel";
import { OutputPanel } from "./output-panel";
import {
	ResizableHandle,
	ResizablePanel,
	ResizablePanelGroup,
} from "@/components/playground/resizable";
import { useIsMobile } from "@/hooks/use-mobile";
import { PlaygroundProps } from "@/types/playground";
import { CheckCircle2, BookOpen, Terminal, ChevronDown } from "lucide-react";
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
	const {
		module,
		state,
		actions,
		labels,
		theme = "dark",
		lang,
		extensions,
	} = props;
	const isMobile = useIsMobile();
	const [moduleDrawerOpen, setModuleDrawerOpen] = useState(false);

	const lessonPanelRef = useRef<ImperativePanelHandle>(null);
	const codePanelRef = useRef<ImperativePanelHandle>(null);
	const bottomPanelRef = useRef<ImperativePanelHandle>(null);

	const [activeMaximizedPanel, setActiveMaximizedPanel] = useState<
		string | null
	>(null);

	// Automatically handle panel states from module config
	useEffect(() => {
		if (!isMobile) {
			if (module?.panels?.renderer?.defaultState === "maximized") {
				setActiveMaximizedPanel("renderer");
				lessonPanelRef.current?.collapse();
			} else {
				setActiveMaximizedPanel(null);
				lessonPanelRef.current?.expand();
			}
		}
	}, [isMobile, module?.id, module?.panels]);

	// Automatically open module drawer on mobile if it's the first lesson of a module
	useEffect(() => {
		if (isMobile && module && state.currentLessonIndex === 0) {
			// Small delay to ensure smooth entry
			const timer = setTimeout(() => setModuleDrawerOpen(true), 500);
			return () => clearTimeout(timer);
		}
	}, [isMobile, module?.id, state.currentLessonIndex]); // Only run when module changes or on mount

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

	const maximizePanel = (panelId: string) => {
		setActiveMaximizedPanel(panelId);
		if (panelId === "renderer") {
			lessonPanelRef.current?.collapse();
		}
	};

	const restorePanels = () => {
		setActiveMaximizedPanel(null);
		lessonPanelRef.current?.expand();
	};

	const togglePanel = (panelId: string) => {
		if (panelId === "lesson") {
			if (lessonPanelRef.current?.isCollapsed()) {
				lessonPanelRef.current?.expand();
			} else {
				lessonPanelRef.current?.collapse();
			}
		}
	};

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

	if (isMobile) {
		return (
			<PlaygroundProvider value={contextValue}>
				<div className="bg-background relative flex max-h-full flex-1 flex-col overflow-hidden">
					<Drawer open={moduleDrawerOpen} onOpenChange={setModuleDrawerOpen}>
						<DrawerTrigger asChild>
							<button className="border-border bg-muted/5 hover:bg-muted/10 z-10 flex w-full shrink-0 items-center justify-between border-b px-4 py-3 text-left shadow-sm transition-colors">
								<div className="mr-4 flex min-w-0 flex-1 items-center gap-3">
									<div className="bg-primary/10 flex h-9 w-9 items-center justify-center rounded-lg shadow-inner">
										<BookOpen className="text-primary h-4.5 w-4.5 shrink-0" />
									</div>
									<div className="flex min-w-0 flex-col">
										<span className="text-primary/70 text-[9px] font-black tracking-widest uppercase">
											{labels.lesson} {(state.currentLessonIndex ?? 0) + 1}
										</span>
										<h1 className="text-foreground truncate text-sm font-bold tracking-tight">
											{currentLesson?.title[lang] || currentLesson?.title.sw}
										</h1>
									</div>
								</div>
								<div className="flex shrink-0 items-center gap-3">
									<div className="bg-primary text-primary-foreground flex items-center gap-1.5 rounded-full px-2.5 py-1.5 text-[10px] font-black tracking-wider uppercase shadow-sm transition-transform active:scale-95">
										<span>Lesson</span>
										<ChevronDown className="h-3 w-3" />
									</div>
									{isCurrentLessonCompleted ? (
										<CheckCircle2 className="h-5 w-5 text-green-500" />
									) : (
										<div className="bg-muted-foreground/40 h-2 w-2 rounded-full" />
									)}
								</div>
							</button>
						</DrawerTrigger>
						<DrawerContent className="max-h-[85vh]">
							<DrawerTitle className="sr-only">
								{currentLesson?.title[lang] || currentLesson?.title.sw}
							</DrawerTitle>
							<DrawerDescription className="sr-only">
								Lesson instructions for{" "}
								{currentLesson?.title[lang] || currentLesson?.title.sw}
							</DrawerDescription>
							<div className="h-full overflow-y-auto px-4 pt-2 pb-8">
								<LessonPanel collapsible={false} expanded={true} />
							</div>
						</DrawerContent>
					</Drawer>

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
								<div className="bg-background flex h-full flex-col">
									<div className="flex-1 overflow-hidden">
										<OutputPanel showToolbar={false} />
									</div>
								</div>
							</ResizablePanel>
						</ResizablePanelGroup>
					</div>
				</div>
			</PlaygroundProvider>
		);
	}

	return (
		<PlaygroundProvider value={contextValue}>
			<div className="bg-background relative h-screen">
				<ResizablePanelGroup direction="horizontal" className="h-full">
					{module && activeMaximizedPanel !== "renderer" && (
						<>
							<ResizablePanel
								ref={lessonPanelRef}
								defaultSize={50}
								minSize={20}
								collapsible
								collapsedSize={0}
								onCollapse={() => {
									// Optional: handle state if needed when user manually collapses
								}}
							>
								<LessonPanel />
							</ResizablePanel>
							<ResizableHandle withHandle />
						</>
					)}
					<ResizablePanel defaultSize={module ? 50 : 100} minSize={25}>
						<CodePanel />
					</ResizablePanel>
				</ResizablePanelGroup>
			</div>
		</PlaygroundProvider>
	);
}
