// Resolves a lesson's tests: authored tests win; otherwise they are generated
// from what the reference solution actually does.
import { createNodeRunner } from "@nuru/wasm/node";
import { gradeAll, kobeSignature, ubaoSignature, type Runner } from "@nuru/ui/validation/grader";
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

export async function resolveTests(lesson: CurriculumLesson, run: Runner): Promise<TestCaseV1[]> {
	const withIds = (tests: TestCaseV1[]) =>
		tests.map((t, i) => ({ ...t, id: t.id ?? `${lesson.slug}-${i + 1}`, isPublic: t.isPublic ?? true }));

	if (lesson.tests && lesson.tests.length > 0) return withIds(lesson.tests);
	if (!lesson.solution) return [];

	const r = await run(lesson.solution, lesson.stdin);
	const tests: TestCaseV1[] = [];

	if (r.events.some((e) => e.ch === "kobe" && (e.t === "line" || e.t === "circle" || e.t === "dot"))) {
		tests.push({ type: "kobe_picha", expectedOutput: kobeSignature(r.events), message: "Mchoro wako haufanani na picha inayotakiwa bado.", isPublic: true });
	}
	if (r.events.some((e) => e.ch === "ubao" && e.t === "led")) {
		tests.push({ type: "ubao_mfuatano", expectedOutput: ubaoSignature(r.events), message: "Taa hazikuwaka kwa mpangilio unaotakiwa.", isPublic: true });
	}
	if (r.stdout) {
		if (lesson.stdin) {
			tests.push({ type: "io", input: lesson.stdin.join("\n"), expectedOutput: r.stdout, message: "Matokeo hayalingani na yanayotarajiwa kwa ingizo hili.", isPublic: true });
		} else {
			tests.push({ type: "exact_output", expectedOutput: r.stdout, message: "Matokeo hayalingani na yanayotarajiwa.", isPublic: true });
		}
	}
	return withIds(tests);
}

export async function checkLesson(lesson: CurriculumLesson, tests: TestCaseV1[], run: Runner) {
	const problems: string[] = [];
	if (tests.length === 0) problems.push("hakuna majaribio (no tests)");
	if (lesson.solution && tests.length) {
		const { passed, results } = await gradeAll(tests, lesson.solution, run);
		if (!passed) {
			const failed = Object.entries(results).filter(([, r]) => !r.passed);
			problems.push(`suluhisho halipiti: ${failed.map(([id, r]) => `${id} (${r.actualOutput ?? r.error ?? ""})`.slice(0, 160)).join("; ")}`);
		}
	}
	if (!lesson.solution) problems.push("hakuna suluhisho (no solution)");
	if (tests.length) {
		const { passed } = await gradeAll(tests, lesson.initialCode, run);
		if (passed) problems.push("kodi ya mwanzo tayari inapita (starter code already passes)");
	}
	return problems;
}
