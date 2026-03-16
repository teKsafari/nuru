"use client";

import { useCallback, useEffect } from "react";
import { useNodesState, Node } from "@xyflow/react";
import { Playground } from "@/components/playground/playground";
import { useElectronicsExecutor } from "@/hooks/useElectronicsExecutor";
import { EXAMPLE_CODE } from "@/lib/electronicsExecutor";
import type { Lesson } from "@/types/playground";
import { LEDNode, BuzzerNode, MotorNode } from "@/components/electronics/nodes";

import { useTheme } from "next-themes";

// Define node types outside component to avoid re-creation
const nodeTypes = {
	led: LEDNode,
	buzzer: BuzzerNode,
	motor: MotorNode,
};

const initialNodes: Node[] = [
	// LEDs
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
	// Buzzer
	{
		id: "4",
		type: "buzzer",
		position: { x: 80, y: 180 },
		data: { isEnabled: false, pin: 4 },
	},
	// Motor
	{
		id: "5",
		type: "motor",
		position: { x: 220, y: 180 },
		data: { isEnabled: false, pin: 5 },
	},
];

export default function IntegratedElectronicsPage() {
	const { theme, forcedTheme } = useTheme();

	const { executor, components } = useElectronicsExecutor();
	const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);

	const handleResetSimulation = useCallback(() => {
		setNodes(initialNodes.map((node) => ({ ...node })));
	}, [setNodes]);

	// Sync executor state to nodes
	useEffect(() => {
		setNodes((nds) =>
			nds.map((node) => {
				const pin = node.data.pin as number;
				// Find component state by pin
				const comp = components.find((c) => c.pin === pin);

				if (comp && comp.isEnabled !== node.data.isEnabled) {
					return {
						...node,
						data: {
							...node.data,
							isEnabled: comp.isEnabled,
						},
					};
				}
				return node;
			}),
		);
	}, [components, setNodes]);

	const lesson: Lesson = {
		id: "elektroniki",
		title: {
			sw: "Elektroniki - Jifunze kudhibiti vifaa kwa Kiswahili",
			en: "Electronics - Learn to control devices in Swahili",
		},
		steps: [
			{
				id: "mwanzo",
				title: {
					sw: "Elektroniki",
					en: "Electronics",
				},
				initialCode: EXAMPLE_CODE,
				description: {
					sw: `Jifunze kudhibiti vifaa vya elektroniki kama LED, buzzer, na motor kwa kutumia amri rahisi za Kiswahili. Sasa unaweza pia kupanga vifaa hivi navyo unavyotaka!

### Amri zinazopatikana:
- \`washa(n)\` - Washa kifaa nambari n
- \`zima(n)\` - Zima kifaa nambari n
- \`subiri(ms)\` - Subiri kwa millisekunde
- \`rudia(n) { ... }\` - Rudia amri mara n

> **Kidokezo:** Jaribu kuburuta vifaa hivi kupanga muundo wako!`,
					en: `Learn to control electronic devices like LEDs, buzzers, and motors using simple Swahili commands. You can now also arrange these devices as you wish!

### Available commands:
- \`washa(n)\` - Turn on device n
- \`zima(n)\` - Turn off device n
- \`subiri(ms)\` - Wait for milliseconds
- \`rudia(n) { ... }\` - Repeat commands n times

> **Tip:** Try dragging these devices to arrange your layout!`,
				},
				task: {
					sw: "Bonyeza kitufe cha 'Run' kuona jinsi vifaa vinavyofanya kazi.",
					en: "Click the 'Run' button to see how the devices work.",
				}
			},
		],
	};

	return (
		<Playground
			theme={ (forcedTheme || theme) as "light" | "dark"} 
			lesson={lesson}
			executor={executor}
			nodes={nodes}
			onNodesChange={onNodesChange}
			onResetSimulation={handleResetSimulation}
			nodeTypes={nodeTypes}
		/>
	);
}
