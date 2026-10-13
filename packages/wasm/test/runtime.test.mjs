import { test, after } from "node:test";
import assert from "node:assert/strict";
import { createNodeRunner } from "../node/index.mjs";

const nuru = createNodeRunner({ timeoutMs: 3000 });
after(() => nuru.close());

test("andika prints", async () => {
	const r = await nuru.run('andika("Habari, Dunia!")');
	assert.equal(r.stdout, "Habari, Dunia!");
});

test("jaza reads stdin lines in order", async () => {
	const r = await nuru.run('fanya a = jaza("?")\nfanya b = jaza()\nandika(a + b)', ["Nu", "ru"]);
	assert.equal(r.stdout, "Nuru");
});

test("parse errors are Swahili and flagged as errors", async () => {
	const r = await nuru.run("andika(");
	assert.match(r.stderr, /Kuna makosa yafuatayo/);
});

test("kobe draws a closed square", async () => {
	const r = await nuru.run("tumia kobe\nkwa i ktk mfululizo(4) {\n kobe.mbele(50)\n kobe.kulia(90)\n}\nandika(kobe.mahali())");
	assert.equal(r.events.filter((e) => e.t === "line").length, 4);
	assert.equal(r.stdout, "[0, 0]");
});

test("kobe rejects unknown colours in Swahili", async () => {
	const r = await nuru.run('tumia kobe\nkobe.rangi("purple")');
	assert.match(r.stderr, /Sijui rangi/);
});

test("ubao toggles LEDs and validates range", async () => {
	const r = await nuru.run("tumia ubao\nubao.washa(3)\nandika(ubao.imewaka(3))\nubao.washa(12)");
	assert.equal(r.stdout, "kweli");
	assert.match(r.stderr, /taa 1 hadi 8/);
});

test("runaway programs time out instead of hanging", async () => {
	const r = await nuru.run("fanya i = 0\nwakati (i >= 0) { i++ }");
	// Either our timeout kills it or Nuru's own loop guard reports it.
	assert.ok(r.status === "timeout" || /mzunguko usio na mwisho/.test(r.stderr), JSON.stringify(r));
	const again = await nuru.run('andika("bado niko hai")');
	assert.equal(again.stdout, "bado niko hai");
});

// jaza() asks globalThis.prompt when stdin runs out. The browser worker's
// prompt returns the learner's answer as typed; null means "no answer".
async function withPrompt(answer, code) {
	const { Worker } = await import("node:worker_threads");
	const { fileURLToPath } = await import("node:url");
	const dir = fileURLToPath(new URL("../worker/", import.meta.url));
	const src = `
		const { parentPort, workerData } = require("node:worker_threads");
		const fs = require("node:fs");
		require(workerData.dir + "wasm_exec.js");
		const lines = [];
		globalThis.nuruOutputReceiver = (t, e) => lines.push({ text: String(t), isError: !!e });
		globalThis.nuruEvent = () => {};
		globalThis.prompt = () => workerData.answer;
		globalThis.nuruDone = () => parentPort.postMessage(lines);
		globalThis.nuruReady = () => globalThis.runCode(workerData.code);
		const go = new Go();
		WebAssembly.instantiate(fs.readFileSync(workerData.dir + "nuru.wasm"), go.importObject).then(({ instance }) => go.run(instance));
	`;
	const w = new Worker(src, { eval: true, workerData: { dir, answer, code } });
	try {
		const lines = await new Promise((resolve, reject) => {
			w.once("message", resolve);
			w.once("error", reject);
			setTimeout(() => reject(new Error("timeout")), 5000);
		});
		return {
			stdout: lines.filter((l) => !l.isError).map((l) => l.text).join("\n"),
			stderr: lines.filter((l) => l.isError).map((l) => l.text).join("\n"),
		};
	} finally {
		await w.terminate();
	}
}

test("jaza returns an empty string for an empty answer", async () => {
	const r = await withPrompt("", 'fanya j = jaza("?")\nandika("[" + j + "]")');
	assert.equal(r.stderr, "");
	assert.equal(r.stdout, "[]");
});

test("jaza returns the word null when the learner types it", async () => {
	const r = await withPrompt("null", 'andika(jaza("?"))');
	assert.equal(r.stdout, "null");
});

test("jaza with no answer at all (prompt returns null) is still an error", async () => {
	const r = await withPrompt(null, 'andika(jaza("?"))');
	assert.match(r.stderr, /Nimeshindwa kusoma/);
});

test("jaza with exhausted stdin in the Node runner is still an error", async () => {
	const r = await nuru.run('fanya a = jaza()\nfanya b = jaza()\nandika(a + b)', ["x"]);
	assert.match(r.stderr, /Nimeshindwa kusoma/);
});

test("empty stdin lines are answers too", async () => {
	const r = await nuru.run('andika("[" + jaza() + "]")', [""]);
	assert.equal(r.stdout, "[]");
});
