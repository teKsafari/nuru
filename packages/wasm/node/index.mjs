// Run Nuru programs from Node (tests, lesson verification, seeding).
//
//   import { createNodeRunner } from "@nuru/wasm/node";
//   const nuru = createNodeRunner();
//   const { stdout, stderr, status } = await nuru.run('andika("Habari")');
//   nuru.close();
import { Worker } from "node:worker_threads";
import { fileURLToPath } from "node:url";
import path from "node:path";

const here = path.dirname(fileURLToPath(import.meta.url));

export function createNodeRunner({
	wasmPath = path.join(here, "../worker/nuru.wasm"),
	execPath = path.join(here, "../worker/wasm_exec.js"),
	timeoutMs = 4000,
} = {}) {
	let worker = null;
	let ready = null;
	let queue = Promise.resolve();

	function spawn() {
		worker = new Worker(path.join(here, "worker-thread.cjs"), { workerData: { wasmPath, execPath } });
		ready = new Promise((resolve, reject) => {
			worker.once("message", (m) => (m.type === "ready" ? resolve() : reject(m)));
			worker.once("error", reject);
		});
	}

	async function runOne(code, stdin) {
		if (!worker) spawn();
		await ready;
		return new Promise((resolve) => {
			const w = worker;
			const timer = setTimeout(() => {
				w.removeAllListeners("message");
				w.terminate();
				worker = null;
				resolve({ status: "timeout", stdout: "", stderr: "", lines: [], events: [] });
			}, timeoutMs);
			w.once("error", (err) => {
				clearTimeout(timer);
				worker = null;
				resolve({ status: "crashed", stdout: "", stderr: String(err), lines: [], events: [] });
			});
			w.once("message", (m) => {
				clearTimeout(timer);
				w.removeAllListeners("error");
				const stdout = m.lines.filter((l) => !l.isError).map((l) => l.text).join("\n");
				const stderr = m.lines.filter((l) => l.isError).map((l) => l.text).join("\n");
				const all = m.lines.map((l) => l.text).join("\n");
				resolve({ status: "ok", stdout, stderr, output: all, lines: m.lines, events: m.events });
			});
			w.postMessage({ code, stdin });
		});
	}

	return {
		run(code, stdin) {
			const next = queue.then(() => runOne(code, stdin));
			queue = next.catch(() => {});
			return next;
		},
		close() {
			worker?.terminate();
			worker = null;
		},
	};
}
