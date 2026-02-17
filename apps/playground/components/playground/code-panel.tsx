"use client"

import { CodeEditor } from "./code-editor"
import { OutputPanel } from "./output-panel"
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
  // Mobile: just the editor (output is handled by parent)
  if (isMobile) {
    return (
      <div className="flex flex-col h-full bg-code-bg">
        <CodeEditor code={code} onChange={onCodeChange} />
      </div>
    )
  }

  // Desktop: editor + output (output has its own toolbar)
  return (
    <div className="flex flex-col h-full bg-code-bg">
      <ResizablePanelGroup direction="vertical" className="flex-1">
        <ResizablePanel defaultSize={70} minSize={30}>
          <CodeEditor code={code} onChange={onCodeChange} />
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={30} minSize={15}>
          <OutputPanel
            output={output}
            onRun={onRun}
            onSubmit={onSubmit}
            onShowSolution={onShowSolution}
          />
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  )
}
