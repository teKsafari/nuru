// Loads the curriculum from moduli/<NN-slug>/{index.md, sw/*.md, en/*.md}.
//
// Swahili is the source of truth: code, solutions, tests and sample input come
// from the sw/ file. The en/ file only supplies translated title, task and body.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import YAML from "yaml";
import type { TestCaseV1 } from "@nuru/ui/validation/test-cases";

export const MODULI_DIR = path.join(path.dirname(fileURLToPath(import.meta.url)), "../moduli");

export type Localized = { sw: string; en: string };

export interface CurriculumLesson {
	slug: string;
	order: number;
	title: Localized;
	description: Localized;
	task?: Localized;
	initialCode: string;
	solution?: string;
	/** Lines fed to jaza() when auto-generating tests from the solution. */
	stdin?: string[];
	tests?: TestCaseV1[];
	file: string;
}

export interface CurriculumModule {
	slug: string;
	order: number;
	title: Localized;
	description?: Localized;
	difficulty: string;
	layoutConfig: Record<string, unknown>;
	lessons: CurriculumLesson[];
}

function parse(file: string): { data: Record<string, any>; body: string } {
	const raw = fs.readFileSync(file, "utf8");
	const m = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
	if (!m) return { data: {}, body: raw };
	return { data: YAML.parse(m[1]) ?? {}, body: m[2].trim() };
}

/** "07-kama.md" -> { order: 7, slug: "kama" } */
function splitName(name: string) {
	const m = name.replace(/\.md$/, "").match(/^(\d+)-(.+)$/);
	return m ? { order: Number(m[1]), slug: m[2] } : { order: 0, slug: name.replace(/\.md$/, "") };
}

export function loadCurriculum(dir = MODULI_DIR): CurriculumModule[] {
	const modules: CurriculumModule[] = [];

	for (const modDir of fs.readdirSync(dir).sort()) {
		const full = path.join(dir, modDir);
		if (!fs.statSync(full).isDirectory()) continue;
		const { order, slug } = splitName(modDir);
		const index = parse(path.join(full, "index.md"));

		const swDir = path.join(full, "sw");
		const enDir = path.join(full, "en");
		const lessons: CurriculumLesson[] = [];

		for (const name of fs.readdirSync(swDir).filter((f) => f.endsWith(".md")).sort()) {
			const sw = parse(path.join(swDir, name));
			const enPath = path.join(enDir, name);
			const en = fs.existsSync(enPath) ? parse(enPath) : { data: {}, body: "" };
			const { order: lOrder, slug: lSlug } = splitName(name);

			const task = sw.data.task || en.data.task ? { sw: sw.data.task ?? en.data.task ?? "", en: en.data.task ?? sw.data.task ?? "" } : undefined;

			lessons.push({
				slug: sw.data.slug ?? lSlug,
				order: lOrder,
				title: { sw: sw.data.title ?? lSlug, en: en.data.title ?? sw.data.title ?? lSlug },
				description: { sw: sw.body, en: en.body || sw.body },
				task,
				initialCode: (sw.data.initialCode ?? "").replace(/\n$/, ""),
				solution: sw.data.solution,
				stdin: sw.data.stdin === undefined ? undefined : String(sw.data.stdin).split("\n"),
				tests: sw.data.tests,
				file: path.relative(dir, path.join(swDir, name)),
			});
		}

		modules.push({
			slug: index.data.slug ?? slug,
			order,
			title: index.data.title ?? { sw: slug, en: slug },
			description: index.data.description,
			difficulty: index.data.difficulty ?? "mwanzilishi",
			layoutConfig: index.data.layout ?? { terminal: { defaultState: "open" } },
			lessons,
		});
	}

	return modules;
}
