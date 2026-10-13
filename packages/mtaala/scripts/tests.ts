// Resolves a lesson's tests.
//
// Authored tests win. An authored kobe_picha, ubao_mfuatano, exact_output or io
// test may leave out expectedOutput: it is filled in from what the reference
// solution actually does, so authors never paste drawing signatures by hand.
// With no authored tests at all, tests are generated from the solution.
import { createNodeRunner } from "@nuru/wasm/node";
import { gradeAll, kobeSignature, ubaoSignature, type Runner, type RunCapture } from "@nuru/ui/validation/grader";
import type { TestCaseV1 } from "@nuru/ui/validation/test-cases";
import type { CurriculumLesson } from "./load";

export function makeRunner() {
	const node = createNodeRunner({ timeoutMs: 5000 });
	const run: Runner = async (code, stdin) => {
		const r = await node.run(code, stdin);
		return { stdout: (r.stdout ?? "").trim(), stderr: r.stderr ?? "", events: r.events ?? [] };
	};
	return { run, close: () => node.close() };
}

const draws = (r: RunCapture) => r.events.some((e) => e.ch === "kobe" && (e.t === "line" || e.t === "circle" || e.t === "dot"));
const blinks = (r: RunCapture) => r.events.some((e) => e.ch === "ubao" && e.t === "led");

const DEFAULT_MESSAGE: Record<string, string> = {
	kobe_picha: "Mchoro wako haufanani na picha inayotakiwa bado.",
	ubao_mfuatano: "Taa hazikuwaka kwa mpangilio unaotakiwa.",
	io: "Matokeo hayalingani na yanayotarajiwa kwa ingizo hili.",
	exact_output: "Matokeo hayalingani na yanayotarajiwa.",
};

export async function resolveTests(lesson: CurriculumLesson, run: Runner): Promise<TestCaseV1[]> {
	const withIds = (tests: TestCaseV1[]) =>
		tests.map((t, i) => ({ ...t, id: t.id ?? `${lesson.slug}-${i + 1}`, isPublic: t.isPublic ?? true }));

	if (lesson.tests && lesson.tests.length > 0) {
		const filled: TestCaseV1[] = [];
		let plain: RunCapture | undefined;
		const plainRun = async () => (plain ??= await run(lesson.solution ?? "", undefined));
		for (const t of lesson.tests) {
			const needsFill = t.expectedOutput === undefined && ["kobe_picha", "ubao_mfuatano", "exact_output", "io"].includes(t.type);
			if (!needsFill || !lesson.solution) {
				filled.push({ ...t, message: t.message ?? DEFAULT_MESSAGE[t.type] ?? "Jaribio halikupita." });
				continue;
			}
			let expectedOutput: string;
			let input = t.input;
			if (t.type === "kobe_picha") expectedOutput = kobeSignature((await plainRun()).events);
			else if (t.type === "ubao_mfuatano") expectedOutput = ubaoSignature((await plainRun()).events);
			else if (t.type === "exact_output") expectedOutput = (await plainRun()).stdout;
			else {
				input ??= lesson.stdin?.join("\n") ?? "";
				expectedOutput = (await run(lesson.solution, input.split("\n"))).stdout;
			}
			filled.push({ ...t, input, expectedOutput, message: t.message ?? DEFAULT_MESSAGE[t.type] });
		}
		return withIds(filled);
	}
	if (!lesson.solution) return [];

	const r = await run(lesson.solution, lesson.stdin);
	const tests: TestCaseV1[] = [];

	if (draws(r)) {
		tests.push({ type: "kobe_picha", expectedOutput: kobeSignature(r.events), message: DEFAULT_MESSAGE.kobe_picha, isPublic: true });
	}
	if (blinks(r)) {
		tests.push({ type: "ubao_mfuatano", expectedOutput: ubaoSignature(r.events), message: DEFAULT_MESSAGE.ubao_mfuatano, isPublic: true });
	}
	if (r.stdout) {
		if (lesson.stdin) {
			tests.push({ type: "io", input: lesson.stdin.join("\n"), expectedOutput: r.stdout, message: DEFAULT_MESSAGE.io, isPublic: true });
		} else {
			tests.push({ type: "exact_output", expectedOutput: r.stdout, message: DEFAULT_MESSAGE.exact_output, isPublic: true });
		}
	}
	return withIds(tests);
}

export async function checkLesson(lesson: CurriculumLesson, tests: TestCaseV1[], run: Runner) {
	const problems: string[] = [];
	if (tests.length === 0) problems.push("hakuna majaribio (no tests)");
	if (!lesson.solution) problems.push("hakuna suluhisho (no solution)");
	if (!lesson.task?.sw) problems.push("hakuna kazi (no task)");
	if (!lesson.hasEnglish) problems.push("hakuna faili la Kiingereza (missing en/ file)");
	if (tests.some((t) => (t.type === "kobe_picha" || t.type === "ubao_mfuatano") && (t.expectedOutput ?? "") === "[]")) {
		problems.push("suluhisho halichori chochote (solution draws nothing)");
	}
	if (lesson.solution && tests.length) {
		const t0 = Date.now();
		const { passed, results } = await gradeAll(tests, lesson.solution, run);
		if (!passed) {
			const failed = Object.entries(results).filter(([, r]) => !r.passed);
			problems.push(`suluhisho halipiti: ${failed.map(([id, r]) => `${id} (${r.actualOutput ?? r.error ?? ""})`.slice(0, 160)).join("; ")}`);
		}
		const ms = Date.now() - t0;
		const own = await run(lesson.solution, lesson.stdin);
		if (own.stderr) problems.push(`suluhisho lina kosa: ${own.stderr.slice(0, 160)}`);
		if (ms > 4000) problems.push(`majaribio ni ya polepole (${ms}ms)`);
	}
	if (tests.length) {
		const { passed } = await gradeAll(tests, lesson.initialCode, run);
		if (passed) problems.push("kodi ya mwanzo tayari inapita (starter code already passes)");
	}
	return problems;
}
