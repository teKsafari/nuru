/*
 * Nuru Web Worker.
 *
 * Runs the Nuru interpreter off the main thread so that:
 *   - an infinite loop never freezes the page (the host terminates the worker),
 *   - jaza() can block for real input (SharedArrayBuffer + Atomics.wait),
 *   - kobe/ubao events and muda.lala sleeps stream in real time.
 *
 * Protocol (host -> worker):
 *   { type: "init", wasmURL, execURL, inputBuffer?, module? }   // module: a compiled WebAssembly.Module
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
// After a wasm trap the instance is unusable: report it once and run nothing more.
let broken = false;

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

// ubao LED state needs no reset here: main.go clears it at the start of every
// run, and the host clears the board UI before each run.
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

async function init({ wasmURL, execURL, inputBuffer, module }) {
	importScripts(execURL);
	if (inputBuffer) {
		control = new Int32Array(inputBuffer, 0, 2);
		bytes = new Uint8Array(inputBuffer, 8);
	}
	const go = new Go();
	let instance = null;
	// The host may hand over an already compiled WebAssembly.Module.
	if (module) {
		try {
			instance = await WebAssembly.instantiate(module, go.importObject);
		} catch (e) {
			instance = null;
		}
	}
	if (!instance) {
		let result;
		try {
			result = await WebAssembly.instantiateStreaming(fetch(wasmURL), go.importObject);
		} catch (e) {
			// Some servers send the wrong MIME type; fall back to an ArrayBuffer.
			const buf = await (await fetch(wasmURL)).arrayBuffer();
			result = await WebAssembly.instantiate(buf, go.importObject);
		}
		instance = result.instance;
	}
	self.nuruReady = () => self.postMessage({ type: "ready" });
	go.run(instance);
}

// Output the program printed before a crash is still in the batch: send it
// first, because the host terminates the worker as soon as it sees "fatal".
function fatal(err) {
	if (broken) return;
	broken = true;
	flush();
	self.postMessage({ type: "fatal", message: String(err && err.message ? err.message : err) });
}

self.onmessage = (e) => {
	const msg = e.data;
	if (msg.type === "init") {
		init(msg).catch(fatal);
	} else if (msg.type === "run") {
		startRun(msg);
	}
};

function startRun(msg) {
	if (broken) return;
	interactive = !!msg.interactive && !!control;
	startedAt = performance.now();
	try {
		self.runCode(msg.code, Array.isArray(msg.stdin) ? msg.stdin : undefined);
	} catch (err) {
		fatal(err);
	}
}

// Traps that fire later (after muda.lala or ubao.subiri) land here. Returning
// true keeps the error from also reaching the host's worker.onerror, which could
// overtake the flushed output and the "fatal" message.
self.onerror = (err) => {
	fatal(err);
	return true;
};
