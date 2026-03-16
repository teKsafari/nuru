import React from "react";
import type { Node, Edge, NodeTypes, OnNodesChange } from "@xyflow/react";

import { Executor } from "@/lib/executor";
import type { Interpreter } from "@/lib/executor";

export type Language = "sw" | "en";

export interface LessonContent {
	title: string;
	description: string;
	initialCode: string;
	simulation?: React.ReactNode;
	// New ReactFlow props
	initialNodes?: Node[];
	initialEdges?: Edge[];
	nodeTypes?: NodeTypes;
}

export interface LessonStep {
	id: string;
	title: Record<Language, string>;
	description: Record<Language, string>;
	initialCode: string;
	solution?: string;
	task?: Record<Language, string>;
	simulation?: React.ReactNode;
	// New ReactFlow props
	initialNodes?: Node[];
	initialEdges?: Edge[];
	nodeTypes?: NodeTypes;
}

export interface Lesson {
	id: string;
	title: Record<Language, string>;
	steps: LessonStep[];
}

export interface PlaygroundProps {
	lesson: Lesson | LessonContent;
	executor: Executor<Interpreter>;
	simulation?: React.ReactNode;
	// New ReactFlow props
	nodes?: Node[];
	edges?: Edge[];
	onNodesChange?: OnNodesChange;
	onResetSimulation?: () => void;
	nodeTypes?: NodeTypes;
	theme?: "light" | "dark";
}
