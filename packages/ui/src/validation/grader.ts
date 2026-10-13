// Pure grading logic shared by the playground (browser), the dashboard and the
// curriculum verifier (Node). No DOM, no runtime: callers execute the program
// and hand over what it produced.
import type { TestCaseV1 } from "./test-cases";

export interface RunCapture {
	stdout: string; // non-error lines joined by \n, trimmed
	stderr: string;
	events: Array<Record<string, any>>;
	/** How the run ended ("ok", "timeout", "crashed", "stopped", ...). Absent means "ok". */
	status?: string;
}

/** Output from a run that was killed or crashed is partial: no output-based test may pass on it. */
export function runFailure(r: RunCapture): string | undefined {
	switch (r.status) {
		case "timeout":
			return "Programu imechukua muda mrefu mno na imesimamishwa. Huenda kuna kitanzi kisichoisha, au hesabu nzito kupita kiasi.";
		case "crashed":
			return r.stderr || "Programu imesimama ghafla kabla ya kumaliza.";
		case "stopped":
			return "Programu ilisimamishwa kabla ya kumaliza.";
		default:
			return undefined;
	}
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

// ---- match_code: look at code, not at comments or text ----

/**
 * Blanks out comments (// and /* *\/) and records where string literals sit,
 * following Nuru's lexer: "..." and '...' strings, with \" and \\ escapes.
 * Comment characters become spaces (newlines stay), so offsets and line
 * structure are unchanged. `strings` holds [start, end) of each literal's
 * content, between the quotes.
 */
export function scanNuru(code: string): { stripped: string; strings: Array<[number, number]> } {
	const out = code.split("");
	const strings: Array<[number, number]> = [];
	const n = code.length;
	let i = 0;
	while (i < n) {
		const c = code[i];
		const next = code[i + 1];
		if (c === "/" && next === "/") {
			while (i < n && code[i] !== "\n") out[i++] = " ";
		} else if (c === "/" && next === "*") {
			out[i++] = " ";
			out[i++] = " ";
			while (i < n && !(code[i] === "*" && code[i + 1] === "/")) {
				if (code[i] !== "\n") out[i] = " ";
				i++;
			}
			if (i < n) {
				out[i++] = " ";
				out[i++] = " ";
			}
		} else if (c === '"' || c === "'") {
			const start = ++i;
			while (i < n && code[i] !== c) {
				// Nuru escapes only \" and \\ (plus \n \r \t); \' ends a '...' string.
				if (code[i] === "\\" && (code[i + 1] === '"' || code[i + 1] === "\\")) i++;
				i++;
			}
			strings.push([start, Math.min(i, n)]);
			i++;
		} else {
			i++;
		}
	}
	return { stripped: out.join(""), strings };
}

/**
 * A match_code pattern must match the code itself: comments are removed, and a
 * match that starts inside a string literal does not count. Patterns may still
 * name string contents, e.g. `ubao\.rangi\(2, "njano"\)`, because that match
 * starts outside the string.
 *
 * Two kinds of pattern are about that syntax itself, and keep it:
 *   - a pattern containing comment markers (// or /*), as in the lesson on
 *     maoni, is matched against the raw source;
 *   - a pattern containing an escaped backslash (\\n), which only exists
 *     inside strings, may match inside a string literal.
 */
export function matchesCode(re: RegExp, code: string): boolean {
	if (/\/\/|\/\\\*|\\\/\\\/|\\\/\\\*/.test(re.source)) {
		re.lastIndex = 0;
		return re.test(code);
	}
	const aboutEscapes = re.source.includes("\\\\");
	const { stripped, strings } = scanNuru(code);
	const flags = re.flags.includes("g") ? re.flags : re.flags + "g";
	const g = new RegExp(re.source, flags);
	const inString = (at: number) => strings.some(([a, b]) => at >= a && at < b);
	for (let m = g.exec(stripped); m; m = g.exec(stripped)) {
		if (aboutEscapes || !inString(m.index)) return true;
		if (m[0].length === 0) g.lastIndex++;
		if (g.lastIndex > stripped.length) break;
	}
	return false;
}

// ---- the grader ----

export async function gradeTest(test: TestCaseV1, code: string, plain: RunCapture, run: Runner): Promise<GradeResult> {
	// Output-based tests never pass on what a killed or crashed run left behind.
	const plainFailure = test.type === "match_output" || test.type === "exact_output" || test.type === "kobe_picha" || test.type === "ubao_mfuatano" ? runFailure(plain) : undefined;
	if (plainFailure) return { passed: false, actualOutput: plain.stdout, error: plainFailure };
	switch (test.type) {
		case "match_code": {
			const re = safeRegex(test.pattern, test.flags);
			if (!re) return { passed: false, error: "Regex ya jaribio si sahihi" };
			return { passed: matchesCode(re, code) };
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
			const failure = runFailure(r);
			return {
				passed: !failure && norm(r.stdout) === norm(test.expectedOutput ?? ""),
				actualOutput: r.stdout,
				error: failure ?? (r.stderr || undefined),
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
