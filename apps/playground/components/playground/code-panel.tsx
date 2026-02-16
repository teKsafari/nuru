"use client"

import { Play, Send, Eye } from "lucide-react"
import type { Node, Edge, NodeTypes, OnNodesChange } from "@xyflow/react"
import { Button } from "@/components/ui/button"
import { CodeEditor } from "./code-editor"
import { OutputPanel } from "./output-panel"
import { SimulationPanel } from "./simulation-panel"
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/playground/resizable"

interface CodePanelProps {
  code: string
  output: string
  onCodeChange: (code: string) => void
  onRun: () => void
  onSubmit: () => void
  onShowSolution: () => void
  hasSimulation?: boolean
  nodes?: Node[]
  edges?: Edge[]
  onNodesChange?: OnNodesChange
  nodeTypes?: NodeTypes
  simulationContent?: React.ReactNode
}

export function CodePanel({
  code,
  output,
  onCodeChange,
  onRun,
  onSubmit,
  onShowSolution,
  hasSimulation,
  nodes = [],
  edges = [],
  onNodesChange,
  nodeTypes,
  simulationContent,
}: CodePanelProps) {
  return (
    <div className="flex flex-col h-full bg-code-bg">
      <ResizablePanelGroup direction="vertical" className="flex-1">
        <ResizablePanel defaultSize={60} minSize={30}>
          <CodeEditor code={code} onChange={onCodeChange} />
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={40} minSize={15}>
          <div className="flex flex-col h-full">
            <div className="flex items-center gap-2 px-4 py-2 border-b border-border bg-card">
              <Button onClick={onSubmit} size="sm" className="bg-primary hover:bg-primary/90 text-primary-foreground h-7 px-3 text-xs">
                <Send className="w-3 h-3 mr-1.5" />
                Submit
              </Button>
              <Button variant="secondary" size="sm" onClick={onRun} className="h-7 px-3 text-xs">
                <Play className="w-3 h-3 mr-1.5" />
                Run
              </Button>
              <Button variant="secondary" size="sm" onClick={onShowSolution} className="h-7 px-3 text-xs">
                <Eye className="w-3 h-3 mr-1.5" />
                Solution
              </Button>
            </div>
            <div className="flex-1 overflow-hidden">
              {hasSimulation ? (
                <ResizablePanelGroup direction="horizontal" className="h-full">
                  <ResizablePanel defaultSize={50} minSize={20} collapsible collapsedSize={0}>
                    <OutputPanel output={output} />
                  </ResizablePanel>
                  <ResizableHandle withHandle />
                  <ResizablePanel defaultSize={50} minSize={20} collapsible collapsedSize={0}>
                    <SimulationPanel
                      nodes={nodes}
                      edges={edges}
                      onNodesChange={onNodesChange}
                      nodeTypes={nodeTypes}
                      content={simulationContent}
                    />
                  </ResizablePanel>
                </ResizablePanelGroup>
              ) : (
                <OutputPanel output={output} />
              )}
            </div>
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  )
}
