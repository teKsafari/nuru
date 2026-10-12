// Copies the Nuru worker runtime into public/nuru so it is served same-origin
// (Web Workers and SharedArrayBuffer both require that).
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const src = path.join(here, "../../../packages/wasm/worker");
const dest = path.join(here, "../public/nuru");

fs.mkdirSync(dest, { recursive: true });
for (const f of ["nuru-worker.js", "wasm_exec.js", "nuru.wasm"]) {
	fs.copyFileSync(path.join(src, f), path.join(dest, f));
}
console.log(`Nuru runtime copied to ${path.relative(process.cwd(), dest)}`);
