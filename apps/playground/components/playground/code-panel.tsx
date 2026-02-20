"use client"

import { Play } from "lucide-react"
import { CodeEditor } from "./code-editor"
import { OutputPanel } from "./output-panel"
import { Button } from "@/components/ui/button"
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/playground/resizable"

interface CodePanelProps {
  code: string
  output: string
  onCodeChange: (code: string) => void
  onRun: () => void
  onSubmit: () => void
  onShowSolution: () => void
  isMobile?: boolean
}

export function CodePanel({
  code,
  output,
  onCodeChange,
  onRun,
  onSubmit,
  onShowSolution,
  isMobile,
}: CodePanelProps) {
  const runButton = (
    <Button
      onClick={onRun}
      size="sm"
      className="absolute bottom-3 right-3 z-10 bg-primary hover:bg-primary/90 text-primary-foreground h-8 px-3 text-xs shadow-md"
    >
      <Play className="w-3 h-3 mr-1.5" />
      Run
    </Button>
  )

  // Mobile: editor with floating run button (output is handled by parent)
  if (isMobile) {
    return (
      <div className="relative flex flex-col h-full bg-code-bg">
        <CodeEditor code={code} onChange={onCodeChange} />
        {runButton}
      </div>
    )
  }

  // Desktop: editor with floating run button + output
  return (
    <div className="flex flex-col h-full bg-code-bg">
      <ResizablePanelGroup direction="vertical" className="flex-1">
        <ResizablePanel defaultSize={60} minSize={30}>
          <div className="relative h-full">
            <CodeEditor code={code} onChange={onCodeChange} />
            {runButton}
          </div>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={40} minSize={15}>
          <OutputPanel
            output={output}
            showToolbar={false}
          />
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  )
}
