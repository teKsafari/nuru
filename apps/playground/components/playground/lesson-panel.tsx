"use client"

import { ChevronDown, Languages, ChevronLeft, ChevronRight, Lightbulb, CheckCircle2, ArrowRight } from "lucide-react"
import { ScrollArea } from "@/components/playground/scroll-area"
import { Lesson, Language } from "@/types/playground"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import Markdown from "react-markdown"
import { CodeEditor } from "./code-editor"
import { Breadcrumbs } from "./breadcrumbs"

interface LessonPanelProps {
  lesson: Lesson
  currentStepIndex: number
  onStepChange: (index: number) => void
  lang: Language
  onLangChange: (lang: Language) => void
  collapsible?: boolean
  expanded?: boolean
  onToggle?: () => void
  hideNavigation?: boolean
  isCompleted?: boolean
  completedStepIndices?: Set<number>
  onNextLesson?: () => void
}

export function LessonPanel({ 
  lesson, 
  currentStepIndex, 
  onStepChange, 
  lang, 
  onLangChange, 
  collapsible, 
  expanded, 
  onToggle,
  hideNavigation,
  isCompleted,
  completedStepIndices = new Set(),
  onNextLesson
}: LessonPanelProps) {
  const step = lesson.steps[currentStepIndex];
  const isLastStep = currentStepIndex === lesson.steps.length - 1;

  const breadcrumbs = (
    <Breadcrumbs 
      items={[
        { label: lang === "sw" ? "Mafunzo" : "Lessons", href: "/anza" },
        { label: lesson.title[lang], href: `/anza/${lesson.id}` },
        { label: `${lang === "sw" ? "Hatua" : "Step"} ${currentStepIndex + 1}`, current: true }
      ]}
      className={collapsible ? "mb-2" : "mb-6"}
    />
  );

  const header = (
    <div className="flex items-start justify-between mb-6 gap-4">
      <div className="flex flex-col gap-1 min-w-0 flex-1">
        <h1 className="text-2xl lg:text-3xl font-bold text-foreground leading-tight">
          {step.title[lang]}
        </h1>
      </div>
      <div className="flex flex-row md:flex-col items-center md:items-end gap-2 shrink-0">
        {!hideNavigation && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => onLangChange(lang === "sw" ? "en" : "sw")}
            className="h-8 px-2 text-xs border border-border/50 bg-background/50"
          >
            <Languages className="mr-2 h-4 w-4" />
            {lang === "sw" ? "English" : "Kiswahili"}
          </Button>
        )}
        {/* Status Indicator (Persistent to avoid layout shifts) */}
        <div className={cn(
          "flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all duration-500",
          isCompleted 
            ? "bg-green-500/10 text-green-500 border border-green-500/20 shadow-xs" 
            : "bg-muted/50 text-muted-foreground border border-transparent"
        )}>
          {isCompleted ? (
            <>
              <CheckCircle2 className="h-3 w-3" />
              {lang === "sw" ? "Imekamilika" : "Completed"}
            </>
          ) : (
            <>
              <div className="h-1.5 w-1.5 rounded-full bg-muted-foreground/40 animate-pulse" />
              {lang === "sw" ? "Inasubiri" : "Incomplete"}
            </>
          )}
        </div>
      </div>
    </div>
  );

  const navigation = !hideNavigation && (
    <div className="mt-8 flex items-center gap-4 pt-4 border-t border-border @container">
      <Button
        variant="outline"
        size="sm"
        disabled={currentStepIndex === 0}
        onClick={() => onStepChange(currentStepIndex - 1)}
        className="h-8 text-xs"
      >
        <ChevronLeft className="mr-1 h-3 w-3" />
        {lang === "sw" ? "Nyuma" : "Back"}
      </Button>
      
      <div className="flex flex-col items-center gap-1 mx-auto">
        <div className="text-[10px] text-muted-foreground font-mono uppercase tracking-wider">
          {lang === "sw" ? "Hatua" : "Step"} {currentStepIndex + 1} / {lesson.steps.length}
        </div>
        <div className="hidden @md:flex">
          {lesson.steps.map((_, i) => (
            <button 
              key={i} 
              onClick={() => onStepChange(i)}
              className={cn(
                "h-1 w-4 rounded-full transition-all hover:scale-x-110",
                completedStepIndices.has(i) 
                  ? "bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.4)]" 
                  : i === currentStepIndex 
                    ? "bg-primary" 
                    : i < currentStepIndex 
                      ? "bg-primary/40" 
                      : "bg-muted"
              )}
            />
          ))}
        </div>
      </div>

      {isLastStep && isCompleted && onNextLesson ? (
        <Button
          variant="default"
          size="sm"
          onClick={onNextLesson}
          className="h-8 text-xs bg-green-600 hover:bg-green-700 text-white animate-pulse"
        >
          {lang === "sw" ? "Somo Linalofuata" : "Next Lesson"}
          <ArrowRight className="ml-1 h-3 w-3" />
        </Button>
      ) : (
        <Button
          variant="default"
          size="sm"
          onClick={() => {
            if (currentStepIndex < lesson.steps.length - 1) {
              onStepChange(currentStepIndex + 1);
            }
          }}
          className="h-8 text-xs bg-primary hover:bg-primary/90"
        >
          {currentStepIndex === lesson.steps.length - 1 
            ? (lang === "sw" ? "Maliza" : "Finish")
            : (lang === "sw" ? "Mbele" : "Next")}
          <ChevronRight className="ml-1 h-3 w-3" />
        </Button>
      )}
    </div>
  );

  // Desktop: full height scrollable panel
  if (!collapsible) {
    return (
      <div className="relative h-full w-full bg-card flex flex-col">
        <ScrollArea className="flex-1 max-h-full [&>div]:h-full [&>div>div]:h-full [&>div>div]:flex! [&>div>div]:flex-col">
          <div className="p-6 lg:p-8 w-full min-w-0 flex flex-col flex-1">
            <div className="flex-1">
              {breadcrumbs}
            {header}
            <div className="prose prose-sm dark:prose-invert max-w-none text-muted-foreground leading-relaxed">
              <Markdown
                components={{
                  code(props) {
                    const { children, className, ...rest } = props;
                    const match = /language-(\w+)/.exec(className || "");
                    return match ? (
                      <div className="not-prose my-4 overflow-hidden rounded-xl border border-border p-2 bg-muted/30">
                        <CodeEditor code={String(children).replace(/\n$/, "")} readOnly />
                      </div>
                    ) : (
                      <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-sm text-foreground" {...rest}>
                        {children}
                      </code>
                    );
                  },
                }}
              >
                {step.description[lang]}
              </Markdown>
            </div>
            
            {step.task && (
              <div className="mt-6 rounded-xl border border-yellow-500/20 bg-yellow-500/5 p-4 shadow-xs">
                <h4 className="mb-2 font-bold text-foreground flex items-center gap-2 text-sm uppercase tracking-tight">
                  <Lightbulb className="h-4 w-4 text-yellow-500" />
                  {lang === "sw" ? "Kazi Yako:" : "Your Task:"}
                </h4>
                <p className="text-sm text-muted-foreground italic leading-normal">
                  {step.task[lang]}
                </p>
              </div>
            )}
          </div>
          {navigation}
        </div>
        </ScrollArea>
      </div>
    )
  }

  // Mobile: collapsible panel inside a resizable pane
  return (
    <div className="bg-card flex flex-col h-full overflow-hidden">
      <div
        role="button"
        tabIndex={0}
        onClick={onToggle}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            onToggle?.();
          }
        }}
        className="flex items-center justify-between w-full px-4 py-2.5 text-left shrink-0 border-b border-border bg-muted/30 cursor-pointer"
      >
        <div className="flex items-center gap-2 truncate">
          <h1 className="text-sm font-bold text-foreground truncate">
            {step.title[lang]}
          </h1>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          {!hideNavigation && (
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={(e) => {
                e.stopPropagation();
                onLangChange(lang === "sw" ? "en" : "sw");
              }}
              className="h-6 w-6 hover:bg-background/50"
            >
              <Languages className="h-3.5 w-3.5" />
            </Button>
          )}
          {isCompleted ? (
            <CheckCircle2 className="h-4 w-4 text-green-500" />
          ) : (
            <div className="h-2 w-2 rounded-full bg-muted-foreground/40" />
          )}
          <ChevronDown
            className={cn(
              "w-4 h-4 text-muted-foreground shrink-0 transition-transform duration-200",
              expanded && "rotate-180"
            )}
          />
        </div>
      </div>
      {expanded && (
        <ScrollArea className="flex-1 [&>div>div]:h-full">
          <div className="px-4 py-4 text-sm w-full min-w-0 flex flex-col min-h-full">
            <div className="flex-1">
              <div className="text-muted-foreground leading-relaxed mb-6">
                <Markdown
                  components={{
                    code(props) {
                      const { children, className, ...rest } = props;
                      const match = /language-(\w+)/.exec(className || "");
                      return match ? (
                        <div className="not-prose my-4 overflow-hidden rounded-xl border border-border bg-muted/30">
                          <CodeEditor code={String(children).replace(/\n$/, "")} readOnly />
                        </div>
                      ) : (
                        <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs text-foreground" {...rest}>
                          {children}
                        </code>
                      );
                    },
                  }}
                >
                  {step.description[lang]}
                </Markdown>
              </div>
              {step.task && (
                <div className="rounded-xl border border-yellow-500/20 bg-yellow-500/5 p-3 mb-4 shadow-xs">
                   <h4 className="mb-1 font-bold text-foreground flex items-center gap-2 text-xs uppercase tracking-tight">
                    <Lightbulb className="h-3 w-3 text-yellow-500" />
                    {lang === "sw" ? "Kazi Yako:" : "Your Task:"}
                  </h4>
                  <p className="text-xs text-muted-foreground italic leading-normal">
                    {step.task[lang]}
                  </p>
                </div>
              )}
            </div>
            {navigation}
          </div>
        </ScrollArea>
      )}
    </div>
  )
}

