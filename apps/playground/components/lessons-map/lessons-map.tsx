"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import { Lesson, Language } from "@/types/playground";
import { Dictionary } from "@/app/(main)/[lang]/dictionaries";
import { cn } from "@/lib/utils";
import { 
    Check, 
    Play, 
    Lock,
    BookOpen,
    Trophy,
    ArrowRight
} from "lucide-react";

interface LessonsMapProps {
	lessons: Lesson[];
	lang: Language;
	dict: Dictionary;
}

export function LessonsMap({ lessons, lang, dict }: LessonsMapProps) {
	// Flatten steps to easily calculate global indices and progress
    const allSteps = useMemo(() => {
        return lessons.flatMap((lesson, lessonIdx) => 
            lesson.steps.map((step, stepIdx) => ({
                ...step,
                lessonId: lesson.id,
                lessonTitle: lesson.title[lang] || lesson.title.sw,
                lessonIdx,
                stepIdx
            }))
        ).map((step, i) => ({ ...step, globalIndex: i }));
    }, [lessons, lang]);

    const totalSteps = allSteps.length;
    // Mock progress: First 3 steps completed, 4th active
    const completedStepsCount = 3; 
    const currentActiveGlobalIndex = completedStepsCount;

    const progressPercentage = totalSteps > 0 
        ? Math.round((completedStepsCount / totalSteps) * 100) 
        : 0;

	return (
		<div className="flex flex-col gap-10 w-full max-w-3xl mx-auto pb-24 px-4 sm:px-0">
            
            {/* Global Progress Header */}
            <div className="flex flex-col gap-4 rounded-3xl bg-card border border-border p-6 sm:p-8 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-muted">
                    <div 
                        className="h-full bg-primary transition-all duration-1000 ease-out" 
                        style={{ width: `${progressPercentage}%` }} 
                    />
                </div>
                
                <div className="flex items-center justify-between gap-4 relative z-10">
                    <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-full bg-primary/10 text-primary shrink-0">
                            <Trophy className="h-6 w-6 sm:h-7 sm:w-7" />
                        </div>
                        <div>
                            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
                                {dict.map.journey}
                            </h2>
                            <p className="text-sm font-medium text-muted-foreground mt-0.5">
                                {completedStepsCount} / {totalSteps} {dict.lessonPanel.step.toLowerCase()}s
                            </p>
                        </div>
                    </div>
                    <div className="hidden sm:flex flex-col items-end">
                        <span className="text-3xl font-black text-primary tracking-tighter">
                            {progressPercentage}%
                        </span>
                    </div>
                </div>
            </div>

			<div className="flex flex-col gap-12">
                {lessons.map((lesson, lessonIdx) => {
                    const lessonTitle = lesson.title[lang] || lesson.title.sw;
                    const difficultyKey = lesson.difficulty || "wa kati"; 
                    const difficultyLabel = dict.difficulty[difficultyKey as keyof typeof dict.difficulty] || difficultyKey;

                    // Calculate progress for this specific lesson
                    const lessonStartGlobalIndex = allSteps.find(s => s.lessonId === lesson.id)?.globalIndex || 0;
                    const lessonCompletedCount = lesson.steps.filter((_, i) => (lessonStartGlobalIndex + i) < completedStepsCount).length;
                    const isLessonFullyCompleted = lessonCompletedCount === lesson.steps.length;

                    return (
                        <section 
                            key={lesson.id} 
                            className="flex flex-col gap-6"
                        >
                            {/* Lesson Header */}
                            <div className="flex items-start gap-4 sticky top-14 z-20 bg-background/90 backdrop-blur-xl py-4 -mx-4 px-4 sm:mx-0 sm:px-0">
                                <div className={cn(
                                    "flex h-10 w-10 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-2xl border-2 transition-colors",
                                    isLessonFullyCompleted ? "bg-green-500/10 border-green-500/30 text-green-600" :
                                    "bg-card border-border text-primary"
                                )}>
                                    <BookOpen className="h-5 w-5 sm:h-6 sm:w-6" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 sm:gap-3 mb-1.5 flex-wrap">
                                        <span className="font-mono text-[10px] sm:text-xs font-bold text-muted-foreground uppercase tracking-widest">
                                            {dict.lessonPanel.lessons} {lessonIdx + 1}
                                        </span>
                                        <span className="h-1 w-1 rounded-full bg-border" />
                                        <span className={cn(
                                            "inline-flex items-center rounded-md px-1.5 py-0.5 text-[9px] sm:text-[10px] font-bold uppercase tracking-wider",
                                            difficultyKey === "mwanzilishi" ? "bg-green-500/10 text-green-600 dark:text-green-400" :
                                            difficultyKey === "wa kati" ? "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400" :
                                            "bg-red-500/10 text-red-600 dark:text-red-400"
                                        )}>
                                            {difficultyLabel}
                                        </span>
                                    </div>
                                    <h2 className="text-xl sm:text-2xl font-bold text-foreground leading-tight truncate">
                                        {lessonTitle}
                                    </h2>
                                </div>
                                <div className="hidden sm:flex flex-col items-end text-sm font-mono font-medium text-muted-foreground shrink-0 mt-1">
                                    <span>{lessonCompletedCount}/{lesson.steps.length}</span>
                                </div>
                            </div>

                            {/* Lesson Steps Timeline */}
                            <div className="relative pl-5 sm:pl-6 ml-5 sm:ml-6 flex flex-col gap-2">
                                {/* The Continuous Vertical Thread */}
                                <div className="absolute left-[19px] sm:left-[23px] top-6 bottom-6 w-0.5 bg-border -translate-x-1/2 rounded-full" />

                                {lesson.steps.map((step, stepIdx) => {
                                    const globalIndex = lessonStartGlobalIndex + stepIdx;
                                    const isCompleted = globalIndex < currentActiveGlobalIndex;
                                    const isActive = globalIndex === currentActiveGlobalIndex;
                                    const isLocked = globalIndex > currentActiveGlobalIndex;

                                    const stepTitle = step.title[lang] || step.title.sw;
                                    const href = lesson.id === "misingi-ya-nuru" 
                                        ? `/${lang}/anza?step=${step.id}` 
                                        : `/${lang}/anza/${lesson.id}?step=${step.id}`;

                                    return (
                                        <Link
                                            key={step.id}
                                            href={isLocked ? "#" : href}
                                            className={cn(
                                                "group relative flex items-center gap-4 sm:gap-6 p-4 rounded-2xl transition-all duration-300",
                                                isActive ? "bg-primary/5 border border-primary/20 shadow-sm" :
                                                isLocked ? "cursor-not-allowed hover:bg-muted/30" : 
                                                "hover:bg-muted/50 cursor-pointer border border-transparent hover:border-border"
                                            )}
                                            aria-disabled={isLocked}
                                        >
                                            {/* Thread Overlay for completed path */}
                                            {isCompleted && stepIdx !== lesson.steps.length - 1 && (
                                                <div className="absolute left-0 top-[2.5rem] bottom-[-1.5rem] w-0.5 bg-primary -translate-x-1/2 z-0" />
                                            )}
                                            {isActive && stepIdx !== lesson.steps.length - 1 && (
                                                <div className="absolute left-0 top-[2.5rem] bottom-[-1.5rem] w-0.5 bg-gradient-to-b from-primary to-transparent -translate-x-1/2 z-0" />
                                            )}

                                            {/* Timeline Node */}
                                            <div className="relative z-10 flex shrink-0 items-center justify-center -ml-4 sm:-ml-6 w-8 h-8 sm:w-10 sm:h-10">
                                                <div className={cn(
                                                    "absolute inset-0 rounded-full transition-all duration-300",
                                                    isActive ? "bg-primary/20 scale-150 animate-pulse" :
                                                    isCompleted ? "bg-primary/10 scale-110" :
                                                    "bg-background"
                                                )} />
                                                <div className={cn(
                                                    "relative flex h-6 w-6 sm:h-8 sm:w-8 items-center justify-center rounded-full border-2 transition-all duration-300 shadow-sm",
                                                    isActive ? "border-primary bg-primary text-primary-foreground shadow-[0_0_15px_rgba(0,180,216,0.5)] scale-110" :
                                                    isCompleted ? "border-primary bg-background text-primary" :
                                                    "border-muted-foreground/30 bg-background text-muted-foreground/50 group-hover:border-primary/50 group-hover:text-primary"
                                                )}>
                                                    {isActive ? (
                                                        <Play className="h-3 w-3 sm:h-4 sm:w-4 fill-current ml-0.5" />
                                                    ) : isCompleted ? (
                                                        <Check className="h-3.5 w-3.5 sm:h-4 sm:w-4 stroke-[3]" />
                                                    ) : (
                                                        <Lock className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                                                    )}
                                                </div>
                                            </div>

                                            {/* Step Content */}
                                            <div className="flex min-w-0 flex-1 flex-col py-1">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className={cn(
                                                        "font-mono text-[10px] sm:text-xs font-bold transition-colors",
                                                        isActive ? "text-primary" : "text-muted-foreground"
                                                    )}>
                                                        {lessonIdx + 1}.{stepIdx + 1}
                                                    </span>
                                                    {isActive && (
                                                        <span className="inline-flex rounded-full bg-primary px-2 py-0.5 text-[8px] sm:text-[9px] font-black uppercase text-primary-foreground tracking-widest animate-in fade-in zoom-in">
                                                            Sasa
                                                        </span>
                                                    )}
                                                </div>
                                                <h3 className={cn(
                                                    "truncate text-sm sm:text-base font-semibold transition-colors duration-300",
                                                    isActive ? "text-foreground" :
                                                    isLocked ? "text-muted-foreground" :
                                                    "text-foreground group-hover:text-primary"
                                                )}>
                                                    {stepTitle}
                                                </h3>
                                            </div>

                                            {/* Action Arrow */}
                                            <div className="flex shrink-0 items-center justify-center transition-transform duration-300 group-hover:translate-x-1.5">
                                                {!isLocked && (
                                                    <div className={cn(
                                                        "flex h-8 w-8 items-center justify-center rounded-full transition-colors",
                                                        isActive ? "bg-primary/10 text-primary" : "text-muted-foreground opacity-0 group-hover:opacity-100 group-hover:bg-muted"
                                                    )}>
                                                        <ArrowRight className="h-4 w-4" />
                                                    </div>
                                                )}
                                            </div>
                                        </Link>
                                    );
                                })}
                            </div>
                        </section>
                    );
                })}
            </div>
		</div>
	);
}
