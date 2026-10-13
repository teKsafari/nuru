// The Nuru runtime's content hash, stamped by scripts/copy-runtime.mjs and inlined
// by next.config.mjs (env.NURU_RUNTIME_VERSION). Load the runtime through these
// URLs: a deploy that changes the runtime changes them, so the browser and the
// service worker never pair a new page with an old worker, wasm_exec.js or wasm.

export const RUNTIME_VERSION = process.env.NURU_RUNTIME_VERSION || "";

const v = RUNTIME_VERSION ? `?v=${RUNTIME_VERSION}` : "";

export const RUNTIME_URLS = {
	workerURL: `/nuru/nuru-worker.js${v}`,
	wasmURL: `/nuru/nuru.wasm${v}`,
	execURL: `/nuru/wasm_exec.js${v}`,
};
