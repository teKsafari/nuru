"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { KobeEvent, NuruEvent, RunStatus, UbaoEvent } from "@nuru/wasm/runtime";
import type { RunCapture } from "@nuru/ui/validation/grader";
import { useNuruRuntime } from "./use-nuru-runtime";
import { EventBus } from "./program-bus";

export type LineKind = "out" | "err" | "answer" | "info";

export interface TermLine {
	id: number;
	text: string;
	kind: LineKind;
	/** For "answer" lines: the jaza() prompt the answer belongs to. */
	prompt?: string;
}

export type Phase = "idle" | "running" | "input";

export interface RunSummary {
	status: RunStatus;
	ms: number;
	timeoutMs?: number;
	/** The program printed an error (a Nuru kosa). */
	hadError?: boolean;
}

export interface RunVisibleOptions {
	/** 0 (default) means no limit: interactive runs rely on the Simamisha button. */
	timeoutMs?: number;
	/** false: jaza() gets no answer and the run ends (used when grading). */
	interactive?: boolean;
}

/** Test runs are killed after this long. */
export const TEST_TIMEOUT_MS = 5000;

const MAX_LINES = 4000;

/**
 * Everything a page needs to run Nuru programs: one worker runtime, a
 * terminal transcript, jaza() handling, and event buses for kobe and ubao.
 *
 * jaza() works two ways. When the page is cross-origin isolated the worker
 * blocks and waits for answer(). Otherwise the program stops at jaza(), the
 * learner answers, and the program is re-run with every answer so far as
 * stdin while the output already shown is skipped.
 */
export function useProgram() {
	const { runtime, state: runtimeState } = useNuruRuntime();
	const [lines, setLines] = useState<TermLine[]>([]);
	const [phase, setPhase] = useState<Phase>("idle");
	const [prompt, setPrompt] = useState<string | null>(null);
	const [summary, setSummary] = useState<RunSummary | null>(null);
	const [channels, setChannels] = useState<{ kobe: boolean; ubao: boolean }>({ kobe: false, ubao: false });

	const kobe = useMemo(() => new EventBus<KobeEvent>(), []);
	const ubao = useMemo(() => new EventBus<UbaoEvent>(), []);

	const nextId = useRef(1);
	const runToken = useRef(0);
	const pendingAnswer = useRef<((text: string | null) => void) | null>(null);
	const promptRef = useRef<string | null>(null);
	// Time spent waiting on the learner inside a blocking jaza(); not program time.
	const waitStart = useRef(0);
	const waited = useRef(0);

	const append = useCallback((text: string, kind: LineKind, linePrompt?: string) => {
		setLines((prev) => {
			const next = prev.length >= MAX_LINES ? prev.slice(prev.length - MAX_LINES + 1) : prev.slice();
			next.push({ id: nextId.current++, text, kind, prompt: linePrompt });
			return next;
		});
	}, []);

	const clear = useCallback(() => {
		setLines([]);
		setSummary(null);
		kobe.reset();
		ubao.reset();
		setChannels({ kobe: false, ubao: false });
	}, [kobe, ubao]);

	const routeEvent = useCallback(
		(e: NuruEvent) => {
			if (e.ch === "kobe") kobe.push([e]);
			else if (e.ch === "ubao") ubao.push([e]);
			setChannels((c) => (c[e.ch] ? c : { ...c, [e.ch]: true }));
		},
		[kobe, ubao],
	);

	const askFor = useCallback((p: string) => {
		waitStart.current = performance.now();
		promptRef.current = p;
		setPrompt(p);
		setPhase("input");
	}, []);

	/** Runs a program for the learner to watch: terminal, canvas and board. */
	const run = useCallback(
		async (code: string, opts: RunVisibleOptions = {}): Promise<RunCapture & { status: RunStatus }> => {
			const rt = runtime.current;
			const token = ++runToken.current;
			pendingAnswer.current?.(null);
			pendingAnswer.current = null;

			setLines([]);
			setSummary(null);
			setPrompt(null);
			promptRef.current = null;
			setPhase("running");
			kobe.reset();
			ubao.reset();
			setChannels({ kobe: false, ubao: false });

			const stdout: string[] = [];
			const stderr: string[] = [];
			const events: NuruEvent[] = [];
			const answers: string[] = [];
			let skipOut = 0;
			let skipEv = 0;
			let totalMs = 0;
			waited.current = 0;

			if (!rt) {
				setPhase("idle");
				return { stdout: "", stderr: "", events: [], status: "crashed" };
			}

			for (;;) {
				let outCount = 0;
				let evCount = 0;
				const res = await rt.run(code, {
					stdin: answers.length ? answers.slice() : undefined,
					interactive: opts.interactive ?? true,
					timeoutMs: opts.timeoutMs ?? 0,
					onOutput: (text, isError) => {
						if (token !== runToken.current) return;
						outCount++;
						if (outCount <= skipOut) return;
						(isError ? stderr : stdout).push(text);
						append(text, isError ? "err" : "out");
					},
					onEvent: (e) => {
						if (token !== runToken.current) return;
						evCount++;
						if (evCount <= skipEv) return;
						events.push(e);
						routeEvent(e);
					},
					onInputRequest: (p) => {
						if (token !== runToken.current) return;
						askFor(p);
					},
				});
				totalMs += Math.max(0, res.ms - waited.current);
				waited.current = 0;
				if (token !== runToken.current) {
					return { stdout: stdout.join("\n").trim(), stderr: stderr.join("\n"), events, status: "stopped" };
				}

				if (res.status === "needs-input" && opts.interactive !== false) {
					skipOut = outCount;
					skipEv = evCount;
					askFor(res.prompt ?? "");
					const answer = await new Promise<string | null>((resolve) => {
						pendingAnswer.current = resolve;
					});
					pendingAnswer.current = null;
					if (answer === null || token !== runToken.current) {
						if (token === runToken.current) {
							setPhase("idle");
							setPrompt(null);
							setSummary({ status: "stopped", ms: Math.round(totalMs) });
						}
						return { stdout: stdout.join("\n").trim(), stderr: stderr.join("\n"), events, status: "stopped" };
					}
					answers.push(answer);
					setPhase("running");
					continue;
				}

				setPhase("idle");
				setPrompt(null);
				promptRef.current = null;
				setSummary({ status: res.status, ms: Math.round(totalMs), timeoutMs: opts.timeoutMs, hadError: stderr.length > 0 });
				return { stdout: stdout.join("\n").trim(), stderr: stderr.join("\n"), events, status: res.status };
			}
		},
		[runtime, kobe, ubao, append, routeEvent, askFor],
	);

	/** Answers the jaza() the program is waiting on. */
	const answer = useCallback(
		(text: string) => {
			const p = promptRef.current ?? "";
			append(text, "answer", p);
			promptRef.current = null;
			setPrompt(null);
			setPhase("running");
			if (pendingAnswer.current) {
				pendingAnswer.current(text);
			} else {
				waited.current += performance.now() - waitStart.current;
				runtime.current?.provideInput(text);
			}
		},
		[append, runtime],
	);

	const stop = useCallback(() => {
		if (pendingAnswer.current) {
			pendingAnswer.current(null);
			pendingAnswer.current = null;
			return;
		}
		// Stopping an idle runtime would throw away its warm worker.
		if (runtime.current?.isRunning) runtime.current.stop();
	}, [runtime]);

	/** A silent run for the grader: no terminal, no renderers, 5s limit. */
	const capture = useCallback(
		async (code: string, stdin?: string[]): Promise<RunCapture & { status: RunStatus }> => {
			const rt = runtime.current;
			if (!rt) return { stdout: "", stderr: "", events: [], status: "crashed" };
			const out: string[] = [];
			const err: string[] = [];
			const events: NuruEvent[] = [];
			const res = await rt.run(code, {
				stdin,
				interactive: false,
				timeoutMs: TEST_TIMEOUT_MS,
				onOutput: (text, isError) => (isError ? err : out).push(text),
				onEvent: (e) => events.push(e),
			});
			if (res.status === "timeout") err.push(`Muda umekwisha baada ya sekunde ${TEST_TIMEOUT_MS / 1000}.`);
			return { stdout: out.join("\n").trim(), stderr: err.join("\n"), events, status: res.status };
		},
		[runtime],
	);

	// Answering with nothing pending (a stale input box) must never hang a run.
	useEffect(() => () => pendingAnswer.current?.(null), []);

	return {
		runtimeState,
		interactiveInput: runtimeState === "ready" ? !!runtime.current?.interactiveInput : false,
		lines,
		phase,
		prompt,
		summary,
		channels,
		kobe,
		ubao,
		run,
		capture,
		answer,
		stop,
		clear,
		append,
	};
}

export type Program = ReturnType<typeof useProgram>;
