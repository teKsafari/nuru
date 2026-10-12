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
	} | null = null;

	constructor(config: RuntimeConfig) {
		this.config = config;
	}

	get isRunning() {
		return this.current !== null;
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
				this.finish("crashed");
			};
		});

		worker.postMessage({
			type: "init",
			wasmURL: new URL(this.config.wasmURL, location.href).href,
			execURL: new URL(this.config.execURL, location.href).href,
			inputBuffer: this.inputBuffer,
		});

		this.ready.catch(() => this.reset());
		return this.ready;
	}

	async run(code: string, opts: RunOptions = {}): Promise<RunResult> {
		if (this.current) this.stop();
		await this.warmUp();

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
		this.kill("stopped");
	}

	dispose() {
		this.kill("stopped");
	}

	private kill(status: RunStatus) {
		const wasRunning = this.current !== null;
		this.reset();
		if (wasRunning) this.finish(status);
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
				cur.opts.onOutput?.(msg.text, msg.isError);
				break;
			case "event":
				cur.opts.onEvent?.(msg.event);
				break;
			case "input":
				cur.pendingPrompt = msg.prompt;
				if (msg.blocking) cur.opts.onInputRequest?.(msg.prompt);
				break;
			case "done":
				// A non-blocking jaza() returned null; the program then failed on purpose.
				if (cur.pendingPrompt !== undefined && !this.inputBuffer) {
					this.finish("needs-input", cur.pendingPrompt);
				} else {
					this.finish("ok");
				}
				break;
			case "fatal":
				cur.opts.onOutput?.(msg.message, true);
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
