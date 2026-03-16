"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useCallback, useEffect } from "react";
import { useNodesState, Node } from "@xyflow/react";

import { useTheme } from "next-themes";

import { Playground } from "@/components/playground/playground";
import { useElectronicsExecutor } from "@/hooks/useElectronicsExecutor";
import { EXAMPLE_CODE } from "@/lib/electronicsExecutor";
import { useNuru } from "@nuru/wasm/react";
import { LEDNode, BuzzerNode, MotorNode } from "@/components/electronics/nodes";
import type { LessonContent } from "@/types/playground";
import { Executor } from "@/lib/executor";

// ─── Node types (defined outside component to avoid re-creation) ──────────────

const nodeTypes = {
	led: LEDNode,
	buzzer: BuzzerNode,
	motor: MotorNode,
};

const initialNodes: Node[] = [
	{
		id: "1",
		type: "led",
		position: { x: 50, y: 50 },
		data: { isEnabled: false, color: "red", pin: 1 },
	},
	{
		id: "2",
		type: "led",
		position: { x: 150, y: 50 },
		data: { isEnabled: false, color: "green", pin: 2 },
	},
	{
		id: "3",
		type: "led",
		position: { x: 250, y: 50 },
		data: { isEnabled: false, color: "blue", pin: 3 },
	},
	{
		id: "4",
		type: "buzzer",
		position: { x: 80, y: 180 },
		data: { isEnabled: false, pin: 4 },
	},
	{
		id: "5",
		type: "motor",
		position: { x: 220, y: 180 },
		data: { isEnabled: false, pin: 5 },
	},
];

// ─── SW (software / Nuru language) playground ────────────────────────────────

function SoftwareDemo({ theme }: { theme: "light" | "dark" }) {
	const nuruExecutor = new Executor("nuru", useNuru);

	return (
		<Playground lesson={nuruLesson} executor={nuruExecutor} theme={theme} />
	);
}

const nuruLesson: LessonContent = {
	title: "Nuru – Code in Swahili",
	initialCode: `// Programu ya kwanza - Salamu!\n\njina = jaza("Ingiza jina lako")\n\nandika("Habari " + jina + "!")\n`,
	description: `Nuru is a Swahili programming language that lets you write real code in your own language.

### Key functions:
- \`andika(x)\` – Print x to the console
- \`jaza("prompt")\` – Read user input

> **Tip:** Use \`andika()\` to see output.`,
};

// ─── HW (hardware / electronics) playground ──────────────────────────────────

const hwLesson: LessonContent = {
	title: "Electronics playground",
	initialCode: EXAMPLE_CODE,
	description: `Control LEDs, buzzers, and motors using simple Swahili commands.

### Available functions:
- \`washa(n)\` – Turn on device n
- \`zima(n)\` – Turn off device n
- \`subiri(ms)\` – Wait for ms milliseconds
- \`rudia(n) { ... }\` – Repeat commands n times

> **Tip:** Drag the components around to arrange your layout!`,
};

function HardwareDemo({ theme }: { theme: "light" | "dark" }) {
	const { executor, components } = useElectronicsExecutor();
	const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);

	const handleResetSimulation = useCallback(() => {
		setNodes(initialNodes.map((node) => ({ ...node })));
	}, [setNodes]);

	useEffect(() => {
		setNodes((nds) =>
			nds.map((node) => {
				const pin = node.data.pin as number;
				const comp = components.find((c) => c.pin === pin);
				if (comp && comp.isEnabled !== node.data.isEnabled) {
					return { ...node, data: { ...node.data, isEnabled: comp.isEnabled } };
				}
				return node;
			}),
		);
	}, [components, setNodes]);

	return (
		<Playground
			lesson={hwLesson}
			executor={executor}
			nodes={nodes}
			onNodesChange={onNodesChange}
			onResetSimulation={handleResetSimulation}
			nodeTypes={nodeTypes}
			theme={theme}
		/>
	);
}

// ─── Main demo router ─────────────────────────────────────────────────────────

function DemoContent() {
	const searchParams = useSearchParams();
	const type = searchParams.get("type");
	let theme = searchParams.get("theme") as "light" | "dark";

	theme = theme === "dark" || theme === "light" ? theme : "dark";

	return (
		<>
			{type == "hw" ? (
				<HardwareDemo theme={theme} />
			) : (
				<SoftwareDemo theme={theme} />
			)}
		</>
	);

}

export default function DemoPage() {
	return (
		<Suspense>
			<DemoContent />
		</Suspense>
	);
}
