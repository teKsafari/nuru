import { useRef, useEffect } from "react";
import { useNuru } from "@nuru/wasm/react";
import { NuruExecutor } from "../lib/executors/nuru-executor";
import { MockExecutor } from "../lib/executors/mock-executor";
import { IExecutor } from "@/types/executor";

interface UseExecutorOptions {
	wasmURL?: string;
	onUncaughtOutput?: (text: string, isError: boolean) => void;
}

interface MetaExecutor extends IExecutor {
	_language?: string;
}

export function useExecutor(
	language: string,
	options?: UseExecutorOptions
): IExecutor {
	const executorRef = useRef<MetaExecutor | null>(null);
	const onUncaughtOutputRef = useRef(options?.onUncaughtOutput);

	useEffect(() => {
		onUncaughtOutputRef.current = options?.onUncaughtOutput;
	}, [options?.onUncaughtOutput]);

	const nuruInstance = useNuru(
		(text, isError) => {
			const exec = executorRef.current;
			if (exec instanceof NuruExecutor && exec.isExecuting()) {
				exec.handleOutput(text, isError);
			} else if (onUncaughtOutputRef.current) {
				onUncaughtOutputRef.current(text, isError);
			}
		},
		{ wasmURL: options?.wasmURL }
	);

	// Lazily initialize or re-initialize executor instance on language change
	if (!executorRef.current || executorRef.current._language !== language) {
		if (language === "mock") {
			executorRef.current = new MockExecutor() as MetaExecutor;
		} else {
			executorRef.current = new NuruExecutor(nuruInstance) as MetaExecutor;
		}
		executorRef.current._language = language;
	} else if (language !== "mock" && executorRef.current instanceof NuruExecutor) {
		// Update the WASM instance on the stable executor
		executorRef.current.setInstance(nuruInstance);
	}

	return executorRef.current;
}
