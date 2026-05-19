import { ExecutionEvent, IExecutor } from "@/types/executor";

export class MockExecutor implements IExecutor {
	private isStopped = false;

	async *execute(code: string): AsyncGenerator<ExecutionEvent, void, unknown> {
		this.isStopped = false;

		// Simulate some standard output
		yield { type: "stdout", data: "Starting mock execution..." };
		await new Promise(r => setTimeout(r, 500));

		if (this.isStopped) return;

		// If it's a memory simulation, emit some memory events
		if (code.includes("memory")) {
			yield { type: "memory_update", address: "0x1000", value: 42 };
			await new Promise(r => setTimeout(r, 300));
			yield { type: "memory_update", address: "0x1004", value: 100 };
		}

		// If it's a 3D test, emit some visualization events
		if (code.includes("canvas") || code.includes("washa")) {
			yield { type: "visualization_event", action: "washa", target: "taa" };
		}

		yield { type: "stdout", data: "Execution finished." };
		yield { type: "finished", exitCode: 0 };
	}

	stop(): void {
		this.isStopped = true;
	}
}
