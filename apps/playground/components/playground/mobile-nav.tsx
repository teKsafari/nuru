"use client"

import { BookOpen, Code2, Terminal } from "lucide-react"
import { cn } from "@nuru/ui"
import { PlaygroundLabels } from "@/types/playground"

interface MobileNavProps {
  activeTab: "lesson" | "code" | "output"
  onTabChange: (tab: "lesson" | "code" | "output") => void
  labels: PlaygroundLabels
}

export function MobileNav({ activeTab, onTabChange, labels }: MobileNavProps) {
  return (
    <nav className="flex items-center gap-1 p-2 bg-card border-b border-border shrink-0">
      <button
        onClick={() => onTabChange("lesson")}
        className={cn(
          "flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors flex-1 justify-center",
          activeTab === "lesson"
            ? "bg-primary text-primary-foreground"
            : "text-muted-foreground hover:text-foreground hover:bg-secondary",
        )}
      >
        <BookOpen className="w-4 h-4" />
        <span className="truncate">Lesson</span>
      </button>
      <button
        onClick={() => onTabChange("code")}
        className={cn(
          "flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors flex-1 justify-center",
          activeTab === "code"
            ? "bg-primary text-primary-foreground"
            : "text-muted-foreground hover:text-foreground hover:bg-secondary",
        )}
      >
        <Code2 className="w-4 h-4" />
        <span className="truncate">Code</span>
      </button>
      <button
        onClick={() => onTabChange("output")}
        className={cn(
          "flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors flex-1 justify-center",
          activeTab === "output"
            ? "bg-primary text-primary-foreground"
            : "text-muted-foreground hover:text-foreground hover:bg-secondary",
        )}
      >
        <Terminal className="w-4 h-4" />
        <span className="truncate">Output</span>
      </button>
    </nav>
  )
}
