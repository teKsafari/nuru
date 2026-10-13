import { kobeSignature, ubaoSignature, type RunCapture } from "@nuru/ui/validation/grader";
import type { TestCaseV1 } from "@nuru/ui/validation/test-cases";

export type GenMessages = { msgExact: string; msgIo: string; msgKobe: string; msgUbao: string };

export const drewSomething = (events: RunCapture["events"]) => events.some((e) => e.ch === "kobe" && (e.t === "line" || e.t === "circle" || e.t === "dot"));
export const litSomething = (events: RunCapture["events"]) => events.some((e) => e.ch === "ubao" && e.t === "led");

/**
 * Tests that pin down what the reference solution does, the same rules the
 * curriculum verifier (packages/mtaala/scripts/tests.ts) uses: a kobe drawing,
 * an ubao LED sequence, and the printed output (io when jaza() answers were given).
 */
export function testsFromRun(r: RunCapture, stdin: string[] | null, m: GenMessages): TestCaseV1[] {
	const tests: TestCaseV1[] = [];
	const id = () => crypto.randomUUID();
	if (drewSomething(r.events)) {
		tests.push({ id: id(), type: "kobe_picha", expectedOutput: kobeSignature(r.events), message: m.msgKobe, isPublic: true });
	}
	if (litSomething(r.events)) {
		tests.push({ id: id(), type: "ubao_mfuatano", expectedOutput: ubaoSignature(r.events), message: m.msgUbao, isPublic: true });
	}
	if (r.stdout) {
		if (stdin && stdin.length) {
			tests.push({ id: id(), type: "io", input: stdin.join("\n"), expectedOutput: r.stdout, message: m.msgIo, isPublic: true });
		} else {
			tests.push({ id: id(), type: "exact_output", expectedOutput: r.stdout, message: m.msgExact, isPublic: true });
		}
	}
	return tests;
}

const sameTest = (a: TestCaseV1, b: TestCaseV1) =>
	a.type === b.type && (a.expectedOutput ?? "").trim() === (b.expectedOutput ?? "").trim() && (a.input ?? "") === (b.input ?? "");

/** Drops generated tests that already exist. */
export function newOnly(existing: TestCaseV1[], generated: TestCaseV1[]) {
	return generated.filter((g) => !existing.some((e) => sameTest(e, g)));
}
