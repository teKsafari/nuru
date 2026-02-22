"use client";

import { Paintbrush } from "lucide-react";
import {
	ReactFlow,
	Background,
	Controls,
	ControlButton,
	BackgroundVariant,
	useReactFlow,
	Node,
	Edge,
	NodeTypes,
	OnNodesChange,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

interface SimulationPanelProps {
	nodes: Node[];
	edges: Edge[];
	onNodesChange?: OnNodesChange;
	onReset?: () => void;
	nodeTypes?: NodeTypes;
	content?: React.ReactNode;
}

function ResetButton({ onReset }: { onReset: () => void }) {
	const { fitView } = useReactFlow();
	return (
		<ControlButton
			onClick={() => {
				onReset();
				setTimeout(() => fitView({ duration: 300 }), 0);
			}}
			title="Reset positions"
		>
			<Paintbrush />
		</ControlButton>
	);
}

export function SimulationPanel({
	nodes,
	edges,
	onNodesChange,
	onReset,
	nodeTypes,
	content,
}: SimulationPanelProps) {
	return (
		<div className="h-full w-full">
			<ReactFlow
				nodes={nodes}
				edges={edges}
				onNodesChange={onNodesChange}
				nodeTypes={nodeTypes}
				fitView
				className="bg-background dark:bg-slate-950"
				proOptions={{ hideAttribution: true }}
				minZoom={0.5}
				maxZoom={2}
			>
				<Background
					variant={BackgroundVariant.Dots}
					color="var(--muted-foreground)"
					gap={20}
					size={1}
				/>
				<Controls
					position="top-right"
					orientation="vertical"
					className="!right-0.5 !top-0.5 border-0 bg-secondary text-secondary-foreground dark:bg-secondary dark:text-secondary-foreground md:!right-1 md:!top-1 [&>button:hover]:bg-accent dark:[&>button:hover]:bg-accent [&>button]:h-6 [&>button]:w-6 [&>button]:border-0 [&>button]:bg-secondary [&>button]:text-secondary-foreground dark:[&>button]:bg-secondary dark:[&>button]:text-secondary-foreground md:[&>button]:h-6 md:[&>button]:w-6"
				>
					{onReset && <ResetButton onReset={onReset} />}
				</Controls>
				{content}
			</ReactFlow>
		</div>
	);
}
