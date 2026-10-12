// Pure grading logic shared by the playground (browser), the dashboard and the
// curriculum verifier (Node). No DOM, no runtime: callers execute the program
// and hand over what it produced.
import type { TestCaseV1 } from "./test-cases";

export interface RunCapture {
	stdout: string; // non-error lines joined by \n, trimmed
	stderr: string;
	events: Array<Record<string, any>>;
}

export interface GradeResult {
	passed: boolean;
	actualOutput?: string;
	error?: string;
	/** 0..1 similarity for drawing tests, so the UI can say "karibu!" (close). */
	score?: number;
}

/** Runs a program with optional stdin lines. Supplied by the caller. */
export type Runner = (code: string, stdin?: string[]) => Promise<RunCapture>;

const norm = (s: string) =>
	s
		.replace(/\r\n/g, "\n")
		.split("\n")
		.map((l) => l.replace(/\s+$/, ""))
		.join("\n")
		.trim();

function safeRegex(pattern = "", flags = "") {
	try {
		return new RegExp(pattern, flags);
	} catch {
		return null;
	}
}

// ---- kobe drawings: rasterise to a coarse grid and compare cell sets ----

const CELL = 8; // px per grid cell on the 600x600 kobe canvas

function mark(cells: Set<string>, x: number, y: number) {
	cells.add(`${Math.floor(x / CELL)},${Math.floor(y / CELL)}`);
}

export function rasterizeKobe(events: Array<Record<string, any>>): Set<string> {
	const cells = new Set<string>();
	for (const e of events) {
		if (e.ch !== "kobe") continue;
		if (e.t === "clear") cells.clear();
		if (e.t === "line") {
			const len = Math.hypot(e.x2 - e.x1, e.y2 - e.y1);
			const steps = Math.max(1, Math.ceil(len / 2));
			for (let i = 0; i <= steps; i++) {
				mark(cells, e.x1 + ((e.x2 - e.x1) * i) / steps, e.y1 + ((e.y2 - e.y1) * i) / steps);
			}
		} else if (e.t === "circle") {
			const steps = Math.max(12, Math.ceil((2 * Math.PI * e.r) / 2));
			for (let i = 0; i < steps; i++) {
				const a = (2 * Math.PI * i) / steps;
				mark(cells, e.x + e.r * Math.cos(a), e.y + e.r * Math.sin(a));
			}
		} else if (e.t === "dot") {
			mark(cells, e.x, e.y);
		}
	}
	return cells;
}

/** Serialises a reference drawing for storage in TestCase.expectedOutput. */
export function kobeSignature(events: Array<Record<string, any>>): string {
	return JSON.stringify([...rasterizeKobe(events)].sort());
}

function dilate(cells: Set<string>): Set<string> {
	const out = new Set<string>();
	for (const c of cells) {
		const [x, y] = c.split(",").map(Number);
		for (let dx = -1; dx <= 1; dx++) for (let dy = -1; dy <= 1; dy++) out.add(`${x + dx},${y + dy}`);
	}
	return out;
}

/** Similarity 0..1 with one cell of tolerance, so tiny rounding never fails a learner. */
export function compareKobe(expected: string, events: Array<Record<string, any>>): number {
	let want: string[];
	try {
		want = JSON.parse(expected);
	} catch {
		return 0;
	}
	const got = rasterizeKobe(events);
	if (want.length === 0) return got.size === 0 ? 1 : 0;
	const gotWide = dilate(got);
	const wantSet = new Set(want);
	const wantWide = dilate(wantSet);
	const recall = want.filter((c) => gotWide.has(c)).length / want.length;
	const precision = got.size === 0 ? 0 : [...got].filter((c) => wantWide.has(c)).length / got.size;
	return Math.min(recall, precision);
}

export const KOBE_PASS = 0.9;

// ---- ubao: sequence of distinct board states ----

export function ubaoSequence(events: Array<Record<string, any>>): string[] {
	const leds = Array(9).fill(false);
	const states: string[] = [];
	for (const e of events) {
		if (e.ch !== "ubao" || e.t !== "led") continue;
		leds[e.i] = e.on;
		const snap = leds.slice(1).map((on) => (on ? "1" : "0")).join("");
		if (states[states.length - 1] !== snap) states.push(snap);
	}
	return states;
}

export function ubaoSignature(events: Array<Record<string, any>>): string {
	return ubaoSequence(events).join(" ");
}

// ---- the grader ----

export async function gradeTest(test: TestCaseV1, code: string, plain: RunCapture, run: Runner): Promise<GradeResult> {
	switch (test.type) {
		case "match_code": {
			const re = safeRegex(test.pattern, test.flags);
			if (!re) return { passed: false, error: "Regex ya jaribio si sahihi" };
			return { passed: re.test(code) };
		}
		case "match_output": {
			const re = safeRegex(test.pattern, test.flags);
			if (!re) return { passed: false, error: "Regex ya jaribio si sahihi" };
			return { passed: re.test(plain.stdout), actualOutput: plain.stdout };
		}
		case "exact_output":
			return { passed: norm(plain.stdout) === norm(test.expectedOutput ?? ""), actualOutput: plain.stdout };
		case "io": {
			const stdin = (test.input ?? "").split("\n");
			const r = await run(code, stdin);
			return {
				passed: norm(r.stdout) === norm(test.expectedOutput ?? ""),
				actualOutput: r.stdout,
				error: r.stderr || undefined,
			};
		}
		case "kobe_picha": {
			const score = compareKobe(test.expectedOutput ?? "[]", plain.events);
			return { passed: score >= KOBE_PASS, score };
		}
		case "ubao_mfuatano": {
			const got = ubaoSignature(plain.events);
			return { passed: got === (test.expectedOutput ?? "").trim(), actualOutput: got };
		}
	}
}

/** Grades every test. `plain` is one run with no stdin, shared by output-based tests. */
export async function gradeAll(tests: TestCaseV1[], code: string, run: Runner) {
	const plain = await run(code);
	const results: Record<string, GradeResult> = {};
	let passed = tests.length > 0;
	for (let i = 0; i < tests.length; i++) {
		const t = tests[i];
		const r = await gradeTest(t, code, plain, run);
		results[t.id ?? String(i)] = r;
		if (!r.passed) passed = false;
	}
	return { passed, results, plain };
}
