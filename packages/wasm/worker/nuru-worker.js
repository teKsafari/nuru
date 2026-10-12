/*
 * Nuru Web Worker.
 *
 * Runs the Nuru interpreter off the main thread so that:
 *   - an infinite loop never freezes the page (the host terminates the worker),
 *   - jaza() can block for real input (SharedArrayBuffer + Atomics.wait),
 *   - kobe/ubao events and muda.lala sleeps stream in real time.
 *
 * Protocol (host -> worker):
 *   { type: "init", wasmURL, execURL, inputBuffer? }
 *   { type: "run", code, stdin?: string[], interactive?: boolean }
 * Protocol (worker -> host):
 *   { type: "ready" }
 *   { type: "out", text, isError }
 *   { type: "event", event }          // kobe / ubao drawing events
 *   { type: "input", prompt }         // jaza() is waiting
 *   { type: "done", ms }
 *   { type: "fatal", message }
 *
 * Input buffer layout (SharedArrayBuffer): Int32[0] = state, Int32[1] = byte length,
 * bytes from offset 8 = UTF-8 text. state: 0 idle, 1 waiting, 2 ready, 3 cancelled.
 */

/* global Go */

const ANSI = /\x1b\[[0-9;]*m/g;

let control = null;
let bytes = null;
let interactive = false;
let startedAt = 0;
let batch = [];
let flushTimer = null;

// Batch messages so a tight andika() loop doesn't flood the main thread.
function send(msg) {
	batch.push(msg);
	if (batch.length >= 200) return flush();
	if (!flushTimer) flushTimer = setTimeout(flush, 16);
}

function flush() {
	if (flushTimer) {
		clearTimeout(flushTimer);
		flushTimer = null;
	}
	if (batch.length === 0) return;
	const msgs = batch;
	batch = [];
	self.postMessage({ type: "batch", msgs });
}

self.nuruOutputReceiver = (text, isError) => {
	send({ type: "out", text: String(text).replace(ANSI, ""), isError: !!isError });
};

self.nuruEvent = (event) => {
	send({ type: "event", event: Object.assign({}, event) });
};

self.nuruDone = () => {
	send({ type: "done", ms: Math.round(performance.now() - startedAt) });
	flush();
};

// jaza() with an empty stdin buffer lands here.
self.prompt = (message) => {
	flush();
	if (!interactive || !control) {
		self.postMessage({ type: "input", prompt: message == null ? "" : String(message), blocking: false });
		return null;
	}
	Atomics.store(control, 0, 1);
	self.postMessage({ type: "input", prompt: message == null ? "" : String(message), blocking: true });
	Atomics.wait(control, 0, 1);
	const state = Atomics.load(control, 0);
	if (state !== 2) {
		Atomics.store(control, 0, 0);
		return null;
	}
	const len = Atomics.load(control, 1);
	const text = new TextDecoder().decode(bytes.slice(0, len));
	Atomics.store(control, 0, 0);
	return text;
};

async function init({ wasmURL, execURL, inputBuffer }) {
	importScripts(execURL);
	if (inputBuffer) {
		control = new Int32Array(inputBuffer, 0, 2);
		bytes = new Uint8Array(inputBuffer, 8);
	}
	const go = new Go();
	let result;
	try {
		result = await WebAssembly.instantiateStreaming(fetch(wasmURL), go.importObject);
	} catch (e) {
		// Some servers send the wrong MIME type; fall back to an ArrayBuffer.
		const buf = await (await fetch(wasmURL)).arrayBuffer();
		result = await WebAssembly.instantiate(buf, go.importObject);
	}
	self.nuruReady = () => self.postMessage({ type: "ready" });
	go.run(result.instance);
}

self.onmessage = (e) => {
	const msg = e.data;
	if (msg.type === "init") {
		init(msg).catch((err) => self.postMessage({ type: "fatal", message: String(err && err.message ? err.message : err) }));
	} else if (msg.type === "run") {
		interactive = !!msg.interactive && !!control;
		startedAt = performance.now();
		try {
			self.runCode(msg.code, Array.isArray(msg.stdin) ? msg.stdin : undefined);
		} catch (err) {
			self.postMessage({ type: "fatal", message: String(err && err.message ? err.message : err) });
		}
	}
};

self.onerror = (err) => {
	self.postMessage({ type: "fatal", message: String(err && err.message ? err.message : err) });
};
