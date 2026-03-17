"use client"

import { ChevronDown, Languages, ChevronLeft, ChevronRight, Lightbulb } from "lucide-react"
import { ScrollArea } from "@/components/playground/scroll-area"
import { Lesson, Language } from "@/types/playground"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import Markdown from "react-markdown"
import { CodeEditor } from "./code-editor"

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
  hideNavigation
}: LessonPanelProps) {
  const step = lesson.steps[currentStepIndex];

  const header = (
    <div className="flex items-center justify-between mb-6">
      <h1 className="text-2xl lg:text-3xl font-bold text-foreground">
        {step.title[lang]}
      </h1>
      {!hideNavigation && (
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => onLangChange(lang === "sw" ? "en" : "sw")}
          className="h-8 px-2 text-xs"
        >
          <Languages className="mr-2 h-4 w-4" />
          {lang === "sw" ? "English" : "Kiswahili"}
        </Button>
      )}
    </div>
  );

  const navigation = !hideNavigation && (
    <div className="mt-8 flex items-center justify-between gap-4 pt-4 border-t border-border">
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
      
      <div className="flex flex-col items-center gap-1">
        <div className="text-[10px] text-muted-foreground font-mono uppercase tracking-wider">
          {lang === "sw" ? "Hatua" : "Step"} {currentStepIndex + 1} / {lesson.steps.length}
        </div>
        <div className="hidden md:flex gap-1">
          {lesson.steps.map((_, i) => (
            <div 
              key={i} 
              className={cn(
                "h-1 w-4 rounded-full transition-colors",
                i === currentStepIndex ? "bg-primary" : i < currentStepIndex ? "bg-primary/40" : "bg-muted"
              )}
            />
          ))}
        </div>
      </div>

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
    </div>
  );

  // Desktop: full height scrollable panel
  if (!collapsible) {
    return (
      <ScrollArea className="flex h-full w-full bg-card [&>div>div]:h-full [&>div>div]:!flex">
        <div className="p-6 lg:p-8 w-full min-w-0 flex flex-col min-h-full">
          <div className="flex-1">
            {header}
            <div className="prose prose-sm dark:prose-invert max-w-none text-muted-foreground leading-relaxed">
              <Markdown
                components={{
                  code(props) {
                    const { children, className, ...rest } = props;
                    const match = /language-(\w+)/.exec(className || "");
                    return match ? (
                      <div className="not-prose my-4 overflow-hidden rounded-md border border-border p-2">
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
              <div className="mt-6 rounded-lg border border-yellow-500/20 bg-yellow-500/5 p-4">
                <h4 className="mb-2 font-semibold text-foreground flex items-center gap-2 text-sm">
                  <Lightbulb className="h-4 w-4 text-yellow-500" />
                  {lang === "sw" ? "Jaribu hili:" : "Try this:"}
                </h4>
                <p className="text-sm text-muted-foreground italic">
                  {step.task[lang]}
                </p>
              </div>
            )}
          </div>
          {navigation}
        </div>
      </ScrollArea>
    )
  }

  // Mobile: collapsible panel inside a resizable pane
  return (
    <div className="bg-card flex flex-col h-full overflow-hidden">
      <button
        onClick={onToggle}
        className="flex items-center justify-between w-full px-4 py-2.5 text-left shrink-0 border-b border-border"
      >
        <div className="flex items-center gap-2 truncate">
          {!hideNavigation && (
            <span className="text-xs font-mono text-primary">{currentStepIndex + 1}.</span>
          )}
          <h1 className="text-sm font-semibold text-foreground truncate">
            {step.title[lang]}
          </h1>
        </div>
        <ChevronDown
          className={cn(
            "w-4 h-4 text-muted-foreground shrink-0 transition-transform duration-200",
            expanded && "rotate-180"
          )}
        />
      </button>
      {expanded && (
        <ScrollArea className="flex-1 [&>div>div]:h-full">
          <div className="px-4 py-4 text-sm w-full min-w-0 flex flex-col min-h-full">
            <div className="flex-1">
              {!hideNavigation && (
                <div className="flex justify-end mb-4">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={(e) => {
                      e.stopPropagation();
                      onLangChange(lang === "sw" ? "en" : "sw");
                    }}
                    className="h-7 px-2 text-[10px]"
                  >
                    <Languages className="mr-1 h-3 w-3" />
                    {lang === "sw" ? "English" : "Kiswahili"}
                  </Button>
                </div>
              )}
              <div className="text-muted-foreground leading-relaxed mb-4">
                <Markdown
                  components={{
                    code(props) {
                      const { children, className, ...rest } = props;
                      const match = /language-(\w+)/.exec(className || "");
                      return match ? (
                        <div className="not-prose my-4 overflow-hidden rounded-md border border-border">
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
                <div className="rounded-lg border border-yellow-500/20 bg-yellow-500/5 p-3 mb-4">
                   <h4 className="mb-1 font-semibold text-foreground flex items-center gap-2 text-xs">
                    <Lightbulb className="h-3 w-3 text-yellow-500" />
                    {lang === "sw" ? "Jaribu hili:" : "Try this:"}
                  </h4>
                  <p className="text-xs text-muted-foreground italic">
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
