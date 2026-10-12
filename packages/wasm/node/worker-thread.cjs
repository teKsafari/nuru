// Node worker_threads host for the Nuru wasm build. Mirrors worker/nuru-worker.js
// without interactive input: jaza() reads only from the supplied stdin lines.
const { parentPort, workerData } = require("node:worker_threads");
const fs = require("node:fs");

require(workerData.execPath);

const ANSI = /\x1b\[[0-9;]*m/g;
let lines = [];
let events = [];
let resolveDone = null;

globalThis.nuruOutputReceiver = (text, isError) => {
	lines.push({ text: String(text).replace(ANSI, ""), isError: !!isError });
};
globalThis.nuruEvent = (ev) => events.push(Object.assign({}, ev));
globalThis.prompt = () => null;
globalThis.nuruDone = () => resolveDone && resolveDone();

const ready = new Promise((resolve) => {
	globalThis.nuruReady = resolve;
});

(async () => {
	const go = new Go();
	const { instance } = await WebAssembly.instantiate(fs.readFileSync(workerData.wasmPath), go.importObject);
	go.run(instance);
	await ready;
	parentPort.postMessage({ type: "ready" });
})();

parentPort.on("message", async ({ code, stdin }) => {
	lines = [];
	events = [];
	const done = new Promise((r) => (resolveDone = r));
	globalThis.runCode(code, stdin || undefined);
	await done;
	parentPort.postMessage({ type: "result", lines, events });
});
