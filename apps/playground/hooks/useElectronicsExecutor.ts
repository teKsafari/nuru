"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import {
	ElectronicsExecutor,
	DEFAULT_COMPONENTS,
} from "@/lib/electronicsExecutor";
import type { ComponentState, ProgramState } from "@/types/electronics";
import { Executor } from "@/lib/executor";
import { OutputReceiver } from "@/types";

interface UseElectronicsExecutorReturn {
	executor: Executor<ElectronicsExecutor>;
	components: ComponentState[];
	programState: ProgramState;
	currentLine: number;
	resetComponents: () => void;
}

/**
 * Custom hook that manages electronics executor state and returns
 * a LanguageExecutor-compatible interface for playground integration.
 */
export function useElectronicsExecutor(): UseElectronicsExecutorReturn {
	const [components, setComponents] = useState<ComponentState[]>(
		DEFAULT_COMPONENTS.map((c) => ({ ...c })),
	);
	const [programState, setProgramState] = useState<ProgramState>("idle");
	const [currentLine, setCurrentLine] = useState(-1);
	
	// We need to keep the executor instance stable
	const executorInstanceRef = useRef<ElectronicsExecutor | null>(null);
	const genericExecutorRef = useRef<Executor<ElectronicsExecutor> | null>(null);

	const resetComponents = useCallback(() => {
		setComponents(DEFAULT_COMPONENTS.map((c) => ({ ...c })));
	}, []);

	if (!genericExecutorRef.current) {
		genericExecutorRef.current = new Executor(
			"Electronics",
			(outputHandler) => {
				const instance = new ElectronicsExecutor(
					{
						onComponentChange: (index, isEnabled) => {
							setComponents((prev) =>
								prev.map((c, i) => (i === index ? { ...c, isEnabled } : c)),
							);
						},
						onOutput: (message, type) => {
							outputHandler(message, type === "error");
						},
						onLineChange: (line) => {
							setCurrentLine(line);
						},
						onStateChange: (state) => {
							setProgramState(state);
						},
						onError: () => {
							// Error handling is done via output
						},
					},
					{
						componentCount: DEFAULT_COMPONENTS.length,
						loop: false,
					},
				);
				executorInstanceRef.current = instance;
				return instance;
			},
			{
				onBeforeRun: () => {
					resetComponents();
				}
			}
		);
	}

	useEffect(() => {
		return () => {
			executorInstanceRef.current?.destroy();
		};
	}, []);

	return {
		executor: genericExecutorRef.current,
		components,
		programState,
		currentLine,
		resetComponents,
	};
}
