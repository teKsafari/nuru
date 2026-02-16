"use client"

import { ScrollArea } from "@/components/playground/scroll-area"

interface OutputPanelProps {
  output: string
}

export function OutputPanel({ output }: OutputPanelProps) {
  return (
    <div className="flex flex-col h-full bg-background">
      <ScrollArea className="flex-1">
        <div className="p-4">
          {output ? (
            <pre className="font-mono text-sm text-foreground whitespace-pre-wrap">{output}</pre>
          ) : (
            <p className="text-sm text-muted-foreground italic">Run your code to see output here...</p>
          )}
        </div>
      </ScrollArea>
    </div>
  )
}
