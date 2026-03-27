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
    ArrowRight,
    Zap
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

    const activeStep = allSteps[currentActiveGlobalIndex] || allSteps[allSteps.length - 1];

	return (
		<div className="flex flex-col gap-10 w-full max-w-3xl mx-auto pb-24 px-4 sm:px-0">
            
            {/* Global Progress Header */}
            <div className="flex flex-col gap-6 rounded-3xl bg-card border border-border p-6 sm:p-8 shadow-sm relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-full h-1.5 bg-muted">
                    <div 
                        className="h-full bg-primary relative transition-all duration-1000 ease-out"
                        style={{ width: `${progressPercentage}%` }}
                    >
                        <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-r from-transparent to-white/10" />
                    </div>
                </div>
                
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 relative z-10">
                    <div className="flex items-center gap-5">
                        <div className="relative">
                            <div className="flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-2xl bg-primary text-primary-foreground relative z-10 transform -rotate-3 group-hover:rotate-0 transition-transform duration-300">
                                <Trophy className="h-7 w-7 sm:h-8 sm:w-8" />
                            </div>
                        </div>
                        <div>
                            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground">
                                {dict.map.journey}
                            </h2>
                            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground mt-1">
                                <span className="flex h-2 w-2 rounded-full bg-primary" />
                                {completedStepsCount} / {totalSteps} {dict.map.completedCount}
                            </div>
                        </div>
                    </div>
                    <div className="flex items-baseline gap-1">
                        <span className="text-4xl sm:text-5xl font-black text-primary tracking-tighter">
                            {progressPercentage}
                        </span>
                        <span className="text-xl font-bold text-primary/50">%</span>
                    </div>
                </div>

                {/* Recommended Next Step Card */}
                {activeStep && (
                    <Link 
                        href={activeStep.lessonId === "misingi-ya-nuru" 
                            ? `/${lang}/anza?step=${activeStep.id}` 
                            : `/${lang}/anza/${activeStep.lessonId}?step=${activeStep.id}`}
                        className="flex items-center justify-between gap-4 rounded-2xl bg-primary/[0.03] border border-primary/10 p-4 hover:bg-primary/5 transition-colors group/rec"
                    >
                        <div className="flex items-center gap-4">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                                <Zap className="h-5 w-5 fill-current" />
                            </div>
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-widest text-primary/70 mb-0.5">
                                    {dict.map.recommended}
                                </p>
                                <h3 className="text-sm font-bold text-foreground group-hover/rec:text-primary transition-colors">
                                    {activeStep.lessonTitle}: {activeStep.title[lang] || activeStep.title.sw}
                                </h3>
                            </div>
                        </div>
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground transform group-hover/rec:translate-x-1 transition-transform">
                            <ArrowRight className="h-4 w-4" />
                        </div>
                    </Link>
                )}
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
                            <div className="flex items-end gap-4 sticky top-[4.5rem] z-20 bg-background/90 backdrop-blur-xl py-4 -mx-4 px-4 sm:mx-0 sm:px-0">
                                <div className={cn(
                                    "flex h-12 w-12 sm:h-14 sm:w-14 shrink-0 items-center justify-center rounded-2xl border-2 transition-all duration-300",
                                    isLessonFullyCompleted ? "bg-green-500/10 border-green-500/30 text-green-600 rotate-3" :
                                    "bg-card border-border text-primary -rotate-3"
                                )}>
                                    <BookOpen className="h-6 w-6 sm:h-7 sm:w-7" />
                                </div>
                                <div className="flex-1 min-w-0 pb-1">
                                    <div className="flex items-center gap-2 sm:gap-3 mb-1.5 flex-wrap">
                                        <span className="font-mono text-[10px] sm:text-xs font-black text-muted-foreground/60 uppercase tracking-widest">
                                            {dict.lessonPanel.lessons} {lessonIdx + 1}
                                        </span>
                                        <span className="h-1 w-1 rounded-full bg-border" />
                                        <span className={cn(
                                            "inline-flex items-center rounded-md px-2 py-0.5 text-[9px] sm:text-[10px] font-black uppercase tracking-wider",
                                            difficultyKey === "mwanzilishi" ? "bg-green-500/10 text-green-600 dark:text-green-400" :
                                            difficultyKey === "wa kati" ? "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400" :
                                            "bg-red-500/10 text-red-600 dark:text-red-400"
                                        )}>
                                            {difficultyLabel}
                                        </span>
                                    </div>
                                    <h2 className="text-2xl sm:text-3xl font-black text-foreground leading-tight truncate tracking-tight">
                                        {lessonTitle}
                                    </h2>
                                </div>
                                <div className="hidden sm:flex flex-col items-end gap-1 shrink-0 mb-1">
                                    <div className="flex h-1.5 w-24 bg-muted rounded-full overflow-hidden">
                                        <div 
                                            className="h-full bg-primary transition-all duration-1000 ease-out" 
                                            style={{ width: `${(lessonCompletedCount / lesson.steps.length) * 100}%` }} 
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Lesson Steps Timeline */}
                            <div className="relative pl-5 sm:pl-6 ml-6 sm:ml-7 flex flex-col gap-3">
                                {/* The Continuous Vertical Thread */}
                                <div className="absolute left-[-1px] top-6 bottom-6 w-0.5 bg-border rounded-full" />

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
                                        <div key={step.id}>
                                            <Link
                                                href={isLocked ? "#" : href}
                                                className={cn(
                                                    "group relative flex items-center gap-4 sm:gap-6 p-4 rounded-2xl transition-all duration-300 border-2",
                                                    isActive ? "bg-primary/[0.03] border-primary/20 shadow-sm" :
                                                    isLocked ? "cursor-not-allowed opacity-60 border-transparent grayscale hover:grayscale-0 transition-all duration-500" : 
                                                    "hover:bg-muted/50 cursor-pointer border-transparent hover:border-border"
                                                )}
                                                aria-disabled={isLocked}
                                            >
                                                {/* Thread Overlay for completed path */}
                                                {isCompleted && (
                                                    <div className="absolute left-[-26px] sm:left-[-30px] top-0 bottom-0 w-0.5 bg-primary z-0" />
                                                )}
                                                {isActive && (
                                                    <div className="absolute left-[-26px] sm:left-[-30px] top-0 h-1/2 w-0.5 bg-primary z-0" />
                                                )}

                                                {/* Timeline Node */}
                                                <div className="relative z-10 flex shrink-0 items-center justify-center -ml-11 sm:-ml-13 w-10 h-10 sm:w-12 sm:h-12">
                                                    <div className={cn(
                                                        "absolute inset-0 rounded-full transition-all duration-300",
                                                        isActive ? "bg-primary/20 scale-125" :
                                                        isCompleted ? "bg-primary/10" :
                                                        "bg-background"
                                                    )} />
                                                    <div className={cn(
                                                        "relative flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full border-2 transition-all duration-300 shadow-sm",
                                                        isActive ? "border-primary bg-primary text-primary-foreground scale-110" :
                                                        isCompleted ? "border-primary bg-background text-primary" :
                                                        "border-muted-foreground/30 bg-background text-muted-foreground/50 group-hover:border-primary/50 group-hover:text-primary"
                                                    )}>
                                                        {isActive ? (
                                                            <Play className="h-4 w-4 sm:h-4.5 sm:w-4.5 fill-current ml-0.5" />
                                                        ) : isCompleted ? (
                                                            <Check className="h-4 w-4 sm:h-4.5 sm:w-4.5 stroke-[3]" />
                                                        ) : (
                                                            <Lock className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Step Content */}
                                                <div className="flex min-w-0 flex-1 flex-col py-1">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <span className={cn(
                                                            "font-mono text-[10px] sm:text-xs font-black transition-colors",
                                                            isActive ? "text-primary" : "text-muted-foreground/60"
                                                        )}>
                                                            {String(lessonIdx + 1).padStart(2, '0')}.{String(stepIdx + 1).padStart(2, '0')}
                                                        </span>
                                                        {isActive && (
                                                            <span className="inline-flex rounded-full bg-primary px-2 py-0.5 text-[8px] sm:text-[9px] font-black uppercase text-primary-foreground tracking-widest">
                                                                Sasa
                                                            </span>
                                                        )}
                                                    </div>
                                                    <h3 className={cn(
                                                        "truncate text-sm sm:text-base font-bold transition-colors duration-300",
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
                                                            "flex h-8 w-8 items-center justify-center rounded-full transition-all duration-300",
                                                            isActive ? "bg-primary text-primary-foreground" : "text-muted-foreground bg-muted group-hover:bg-primary/10 group-hover:text-primary"
                                                        )}>
                                                            <ArrowRight className="h-4 w-4" />
                                                        </div>
                                                    )}
                                                </div>
                                            </Link>
                                        </div>
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
