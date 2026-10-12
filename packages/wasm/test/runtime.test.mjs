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
