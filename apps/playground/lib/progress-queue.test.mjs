// Run with: node --test apps/playground/lib/progress-queue.test.mjs
import { test } from "node:test";
import assert from "node:assert/strict";

import { bodyFor, clampCode, MAX_BATCH_ITEMS, MAX_BODY_BYTES, MAX_CODE, nextBatch, parseQueue, utf8Bytes, withoutSent } from "./progress-queue.ts";

let n = 0;
const item = (owner, code = "andika(1)", extra = {}) => ({ cid: `c${++n}`, owner, moduleId: "m", lessonId: "l", passed: false, code, ...extra });

test("utf8Bytes matches TextEncoder", () => {
	for (const s of ["", "abc", "ñ", "habari \u{1d538}", "€€", "a\ud83d", "\udc00b"]) assert.equal(utf8Bytes(s), new TextEncoder().encode(s).length, s);
});

test("clampCode keeps at most MAX_CODE characters", () => {
	assert.equal(clampCode("x".repeat(MAX_CODE + 50)).length, MAX_CODE);
	assert.equal(clampCode(undefined), "");
});

test("a 70 KB offline backlog is split into batches under the keepalive limit", () => {
	const q = Array.from({ length: 48 }, () => item("A", "x".repeat(1500)));
	const sent = [];
	let rest = q;
	while (rest.length) {
		const b = nextBatch(rest, "A");
		assert.ok(b.length > 0);
		assert.ok(utf8Bytes(bodyFor(b)) <= MAX_BODY_BYTES, `batch of ${b.length} is ${utf8Bytes(bodyFor(b))} bytes`);
		sent.push(...b);
		rest = withoutSent(rest, b);
	}
	assert.equal(sent.length, 48);
	assert.ok(utf8Bytes(bodyFor(q)) > 64 * 1024);
});

test("batches never exceed the server's 100 items", () => {
	const q = Array.from({ length: 250 }, () => item("A", ""));
	assert.equal(nextBatch(q, "A").length, MAX_BATCH_ITEMS);
});

test("one oversized item still goes alone instead of blocking the queue", () => {
	const q = [item("A", "y".repeat(MAX_CODE)), item("A")];
	const b = nextBatch(q, "A", 1000);
	assert.equal(b.length, 1);
});

test("only the owner's items are batched", () => {
	const q = [item("B"), item("A"), item(""), item("A"), item("logto:x")];
	const b = nextBatch(q, "A");
	assert.deepEqual(
		b.map((i) => i.owner),
		["A", "A"],
	);
	assert.equal(nextBatch(q, "C").length, 0);
});

test("sent items are removed by id, so a concurrent flush cannot drop unsent ones", () => {
	// Tab 1 and tab 2 both read a queue of 150; tab 2 already removed the first 100.
	const q = Array.from({ length: 150 }, () => item("A", ""));
	const first = q.slice(0, 100);
	const afterTab2 = withoutSent(q, first);
	assert.equal(afterTab2.length, 50);
	// Tab 1 now removes the same 100 from what tab 2 left: the other 50 stay.
	assert.equal(withoutSent(afterTab2, first).length, 50);
});

test("bodyFor sends one item bare and several as { items }, without client fields", () => {
	const a = item("A");
	assert.deepEqual(JSON.parse(bodyFor([a])), { moduleId: "m", lessonId: "l", passed: false, code: "andika(1)" });
	assert.deepEqual(Object.keys(JSON.parse(bodyFor([a, a]))), ["items"]);
});

test("parseQueue upgrades old untagged items and drops junk", () => {
	let k = 0;
	const q = parseQueue(
		[{ moduleId: "m", lessonId: "l", passed: true, code: "z".repeat(MAX_CODE + 1) }, { cid: "keep", owner: "B", moduleId: "m", lessonId: "l", passed: false, code: "" }, null, { moduleId: 3 }],
		() => `new${++k}`,
		"A",
	);
	assert.equal(q.length, 2);
	assert.deepEqual([q[0].cid, q[0].owner, q[0].code.length], ["new1", "A", MAX_CODE]);
	assert.deepEqual([q[1].cid, q[1].owner], ["keep", "B"]);
	assert.deepEqual(parseQueue("nope", () => "x", "A"), []);
});
