export type ExecutionEvent =
	| { type: "stdout"; data: string }
	| { type: "stderr"; data: string }
	| { type: "visualization_event"; action: string; target: string; payload?: any }
	| { type: "memory_update"; address: string; value: any }
	| { type: "finished"; exitCode?: number };

export interface IExecutor {
	execute(code: string): AsyncGenerator<ExecutionEvent, void, unknown>;
	stop(): void;
}
