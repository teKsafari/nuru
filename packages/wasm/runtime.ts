// Worker-backed Nuru runtime. Browser only.
//
// Unlike the legacy `init()` API in index.ts, programs run inside a Web Worker:
// infinite loops can be stopped, jaza() asks for real input, and kobe/ubao
// events stream to the page while the program runs.

export type KobeEvent =
	| { ch: "kobe"; t: "line"; x1: number; y1: number; x2: number; y2: number; c: string; w: number }
	| { ch: "kobe"; t: "move"; x: number; y: number }
	| { ch: "kobe"; t: "turn"; h: number }
	| { ch: "kobe"; t: "circle"; x: number; y: number; r: number; c: string; w: number; f: string | null }
	| { ch: "kobe"; t: "dot"; x: number; y: number; r: number; c: string }
	| { ch: "kobe"; t: "text"; x: number; y: number; s: string; c: string; size: number }
	| { ch: "kobe"; t: "fill"; pts: number[]; c: string }
	| { ch: "kobe"; t: "bg"; c: string }
	| { ch: "kobe"; t: "speed"; v: number }
	| { ch: "kobe"; t: "clear" | "hide" | "show" };

export type UbaoEvent =
	| { ch: "ubao"; t: "led"; i: number; on: boolean }
	| { ch: "ubao"; t: "color"; i: number; c: string }
	| { ch: "ubao"; t: "beep"; f: number; ms: number }
	| { ch: "ubao"; t: "lcd"; s: string };

export type NuruEvent = KobeEvent | UbaoEvent;

export type RunStatus = "ok" | "stopped" | "timeout" | "crashed" | "needs-input";

export interface RunResult {
	status: RunStatus;
	ms: number;
	/** Set when status is "needs-input": the prompt jaza() was called with. */
	prompt?: string;
}

export interface RunOptions {
	/** Lines handed to jaza() before it asks the user. */
	stdin?: string[];
	/** When true (and the page is cross-origin isolated) jaza() waits for provideInput(). */
	interactive?: boolean;
	/** Kill the program after this many ms. 0 disables the limit. */
	timeoutMs?: number;
	onOutput?: (text: string, isError: boolean) => void;
	onEvent?: (event: NuruEvent) => void;
	onInputRequest?: (prompt: string) => void;
}

export interface RuntimeConfig {
	workerURL: string;
	wasmURL: string;
	execURL: string;
}

type WorkerMsg =
	| { type: "ready" }
	| { type: "out"; text: string; isError: boolean }
	| { type: "event"; event: NuruEvent }
	| { type: "input"; prompt: string; blocking: boolean }
	| { type: "done"; ms: number }
	| { type: "fatal"; message: string }
	| { type: "batch"; msgs: WorkerMsg[] };

const INPUT_BYTES = 64 * 1024;

// The interpreter's stack holds about 200 nested Nuru calls. Past that the wasm
// traps with an engine message that means nothing to a learner.
export function explainCrash(message: string): string {
	if (/unreachable|out of bounds|stack|recursion/i.test(message)) {
		return "Kosa: programu imeishiwa nafasi. Mara nyingi hii ni kitendakazi kinachojiita bila kufika mwisho, au kujirudia kwa kina zaidi ya hatua 200. Hakikisha kina sharti la kusimama (kama n == 0 { rudisha ... }).";
	}
	return `Kosa la ndani: ${message}`;
}

const modules = new Map<string, Promise<WebAssembly.Module | null>>();

/** Compiles the interpreter once per page. Resolves null if the browser can't (the worker then fetches it). */
function compiledModule(url: string): Promise<WebAssembly.Module | null> {
	let p = modules.get(url);
	if (!p) {
		p = (async () => {
			try {
				const res = await fetch(url);
				if (!res.ok) return null;
				const viaStreaming = typeof WebAssembly.compileStreaming === "function" && res.headers.get("content-type")?.includes("application/wasm");
				return viaStreaming ? await WebAssembly.compileStreaming(res) : await WebAssembly.compile(await res.arrayBuffer());
			} catch {
				return null;
			}
		})();
		p.then((m) => {
			if (!m) modules.delete(url);
		});
		modules.set(url, p);
	}
	return p;
}

export function canBlockForInput(): boolean {
	return typeof SharedArrayBuffer !== "undefined" && (globalThis as any).crossOriginIsolated === true;
}

export class NuruRuntime {
	private config: RuntimeConfig;
	private worker: Worker | null = null;
	private ready: Promise<void> | null = null;
	private inputBuffer: SharedArrayBuffer | null = null;
	private current: {
		opts: RunOptions;
		resolve: (r: RunResult) => void;
		startedAt: number;
		timer?: ReturnType<typeof setTimeout>;
		pendingPrompt?: string;
		/** jaza() found no input and could not block: the run will end as "needs-input". */
		replay?: boolean;
	} | null = null;
	/** Bumped by every run(), stop() and dispose(): a run still waiting for the worker checks it. */
	private gen = 0;
	/** A run() is waiting for warmUp() and has not posted to the worker yet. */
	private starting = false;
	/** Ends the wait of a run() that is still starting. */
	private cancelStart: (() => void) | null = null;

	constructor(config: RuntimeConfig) {
		this.config = config;
	}

	get isRunning() {
		return this.current !== null || this.starting;
	}

	get interactiveInput() {
		return this.inputBuffer !== null;
	}

	/** Spawns the worker and loads the wasm binary. Safe to call repeatedly. */
	warmUp(): Promise<void> {
		if (this.ready) return this.ready;

		if (canBlockForInput()) {
			this.inputBuffer = new SharedArrayBuffer(8 + INPUT_BYTES);
		}

		const worker = new Worker(this.config.workerURL);
		this.worker = worker;
		const wasmURL = new URL(this.config.wasmURL, location.href).href;
		const inputBuffer = this.inputBuffer;

		this.ready = new Promise<void>((resolve, reject) => {
			worker.onmessage = (e: MessageEvent<WorkerMsg>) => {
				const msg = e.data;
				if (msg.type === "ready") return resolve();
				if (msg.type === "fatal" && !this.current) return reject(new Error(msg.message));
				this.handle(msg);
			};
			worker.onerror = (e) => {
				if (!this.current) return reject(new Error(e.message || "Nuru worker failed to start"));
				e.preventDefault();
				this.current.opts.onOutput?.(explainCrash(e.message || ""), true);
				this.reset();
				this.finish("crashed");
			};
			// Every fresh worker (after Stop or a timeout) reuses the compiled module,
			// so restarting costs an instantiate, not a download and compile.
			compiledModule(wasmURL).then((module) => {
				if (this.worker !== worker) return reject(new Error("Nuru worker was replaced"));
				worker.postMessage({
					type: "init",
					wasmURL,
					execURL: new URL(this.config.execURL, location.href).href,
					inputBuffer,
					module,
				});
			});
		});

		this.ready.catch(() => {
			if (this.worker === worker) this.reset();
		});
		return this.ready;
	}

	async run(code: string, opts: RunOptions = {}): Promise<RunResult> {
		if (this.current) this.stop();
		// Claim the run before awaiting, so a second run() or a stop() during the
		// warm-up supersedes this one instead of both posting to the worker.
		this.cancelStart?.();
		const gen = ++this.gen;
		this.starting = true;
		const startedAt = performance.now();
		const cancelled = new Promise<void>((resolve) => {
			this.cancelStart = resolve;
		});
		try {
			await Promise.race([this.warmUp(), cancelled]);
		} finally {
			if (gen === this.gen) {
				this.starting = false;
				this.cancelStart = null;
			}
		}
		if (gen !== this.gen) return { status: "stopped", ms: Math.round(performance.now() - startedAt) };

		return new Promise<RunResult>((resolve) => {
			this.current = { opts, resolve, startedAt: performance.now() };
			const timeoutMs = opts.timeoutMs ?? 0;
			if (timeoutMs > 0) {
				this.current.timer = setTimeout(() => this.kill("timeout"), timeoutMs);
			}
			this.worker!.postMessage({
				type: "run",
				code,
				stdin: opts.stdin,
				interactive: !!opts.interactive && this.inputBuffer !== null,
			});
		});
	}

	/** Answers a pending jaza(). */
	provideInput(text: string) {
		if (!this.inputBuffer) return;
		const control = new Int32Array(this.inputBuffer, 0, 2);
		const bytes = new Uint8Array(this.inputBuffer, 8);
		const encoded = new TextEncoder().encode(text).slice(0, INPUT_BYTES);
		bytes.set(encoded);
		Atomics.store(control, 1, encoded.length);
		Atomics.store(control, 0, 2);
		Atomics.notify(control, 0);
		if (this.current) this.current.pendingPrompt = undefined;
	}

	/** Stops the running program. The next run() starts a fresh worker. */
	stop() {
		this.supersedeStart();
		// A worker that is still warming up is kept: the next run() needs it.
		if (this.current) this.kill("stopped");
	}

	dispose() {
		this.supersedeStart();
		this.kill("stopped", false);
	}

	private supersedeStart() {
		this.gen++;
		this.starting = false;
		const cancel = this.cancelStart;
		this.cancelStart = null;
		cancel?.();
	}

	private kill(status: RunStatus, rewarm = true) {
		const wasRunning = this.current !== null;
		this.reset();
		if (wasRunning) this.finish(status);
		// Have a fresh worker ready before the learner presses Endesha again.
		if (wasRunning && rewarm) this.warmUp().catch(() => {});
	}

	private reset() {
		this.worker?.terminate();
		this.worker = null;
		this.ready = null;
		this.inputBuffer = null;
	}

	private handle(msg: WorkerMsg) {
		if (msg.type === "batch") {
			for (const m of msg.msgs) this.handle(m);
			return;
		}
		const cur = this.current;
		if (!cur) return;
		switch (msg.type) {
			case "out":
				// After a non-blocking jaza() the only output left is the interpreter
				// complaining that it got no answer. The host re-runs with stdin instead.
				if (cur.replay) break;
				cur.opts.onOutput?.(msg.text, msg.isError);
				break;
			case "event":
				if (cur.replay) break;
				cur.opts.onEvent?.(msg.event);
				break;
			case "input":
				if (cur.replay) break;
				cur.pendingPrompt = msg.prompt;
				if (msg.blocking) {
					cur.opts.onInputRequest?.(msg.prompt);
				} else {
					// jaza() could not wait. The interpreter would carry on with a
					// failed answer (and may loop forever), so end the run here; the
					// host re-runs it with the answer as stdin.
					cur.replay = true;
					this.reset();
					this.finish("needs-input", msg.prompt);
					this.warmUp().catch(() => {});
				}
				break;
			case "done":
				// A non-blocking jaza() returned null; the program then failed on purpose.
				if (cur.replay) {
					this.finish("needs-input", cur.pendingPrompt);
				} else {
					this.finish("ok");
				}
				break;
			case "fatal":
				cur.opts.onOutput?.(explainCrash(msg.message), true);
				this.reset();
				this.finish("crashed");
				break;
		}
	}

	private finish(status: RunStatus, prompt?: string) {
		const cur = this.current;
		if (!cur) return;
		this.current = null;
		if (cur.timer) clearTimeout(cur.timer);
		cur.resolve({ status, ms: Math.round(performance.now() - cur.startedAt), prompt });
	}
}
