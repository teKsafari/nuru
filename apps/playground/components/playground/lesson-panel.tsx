"use client"

import { ChevronDown } from "lucide-react"
import { ScrollArea } from "@/components/playground/scroll-area"
import { LessonContent } from "@/types/playground"
import { cn } from "@/lib/utils"

interface LessonPanelProps {
  lesson: LessonContent
  collapsible?: boolean
  expanded?: boolean
  onToggle?: () => void
}

export function LessonPanel({ lesson, collapsible, expanded, onToggle }: LessonPanelProps) {
  // Desktop: full height scrollable panel
  if (!collapsible) {
    return (
      <ScrollArea className="h-full w-full bg-card">
        <div className="p-6 lg:p-8 w-full min-w-0">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl lg:text-3xl font-bold text-foreground">{lesson.title}</h1>
          </div>
          {lesson.description}
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
        <h1 className="text-sm font-semibold text-foreground truncate pr-2">
          {lesson.title}
        </h1>
        <ChevronDown
          className={cn(
            "w-4 h-4 text-muted-foreground shrink-0 transition-transform duration-200",
            expanded && "rotate-180"
          )}
        />
      </button>
      {expanded && (
        <ScrollArea className="flex-1">
          <div className="px-4 pb-4 text-sm w-full min-w-0">
            {lesson.description}
          </div>
        </ScrollArea>
      )}
    </div>
  )
}
