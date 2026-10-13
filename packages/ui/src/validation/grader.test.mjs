// Run with: node --test packages/ui/src/validation/grader.test.mjs
// (Node strips the types from grader.ts when it imports it.)
import { test } from "node:test";
import assert from "node:assert/strict";
import { gradeAll, gradeTest, matchesCode, scanNuru } from "./grader.ts";

const ok = (stdout, extra = {}) => ({ stdout, stderr: "", events: [], ...extra });

test("scanNuru blanks comments and keeps offsets", () => {
	const src = 'andika("a") // kwa i ktk\n/* x\ny */ fanya';
	const { stripped } = scanNuru(src);
	assert.equal(stripped.length, src.length);
	assert.equal(stripped.split("\n").length, src.split("\n").length);
	assert.ok(!stripped.includes("kwa"));
	assert.ok(stripped.includes("fanya"));
});

test("comment markers inside strings are not comments", () => {
	const { stripped } = scanNuru('andika("http://x") kwa i ktk');
	assert.ok(stripped.includes("kwa i ktk"));
	assert.ok(stripped.includes('"http://x"'));
});

test("a comment does not satisfy a kwa loop requirement", () => {
	const re = /kwa\s+\w+\s+ktk/;
	assert.equal(matchesCode(re, 'andika("1\\n2\\n3") // kwa i ktk'), false);
	assert.equal(matchesCode(re, "/* kwa i ktk */ andika(1)"), false);
	assert.equal(matchesCode(re, "kwa i ktk mfululizo(3) { andika(i) }"), true);
});

test("a string literal does not satisfy it either", () => {
	const re = /kwa\s+\w+\s+ktk/;
	assert.equal(matchesCode(re, 'andika("kwa i ktk")'), false);
	assert.equal(matchesCode(re, "andika('kwa i ktk')"), false);
	assert.equal(matchesCode(re, 'andika("\\"kwa i ktk")'), false);
	assert.equal(matchesCode(re, 'andika("kwa i ktk")\nkwa j ktk [1] { }'), true);
});

test("patterns that name string contents still match", () => {
	assert.equal(matchesCode(/ubao\.rangi\(\s*2\s*,\s*"njano"\s*\)/, 'tumia ubao\nubao.rangi(2, "njano")'), true);
	assert.equal(matchesCode(/andika\(\s*"[^"]+"/, 'andika("Habari")'), true);
	assert.equal(matchesCode(/hesabu\["ulinganisho"\]/, 'hesabu["ulinganisho"] = 1'), true);
});

test("a forbidden operator mentioned only in a comment no longer fails", () => {
	const re = /^(?![\s\S]*\*\*)/;
	assert.equal(matchesCode(re, "// usitumie **\nfanya x = 2 * 2"), true);
	assert.equal(matchesCode(re, "fanya x = 2 ** 2"), false);
});

test("output tests fail on a timed-out run, with a Swahili reason", async () => {
	const plain = ok("Habari", { status: "timeout" });
	const r = await gradeTest({ type: "match_output", pattern: "Habari", message: "m", isPublic: true }, "", plain, async () => plain);
	assert.equal(r.passed, false);
	assert.match(r.error ?? "", /muda mrefu/);
});

test("gradeAll fails every output-based test on a crash but still checks code", async () => {
	const run = async () => ok("1", { status: "crashed", stderr: "Kosa: programu imeishiwa nafasi." });
	const res = await gradeAll(
		[
			{ id: "a", type: "exact_output", expectedOutput: "1", message: "m", isPublic: true },
			{ id: "b", type: "match_code", pattern: "andika", message: "m", isPublic: true },
			{ id: "c", type: "io", input: "", expectedOutput: "1", message: "m", isPublic: true },
		],
		"andika(1)",
		run,
	);
	assert.equal(res.passed, false);
	assert.equal(res.results.a.passed, false);
	assert.match(res.results.a.error ?? "", /imeishiwa nafasi/);
	assert.equal(res.results.b.passed, true);
	assert.equal(res.results.c.passed, false);
});

test("a run with no status counts as ok", async () => {
	const res = await gradeAll([{ id: "a", type: "exact_output", expectedOutput: "1", message: "m", isPublic: true }], "andika(1)", async () => ok("1"));
	assert.equal(res.passed, true);
});

test("patterns about comments or escapes keep that syntax", () => {
	const maoni = new RegExp("^\\s*(//|/\\*)\\s*\\S", "m");
	assert.equal(matchesCode(maoni, "// Programu hii\nandika(1)"), true);
	assert.equal(matchesCode(maoni, "andika(1)"), false);
	const newline = new RegExp("\\\\n");
	assert.equal(matchesCode(newline, 'andika("a\\nb")'), true);
	assert.equal(matchesCode(newline, 'andika("a") // \\n'), false);
});
