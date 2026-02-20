"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useCallback, useEffect } from "react";
import { useNodesState, Node } from "@xyflow/react";

import { Playground } from "@/components/playground/playground";
import { useElectronicsExecutor } from "@/hooks/useElectronicsExecutor";
import { EXAMPLE_CODE } from "@/lib/electronicsExecutor";
import { executeNuru } from "@/lib/nuru";
import { LEDNode, BuzzerNode, MotorNode } from "@/components/electronics/nodes";
import type { LanguageExecutor, LessonContent } from "@/types/playground";

// ─── Node types (defined outside component to avoid re-creation) ──────────────

const nodeTypes = {
	led: LEDNode,
	buzzer: BuzzerNode,
	motor: MotorNode,
};

const initialNodes: Node[] = [
	{ id: "1", type: "led", position: { x: 50, y: 50 }, data: { isEnabled: false, color: "red", pin: 1 } },
	{ id: "2", type: "led", position: { x: 150, y: 50 }, data: { isEnabled: false, color: "green", pin: 2 } },
	{ id: "3", type: "led", position: { x: 250, y: 50 }, data: { isEnabled: false, color: "blue", pin: 3 } },
	{ id: "4", type: "buzzer", position: { x: 80, y: 180 }, data: { isEnabled: false, pin: 4 } },
	{ id: "5", type: "motor", position: { x: 220, y: 180 }, data: { isEnabled: false, pin: 5 } },
];

// ─── SW (software / Nuru language) playground ────────────────────────────────

const nuruExecutor: LanguageExecutor = {
	language: "Nuru",
	run: async (code) => executeNuru(code),
	submit: async (code) => {
		try {
			await executeNuru(code);
			return "✓ Submitted!";
		} catch (e) {
			return `X Kosa: ${e}`;
		}
	},
};

const nuruLesson: LessonContent = {
	title: "Nuru – Code in Swahili",
	initialCode: `// Programu ya kwanza - Salamu!

jina = jaza("Ingiza jina lako")

andika("Habari " + jina + "!")
`,
	description: (
		<div className="space-y-6 leading-relaxed text-muted-foreground">
			<p>
				Nuru is a Swahili programming language that lets you write real code in your own language.
			</p>
			<div className="space-y-3">
				<h3 className="font-semibold text-foreground">Key functions:</h3>
				<ul className="list-inside list-disc space-y-2">
					<li>
						<code className="rounded bg-background px-1 py-0.5 font-mono text-xs">andika(x)</code>{" "}
						– Print x to the console
					</li>
					<li>
						<code className="rounded bg-background px-1 py-0.5 font-mono text-xs">jaza(&quot;prompt&quot;)</code>{" "}
						– Read user input
					</li>
				</ul>
			</div>
			<div className="mt-6 rounded-lg border border-border bg-secondary/50 p-4">
				<p className="break-words text-sm text-muted-foreground">
					<span className="font-semibold text-foreground">Tip:</span> Use{" "}
					<code className="rounded bg-background px-1 py-0.5 font-mono text-xs">
						andika()
					</code>{" "}
					to see output.
				</p>
			</div>
		</div>
	),
};

function SoftwareDemo() {
	return <Playground lesson={nuruLesson} executor={nuruExecutor} />;
}

// ─── HW (hardware / electronics) playground ──────────────────────────────────

const hwLesson: LessonContent = {
	title: "Electronics playground",
	initialCode: EXAMPLE_CODE,
	description: (
		<div className="space-y-6 leading-relaxed text-muted-foreground">
			<p>
				Control LEDs, buzzers, and motors using simple Swahili commands.
			</p>
			<div className="space-y-3">
				<h3 className="font-semibold text-foreground">Available functions:</h3>
				<ul className="list-inside list-disc space-y-2">
					<li>
						<code className="rounded bg-background px-1 py-0.5 font-mono text-xs">washa(n)</code>{" "}
						– Turn on device n
					</li>
					<li>
						<code className="rounded bg-background px-1 py-0.5 font-mono text-xs">zima(n)</code>{" "}
						– Turn off device n
					</li>
					<li>
						<code className="rounded bg-background px-1 py-0.5 font-mono text-xs">subiri(ms)</code>{" "}
						– Wait for ms milliseconds
					</li>
					<li>
						<code className="rounded bg-background px-1 py-0.5 font-mono text-xs">{"rudia(n) { ... }"}</code>{" "}
						– Repeat commands n times
					</li>
				</ul>
			</div>
			<div className="mt-6 rounded-lg border border-border bg-secondary/50 p-4">
				<p className="break-words text-sm text-muted-foreground">
					<span className="font-semibold text-foreground">Tip:</span>{" "}
					Drag the components around to arrange your layout!
				</p>
			</div>
		</div>
	),
};

function HardwareDemo() {
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
		/>
	);
}

// ─── Main demo router ─────────────────────────────────────────────────────────

function DemoContent() {
	const searchParams = useSearchParams();
	const type = searchParams.get("type");

	if (type === "hw") return <HardwareDemo />;
	return <SoftwareDemo />;
}

export default function DemoPage() {
	return (
		<Suspense>
			<DemoContent />
		</Suspense>
	);
}
