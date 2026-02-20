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
				className="bg-slate-950"
				proOptions={{ hideAttribution: true }}
				minZoom={0.5}
				maxZoom={2}
			>
				<Background
					variant={BackgroundVariant.Dots}
					color="#334155"
					gap={20}
					size={1}
				/>
				<Controls
					position="top-right"
					orientation="vertical"
					className="!top-0.5 !right-0.5 md:!top-1 md:!right-1 border-0 bg-slate-800 text-slate-300 [&>button:hover]:bg-slate-700 [&>button]:border-0 [&>button]:bg-slate-800 [&>button]:text-slate-300 [&>button]:w-6 [&>button]:h-6 md:[&>button]:w-6 md:[&>button]:h-6"
				>
					{onReset && <ResetButton onReset={onReset} />}
				</Controls>
				{content}
			</ReactFlow>
		</div>
	);
}
