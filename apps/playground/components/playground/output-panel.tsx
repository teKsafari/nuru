"use client"

import { Play, Send, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/playground/scroll-area"
import { Dictionary } from "@/app/(main)/[lang]/dictionaries"

interface OutputPanelProps {
  output: string
  onRun?: () => void
  onSubmit?: () => void
  onShowSolution?: () => void
  showToolbar?: boolean
  dict: Dictionary
}

export function OutputPanel({ output, onRun, onSubmit, onShowSolution, showToolbar = true, dict }: OutputPanelProps) {
  return (
    <div className="flex flex-col h-full bg-background">
      {showToolbar && (
        <div className="flex items-center gap-2 px-4 py-2 border-b border-border bg-card">
          <Button onClick={onSubmit} size="sm" className="bg-primary hover:bg-primary/90 text-primary-foreground h-7 px-3 text-xs">
            <Send className="w-3 h-3 mr-1.5" />
            {dict.outputPanel.submit}
          </Button>
          <Button variant="secondary" size="sm" onClick={onRun} className="h-7 px-3 text-xs">
            <Play className="w-3 h-3 mr-1.5" />
            {dict.outputPanel.run}
          </Button>
          <Button variant="secondary" size="sm" onClick={onShowSolution} className="h-7 px-3 text-xs">
            <Eye className="w-3 h-3 mr-1.5" />
            {dict.outputPanel.solution}
          </Button>
        </div>
        )}
        <ScrollArea className="flex-1">
        <div className="p-4">
          {output ? (
            <pre className="font-mono text-sm text-foreground whitespace-pre-wrap">
              {output.split("\n").map((line, i) => {
                const isError = line.toLowerCase().includes("error:") || line.toLowerCase().includes("hitilafu:");
                return (
                  <span key={i} className={isError ? "text-red-500 dark:text-red-400 block" : "block"}>
                    {line}
                  </span>
                );
              })}
            </pre>
          ) : (
            <p className="text-sm text-muted-foreground italic">{dict.outputPanel.placeholder}</p>
          )}
        </div>
      </ScrollArea>
    </div>
  )
}