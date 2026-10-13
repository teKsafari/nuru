// Runs every Kamusi example (and the landing page programs) against the real
// Nuru wasm build and checks the printed output.
//   cd apps/playground && pnpm exec tsx "app/(main)/[lang]/kamusi/hakiki-mifano.mts"
import { createNodeRunner } from "../../../../../../packages/wasm/node/index.mjs";
import type { Mfano } from "./mifano.ts";

// tsx loads these .ts files as CommonJS; read the exports either way.
const load = async (p: string) => {
	const mod = (await import(p)) as { default?: unknown } & Record<string, unknown>;
	return mod.default ?? mod;
};
const { sehemu } = await load("./mifano.ts");
const { heroPrograms } = await load("../../../../components/tovuti/hero-programs.ts");

const cases: { jina: string; m: Mfano }[] = [];
for (const s of sehemu as import("./mifano.ts").Sehemu[]) {
	let n = 0;
	for (const k of s.vipande) if (k.aina === "mfano") cases.push({ jina: `${s.id} #${++n}`, m: k.mfano });
}
for (const h of heroPrograms as { faili: string; code: string; matokeo: string }[]) cases.push({ jina: `hero ${h.faili}`, m: { code: h.code, matokeo: h.matokeo } });

const norm = (s: string) => s.replace(/\s+$/g, "").replace(/^\n+/, "");
let failed = 0;
for (const { jina, m } of cases) {
	const nuru = createNodeRunner({ timeoutMs: 8000 });
	const r = await nuru.run(m.code, m.ingizo);
	nuru.close();
	const got = norm(r.output ?? "");
	let ok = r.status === "ok";
	if (m.muundo) ok &&= m.muundo.test(got);
	else if (m.mpangilioWowote) ok &&= got.split("\n").sort().join("\n") === norm(m.matokeo).split("\n").sort().join("\n");
	else ok &&= got === norm(m.matokeo);
	if (m.mode) ok &&= (r.events?.length ?? 0) > 0 && !(r.stderr ?? "").trim();
	if (!ok) {
		failed++;
		console.log(`FAIL ${jina} [${r.status}]\n--- expected\n${m.matokeo}\n--- got\n${got}\n`);
	} else console.log(`ok   ${jina}${m.mode ? ` (${r.events.length} events)` : ""}`);
}
console.log(`\n${cases.length - failed}/${cases.length} passed`);
process.exit(failed ? 1 : 0);
