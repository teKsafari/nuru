"use client"

import { Play, Send, Eye, Terminal } from "lucide-react"
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
    <div className="flex flex-col h-full bg-background overflow-hidden border-t border-border/20">
      <div className="flex items-center justify-between px-4 py-2 bg-muted/30 border-b border-border/50">
        <div className="flex items-center gap-2.5">
          
          <div className="flex items-center gap-1.5 ml-1">
            <Terminal className="w-3 h-3 text-muted-foreground" />
            <span className="text-[10px] font-black tracking-widest text-muted-foreground uppercase font-mono">
              Terminal
            </span>
          </div>
        </div>
        
        {showToolbar && (
          <div className="flex items-center gap-2">
            <Button onClick={onSubmit} size="sm" className="bg-primary hover:bg-primary/90 text-primary-foreground h-6 px-2 text-[10px] font-bold">
              <Send className="w-2.5 h-2.5 mr-1" />
              {dict.outputPanel.submit}
            </Button>
            <Button variant="secondary" size="sm" onClick={onRun} className="h-6 px-2 text-[10px] font-bold">
              <Play className="w-2.5 h-2.5 mr-1" />
              {dict.outputPanel.run}
            </Button>
            <Button variant="secondary" size="sm" onClick={onShowSolution} className="h-6 px-2 text-[10px] font-bold">
              <Eye className="w-2.5 h-2.5 mr-1" />
              {dict.outputPanel.solution}
            </Button>
          </div>
        )}
      </div>
      
      <ScrollArea className="flex-1">
        <div className="p-5">
          {output ? (
            <pre className="font-mono text-sm text-foreground/90 whitespace-pre-wrap leading-relaxed">
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
            <p className="text-[13px] text-muted-foreground/60 italic font-mono uppercase tracking-tight">
              {dict.outputPanel.placeholder}
            </p>
          )}
        </div>
      </ScrollArea>
    </div>
  )
}