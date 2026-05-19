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
import { Drawer, DrawerContent, DrawerTrigger, DrawerTitle, DrawerDescription } from "@/components/ui/drawer";
import { PlaygroundProvider, PlaygroundContextValue } from "./playground-context";

export function Playground(props: PlaygroundProps) {
	const {
		lesson,
		state,
		actions,
		labels,
		theme = "dark",
		lang,
		extensions,
	} = props;
	const isMobile = useIsMobile();
	const [lessonDrawerOpen, setLessonDrawerOpen] = useState(false);
	
	const lessonPanelRef = useRef<ImperativePanelHandle>(null);
	const codePanelRef = useRef<ImperativePanelHandle>(null);
	const bottomPanelRef = useRef<ImperativePanelHandle>(null);

	const [activeMaximizedPanel, setActiveMaximizedPanel] = useState<string | null>(null);

	// Automatically handle panel states from lesson config
	useEffect(() => {
		if (!isMobile) {
			if (lesson.panels?.renderer?.defaultState === "maximized") {
				setActiveMaximizedPanel("renderer");
				lessonPanelRef.current?.collapse();
			} else {
				setActiveMaximizedPanel(null);
				lessonPanelRef.current?.expand();
			}
		}
	}, [isMobile, lesson.id, lesson.panels]);

	// Automatically open lesson drawer on mobile if it's the first step of a lesson
	useEffect(() => {
		if (isMobile && state.currentStepIndex === 0) {
			// Small delay to ensure smooth entry
			const timer = setTimeout(() => setLessonDrawerOpen(true), 500);
			return () => clearTimeout(timer);
		}
	}, [isMobile, lesson.id]); // Only run when lesson changes or on mount

	const currentStep = lesson.steps[state.currentStepIndex];
	const isCurrentStepCompleted = state.completedStepIndices.has(state.currentStepIndex);
	const isLastStep = state.currentStepIndex === lesson.steps.length - 1;
	const nextActionLabel = isLastStep ? labels.nextLesson : labels.next;
	const handleNextAction = isLastStep
		? actions.onNextLesson
		: () => actions.onStepChange(state.currentStepIndex + 1);

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
		isCurrentStepCompleted,
		isLastStep,
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
				<div className="flex max-h-full flex-1 flex-col overflow-hidden bg-background relative">
					<Drawer open={lessonDrawerOpen} onOpenChange={setLessonDrawerOpen}>
						<DrawerTrigger asChild>
							<button className="flex w-full shrink-0 items-center justify-between border-b border-border bg-muted/5 px-4 py-3 text-left hover:bg-muted/10 transition-colors shadow-sm z-10">
								<div className="flex items-center gap-3 min-w-0 flex-1 mr-4">
									<div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 shadow-inner">
										<BookOpen className="h-4.5 w-4.5 text-primary shrink-0" />
									</div>
									<div className="flex flex-col min-w-0">
										<span className="text-[9px] font-black uppercase tracking-widest text-primary/70">{labels.step} {state.currentStepIndex + 1}</span>
										<h1 className="truncate text-sm font-bold text-foreground tracking-tight">
											{currentStep.title[lang] || currentStep.title.sw}
										</h1>
									</div>
								</div>
								<div className="flex items-center gap-3 shrink-0">
									<div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-primary text-primary-foreground text-[10px] font-black uppercase tracking-wider shadow-sm active:scale-95 transition-transform">
										<span>View</span>
										<ChevronDown className="h-3 w-3" />
									</div>
									{isCurrentStepCompleted ? (
										<CheckCircle2 className="h-5 w-5 text-green-500" />
									) : (
										<div className="h-2 w-2 rounded-full bg-muted-foreground/40" />
									)}
								</div>
							</button>
						</DrawerTrigger>
						<DrawerContent className="max-h-[85vh]">
							<DrawerTitle className="sr-only">
								{currentStep.title[lang] || currentStep.title.sw}
							</DrawerTitle>
							<DrawerDescription className="sr-only">
								Lesson instructions for {currentStep.title[lang] || currentStep.title.sw}
							</DrawerDescription>
							<div className="overflow-y-auto px-4 pb-8 pt-2 h-full">
								<LessonPanel
									collapsible={false}
									expanded={true}
								/>
							</div>
						</DrawerContent>
					</Drawer>

					<div className="flex-1 overflow-hidden relative">
						<ResizablePanelGroup direction="vertical">
							<ResizablePanel defaultSize={80} minSize={20}>
								<CodePanel
									onRun={handleRun}
									isMobile
								/>
							</ResizablePanel>
							<ResizableHandle withHandle />
							<ResizablePanel
								ref={bottomPanelRef}
								defaultSize={20}
								minSize={10}
								collapsible
								collapsedSize={0}
							>
								<div className="flex h-full flex-col bg-background">
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
			<div className="h-screen bg-background relative">
				<ResizablePanelGroup direction="horizontal" className="h-full">
					{activeMaximizedPanel !== "renderer" && (
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
					<ResizablePanel defaultSize={50} minSize={25}>
						<CodePanel />
					</ResizablePanel>
				</ResizablePanelGroup>
			</div>
		</PlaygroundProvider>
	);
}
