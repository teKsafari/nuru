import init, { defaultConfig } from "../index";
import type { NuruInstance, InterpreterConfig } from "../index";

import { useState, useEffect, useRef } from "react";

export type OutputReceiver = (content: string, isError: boolean) => void;

export function useNuru(outputReceiver: OutputReceiver, interpreterConfig?: InterpreterConfig): NuruInstance {
	const [nuruInstance, setNuruInstance] = useState<NuruInstance | null>(null);

	const outputReceiverRef = useRef(outputReceiver);

	useEffect(() => {
		outputReceiverRef.current = outputReceiver;
	}, [outputReceiver]);

	useEffect(() => {
		let mounted = true;
		if (!nuruInstance) {
			// setIsLoading(true)
			init({
				...interpreterConfig,
				outputReceiver: (output, isError) => {
					if (outputReceiverRef.current) {
						outputReceiverRef.current(output, isError);
					}
				},
			}).then((nuru) => {
				if (mounted) {
					// check if the component is mounted
					setNuruInstance(nuru);
					// setIsLoading(false);
				}
			});
		}

		return () => {
			// cleanup function that sets mounted=false
			mounted = false;
		};
	}, []);

	const proxyInstance: NuruInstance = {
		config: nuruInstance?.config || { ...defaultConfig, outputReceiver: (output) => console.log(output) },
		initialized: false,
		execute: (code: string) => "Initializing, please wait",
	};

	// why `mounted`? Because initing Nuru (`init`) is an async operation
	// it requires loading a wasm binary and all that
	// init().then()... might execute after the user has navigated away
	// and react will try to update state ('setNuruInstance`) that is no longer available
	// throwing an error.
	// That's why we return a cleanup function that sets mounted=false when useEffect is unmounted

	// why `useRef`? Because the output receiver might be stale
	// If the passed function references react state for example,
	// using useEffect would call the function with old values
	//  const nuru = useNuru((output) => {
	// 		setLogs([...logs, output]);
	//  });
	// with useEffect, the function will be called with setLogs([...logs, output]) referencing a stale value of logs

	return nuruInstance || proxyInstance;
}
