// Copies the Nuru worker runtime into public/nuru so it is served same-origin
// (Web Workers and SharedArrayBuffer both require that), and stamps this build.
//
// public/nuru/version.json (git-ignored with the runtime) holds:
//   runtime  a content hash of the three runtime files. The runtime URLs carry it
//            (/nuru/nuru.wasm?v=<runtime>), so a deploy that changes the runtime
//            misses every cache and the worker, wasm_exec.js and wasm stay a set.
//   build    the Next build id (next.config.mjs passes it to generateBuildId) and
//            the service worker's cache version, so each deploy replaces the
//            previous deploy's caches instead of piling up on top of them.
// next.config.mjs reads this file and exposes both values to the client.
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const src = path.join(here, "../../../packages/wasm/worker");
const dest = path.join(here, "../public/nuru");
const FILES = ["nuru-worker.js", "wasm_exec.js", "nuru.wasm"];

fs.mkdirSync(dest, { recursive: true });
const hash = crypto.createHash("sha256");
for (const f of FILES) {
	const buf = fs.readFileSync(path.join(src, f));
	fs.writeFileSync(path.join(dest, f), buf);
	hash.update(f).update("\0").update(buf);
}
const runtime = hash.digest("hex").slice(0, 12);

// A fresh id per build (and per dev start). NURU_BUILD_ID pins it, e.g. to a git sha.
const build = (process.env.NURU_BUILD_ID || `${Date.now().toString(36)}${crypto.randomBytes(3).toString("hex")}`).replace(/[^A-Za-z0-9_-]/g, "");
fs.writeFileSync(path.join(dest, "version.json"), `${JSON.stringify({ runtime, build })}\n`);

console.log(`Nuru runtime ${runtime} copied to ${path.relative(process.cwd(), dest)} (build ${build})`);
