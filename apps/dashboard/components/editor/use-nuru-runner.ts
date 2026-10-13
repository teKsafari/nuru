"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { NuruRuntime, type RunStatus } from "@nuru/wasm/runtime";
import type { RunCapture } from "@nuru/ui/validation/grader";

const CONFIG = {
	workerURL: "/nuru/nuru-worker.js",
	wasmURL: "/nuru/nuru.wasm",
	execURL: "/nuru/wasm_exec.js",
};

export const RUN_TIMEOUT_MS = 5000;

export type Capture = RunCapture & { status: RunStatus };
export type RunnerState = "loading" | "ready" | "error";

/**
 * One Nuru worker for the lesson editor. `capture` runs a program to the end
 * (jaza() answers come from `stdin`, never from a prompt) and collects stdout,
 * stderr and kobe/ubao events. Its shape is the grader's Runner.
 */
export function useNuruRunner(messages: { needsInput: string; timeout: string; crashed: string }) {
	const ref = useRef<NuruRuntime | null>(null);
	const [state, setState] = useState<RunnerState>("loading");
	const msgs = useRef(messages);
	msgs.current = messages;

	useEffect(() => {
		const runtime = new NuruRuntime(CONFIG);
		ref.current = runtime;
		let alive = true;
		runtime
			.warmUp()
			.then(() => alive && setState("ready"))
			.catch(() => alive && setState("error"));
		return () => {
			alive = false;
			runtime.dispose();
			ref.current = null;
		};
	}, []);

	const capture = useCallback(async (code: string, stdin?: string[]): Promise<Capture> => {
		const runtime = ref.current;
		if (!runtime) return { stdout: "", stderr: msgs.current.crashed, events: [], status: "crashed" };
		const stdout: string[] = [];
		const stderr: string[] = [];
		const events: Array<Record<string, any>> = [];
		const res = await runtime.run(code, {
			stdin,
			interactive: false,
			timeoutMs: RUN_TIMEOUT_MS,
			onOutput: (text, isError) => (isError ? stderr : stdout).push(text),
			onEvent: (e) => events.push(e),
		});
		if (res.status === "needs-input") stderr.push(msgs.current.needsInput);
		if (res.status === "timeout") stderr.push(msgs.current.timeout);
		if (res.status === "crashed" && stderr.length === 0) stderr.push(msgs.current.crashed);
		return { stdout: stdout.join("\n").trim(), stderr: stderr.join("\n"), events, status: res.status };
	}, []);

	return { state, capture };
}
