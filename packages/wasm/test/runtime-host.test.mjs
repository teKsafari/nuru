// NuruRuntime (dist/runtime.js, run `pnpm build` first) against a fake Worker.
import { test } from "node:test";
import assert from "node:assert/strict";

globalThis.location = { href: "http://localhost/" };
globalThis.fetch = async () => ({ ok: false });

let posted = [];
class FakeWorker {
	constructor() {
		this.dead = false;
	}
	postMessage(m) {
		posted.push(m.type);
		// Warm-up takes a while, as on a phone; a run finishes quickly.
		if (m.type === "init") setTimeout(() => !this.dead && this.onmessage({ data: { type: "ready" } }), 50);
		if (m.type === "run") setTimeout(() => !this.dead && this.onmessage({ data: { type: "done", ms: 1 } }), 10);
	}
	terminate() {
		this.dead = true;
	}
}
globalThis.Worker = FakeWorker;

const { NuruRuntime } = await import("../dist/runtime.js");
const config = { workerURL: "w.js", wasmURL: "n.wasm", execURL: "e.js" };

test("a second run() during warm-up supersedes the first", async () => {
	posted = [];
	const rt = new NuruRuntime(config);
	const first = rt.run("andika(1)");
	const second = rt.run("andika(2)");
	assert.equal((await first).status, "stopped");
	assert.equal((await second).status, "ok");
	assert.equal(posted.filter((t) => t === "run").length, 1);
});

test("stop() during warm-up cancels the run and keeps the worker", async () => {
	posted = [];
	const rt = new NuruRuntime(config);
	const run = rt.run("andika(1)");
	assert.equal(rt.isRunning, true);
	rt.stop();
	assert.equal((await run).status, "stopped");
	assert.equal(rt.isRunning, false);
	assert.equal(posted.filter((t) => t === "run").length, 0);
	assert.equal((await rt.run("andika(2)")).status, "ok");
	assert.equal(posted.filter((t) => t === "init").length, 1);
});
