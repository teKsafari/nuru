import { ExecutionEvent, IExecutor } from "@/types/executor";

export class NuruExecutor implements IExecutor {
	private nuruInstance: any;
	private eventQueue: ExecutionEvent[] = [];
	private resolveNextEvent: (() => void) | null = null;
	private isExecutionDone = false;
	private _isExecuting = false;

	constructor(nuruInstance: any) {
		this.nuruInstance = nuruInstance;
	}

	setInstance(nuruInstance: any) {
		this.nuruInstance = nuruInstance;
	}

	isExecuting() {
		return this._isExecuting;
	}

	/**
	 * This method should be called by the output receiver passed to useNuru
	 */
	handleOutput(text: string, isError: boolean) {
		this.pushEvent({ type: isError ? "stderr" : "stdout", data: text });
	}

	private pushEvent(event: ExecutionEvent) {
		this.eventQueue.push(event);
		if (this.resolveNextEvent) {
			this.resolveNextEvent();
			this.resolveNextEvent = null;
		}
	}

	async *execute(code: string, stdin?: string): AsyncGenerator<ExecutionEvent, void, unknown> {
		this.eventQueue = [];
		this.isExecutionDone = false;
		this._isExecuting = true;

		const executionPromise = (async () => {
			try {
				const stdinBuffer = stdin ? stdin.split("\n") : undefined;
				await this.nuruInstance.execute(code, stdinBuffer);
				this.pushEvent({ type: "finished", exitCode: 0 });
			} catch (error: any) {
				this.pushEvent({ type: "stderr", data: error.toString() });
				this.pushEvent({ type: "finished", exitCode: 1 });
			} finally {
				this.isExecutionDone = true;
				this._isExecuting = false;
				if (this.resolveNextEvent) {
					this.resolveNextEvent();
					this.resolveNextEvent = null;
				}
			}
		})();

		while (!this.isExecutionDone || this.eventQueue.length > 0) {
			if (this.eventQueue.length > 0) {
				yield this.eventQueue.shift()!;
			} else {
				await new Promise<void>((resolve) => {
					this.resolveNextEvent = resolve;
				});
			}
		}
	}

	stop(): void {
		// Nuru WASM stop logic if available
	}
}
