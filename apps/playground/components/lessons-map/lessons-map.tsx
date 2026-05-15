"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import { Module, Lesson, Language } from "@/types/playground";
import { Dictionary } from "@/app/(main)/[lang]/dictionaries";
import { cn } from "@nuru/ui";
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
	modules: Module[];
	lang: Language;
	dict: Dictionary;
}

export function LessonsMap({ modules, lang, dict }: LessonsMapProps) {
	// Flatten lessons to easily calculate global indices and progress
    const allLessons = useMemo(() => {
        return modules.flatMap((module, moduleIdx) => 
            module.lessons.map((lesson, lessonIdx) => ({
                ...lesson,
                moduleId: module.id,
                moduleTitle: module.title[lang] || module.title.sw,
                moduleIdx,
                lessonIdx
            }))
        ).map((lesson, i) => ({ ...lesson, globalIndex: i }));
    }, [modules, lang]);

    const totalLessons = allLessons.length;
    // Mock progress: First 3 lessons completed, 4th active
    const completedLessonsCount = 3; 
    const currentActiveGlobalIndex = completedLessonsCount;

    const progressPercentage = totalLessons > 0 
        ? Math.round((completedLessonsCount / totalLessons) * 100) 
        : 0;

    const activeLesson = allLessons[currentActiveGlobalIndex] || allLessons[allLessons.length - 1];

	return (
		<div className="flex flex-col gap-10 w-full max-w-3xl mx-auto pb-24 px-4 sm:px-0">
            
            {/* Global Progress Header */}
            <div className="flex flex-col gap-6 rounded-3xl bg-card border border-border p-6 sm:p-8 shadow-sm relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-full h-1.5 bg-muted">
                    <div 
                        className="h-full bg-primary relative transition-all duration-1000 ease-out"
                        style={{ width: `${progressPercentage}%` }}
                    />
                </div>
                
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 relative z-10">
                    <div className="flex items-center gap-5">
                        <div className="flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-2xl bg-muted text-foreground relative z-10">
                            <Trophy className="h-6 w-6 sm:h-7 sm:w-7 opacity-80" />
                        </div>
                        <div>
                            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
                                {dict.map.journey}
                            </h2>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground mt-0.5">
                                {completedLessonsCount} / {totalLessons} {dict.map.completedCount}
                            </div>
                        </div>
                    </div>
                    <div className="flex items-baseline gap-1">
                        <span className="text-3xl sm:text-4xl font-black text-foreground tracking-tighter">
                            {progressPercentage}
                        </span>
                        <span className="text-lg font-bold text-muted-foreground">%</span>
                    </div>
                </div>

                {/* Recommended Next Lesson Card */}
                {activeLesson && (
                    <Link 
                        href={`/${lang}/anza/${activeLesson.moduleId}/${activeLesson.id}`}
                        className="flex items-center justify-between gap-4 rounded-2xl bg-card border border-primary/20 p-4 sm:p-5 hover:border-primary/40 hover:bg-primary/5 transition-all shadow-sm group/rec"
                    >
                        <div className="flex items-center gap-4">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                                <Zap className="h-5 w-5 fill-current" />
                            </div>
                            <div>
                                <p className="text-[10px] font-bold uppercase tracking-widest text-primary mb-0.5">
                                    {dict.map.continue}
                                </p>
                                <h3 className="text-sm sm:text-base font-bold text-foreground">
                                    {activeLesson.moduleTitle}: {activeLesson.title[lang] || activeLesson.title.sw}
                                </h3>
                            </div>
                        </div>
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary group-hover/rec:bg-primary group-hover/rec:text-primary-foreground transition-colors">
                            <ArrowRight className="h-4 w-4" />
                        </div>
                    </Link>
                )}
            </div>

			<div className="flex flex-col gap-10">
                {modules.map((module, moduleIdx) => {
                    const moduleTitle = module.title[lang] || module.title.sw;
                    const difficultyKey = module.difficulty || "wa kati"; 
                    const difficultyLabel = dict.difficulty[difficultyKey as keyof typeof dict.difficulty] || difficultyKey;

                    const moduleStartGlobalIndex = allLessons.find(s => s.moduleId === module.id)?.globalIndex || 0;
                    const moduleCompletedCount = module.lessons.filter((_, i) => (moduleStartGlobalIndex + i) < completedLessonsCount).length;

                    return (
                        <section 
                            key={module.id} 
                            className="flex flex-col gap-4"
                        >
                            {/* Module Header - Muted & Structured */}
                            <div className="flex items-center justify-between gap-4 sticky top-[4rem] z-20 bg-background/95 backdrop-blur-md py-4 border-b border-border/50">
                                <div className="flex items-center gap-4 flex-1 min-w-0">
                                    <div className="flex h-10 w-10 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-xl bg-muted text-foreground/70">
                                        <BookOpen className="h-5 w-5 sm:h-6 sm:w-6" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="font-mono text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                                                {dict.lessonPanel.lessons} {moduleIdx + 1}
                                            </span>
                                            <span className="h-1 w-1 rounded-full bg-border" />
                                            <span className="text-[10px] font-medium text-muted-foreground capitalize">
                                                {difficultyLabel}
                                            </span>
                                        </div>
                                        <h2 className="text-xl sm:text-2xl font-bold text-foreground leading-tight truncate">
                                            {moduleTitle}
                                        </h2>
                                    </div>
                                </div>
                                <div className="hidden sm:flex flex-col items-end gap-1.5 shrink-0">
                                     <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                                        {moduleCompletedCount} / {module.lessons.length}
                                    </span>
                                    <div className="flex h-1 w-16 bg-muted rounded-full overflow-hidden">
                                        <div 
                                            className="h-full bg-foreground/30 transition-all duration-1000 ease-out" 
                                            style={{ width: `${(moduleCompletedCount / module.lessons.length) * 100}%` }} 
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Module Lessons Timeline - Clean & Focused */}
                            <div className="relative pl-4 sm:pl-5 ml-5 sm:ml-6 flex flex-col gap-2 pb-4">
                                {/* Single subtle thread line */}
                                <div className="absolute left-[-1px] top-6 bottom-6 w-px bg-border" />

                                {module.lessons.map((lesson, lessonIdx) => {
                                    const globalIndex = moduleStartGlobalIndex + lessonIdx;
                                    const isCompleted = globalIndex < currentActiveGlobalIndex;
                                    const isActive = globalIndex === currentActiveGlobalIndex;
                                    const isLocked = globalIndex > currentActiveGlobalIndex;

                                    const lessonTitle = lesson.title[lang] || lesson.title.sw;
                                    const href = `/${lang}/anza/${module.id}/${lesson.id}`;

                                    return (
                                        <div key={lesson.id} className="relative">
                                            <Link
                                                href={isLocked ? "#" : href}
                                                className={cn(
                                                    "group relative flex items-center gap-4 sm:gap-5 p-3 sm:p-4 rounded-xl transition-all duration-200",
                                                    isActive ? "bg-card border border-primary/20 shadow-sm" :
                                                    isLocked ? "cursor-not-allowed opacity-50 border border-transparent" : 
                                                    "hover:bg-muted/30 cursor-pointer border border-transparent"
                                                )}
                                                aria-disabled={isLocked}
                                            >
                                                {/* Timeline Node */}
                                                <div className="relative z-10 flex shrink-0 items-center justify-center -ml-8 sm:-ml-10 w-8 h-8 sm:w-10 sm:h-10">
                                                    <div className={cn(
                                                        "relative flex h-6 w-6 sm:h-7 sm:w-7 items-center justify-center rounded-full transition-all duration-200",
                                                        isActive ? "bg-primary text-primary-foreground shadow-sm scale-110" :
                                                        isCompleted ? "bg-muted text-muted-foreground" :
                                                        "bg-background border border-border text-muted-foreground/40"
                                                    )}>
                                                        {isActive ? (
                                                            <Play className="h-3 w-3 sm:h-3.5 sm:w-3.5 fill-current ml-0.5" />
                                                        ) : isCompleted ? (
                                                            <Check className="h-3.5 w-3.5 sm:h-4 sm:w-4 stroke-[3]" />
                                                        ) : (
                                                            <Lock className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Lesson Content */}
                                                <div className="flex min-w-0 flex-1 flex-col">
                                                    <div className="flex items-center gap-2 mb-0.5">
                                                        <span className={cn(
                                                            "font-mono text-[10px] font-bold uppercase",
                                                            isActive ? "text-primary" : "text-muted-foreground"
                                                        )}>
                                                            {String(moduleIdx + 1).padStart(2, '0')}.{String(lessonIdx + 1).padStart(2, '0')}
                                                        </span>
                                                        {isActive && (
                                                            <span className="inline-flex rounded-full bg-primary/10 px-1.5 py-0.5 text-[8px] font-bold uppercase text-primary tracking-wider">
                                                                Sasa
                                                            </span>
                                                        )}
                                                    </div>
                                                    <h3 className={cn(
                                                        "truncate text-sm sm:text-base font-semibold transition-colors duration-200",
                                                        isActive ? "text-foreground" :
                                                        isLocked ? "text-muted-foreground" :
                                                        "text-foreground group-hover:text-foreground/80"
                                                    )}>
                                                        {lessonTitle}
                                                    </h3>
                                                </div>

                                                {/* Action Arrow */}
                                                <div className="flex shrink-0 items-center justify-center">
                                                    {!isLocked && (
                                                        <ArrowRight className={cn(
                                                            "h-4 w-4 transition-transform duration-200 group-hover:translate-x-1",
                                                            isActive ? "text-primary" : "text-muted-foreground opacity-0 group-hover:opacity-100"
                                                        )} />
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
