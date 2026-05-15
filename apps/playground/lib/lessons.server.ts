import fs from 'fs/promises';
import path from 'path';
import yaml from 'yaml';
import { Module, Lesson, Language } from '@/types/playground';

const LESSONS_ROOT = path.join(process.cwd(), 'content/lessons');
const HIDDEN_MODULE_ERROR = 'MODULE_HIDDEN';

function parseMD(content: string) {
	const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
	if (match) {
		const frontmatter = yaml.parse(match[1]);
		const body = content.slice(match[0].length).trim();
		return { frontmatter, body };
	}
	return { frontmatter: {}, body: content };
}

function isModuleHidden(frontmatter: any) {
	const isDraft = frontmatter?.status === 'draft' || frontmatter?.visibility === 'draft';
	const isProd = process.env.NODE_ENV === 'production';
	const showDrafts = process.env.SHOW_DRAFTS === 'true';
	return isDraft && isProd && !showDrafts;
}

export async function getAllModules(): Promise<{ id: string; title: Record<Language, string> }[]> {
	const entries = await fs.readdir(LESSONS_ROOT, { withFileTypes: true });
	const moduleDirs = entries
		.filter((e) => e.isDirectory())
		.sort((a, b) => a.name.localeCompare(b.name));

	const modules = [];

	for (const entry of moduleDirs) {
		try {
			const indexContent = await fs.readFile(
				path.join(LESSONS_ROOT, entry.name, 'index.md'),
				'utf-8'
			);
			const { frontmatter } = parseMD(indexContent);

			if (isModuleHidden(frontmatter)) {
				continue; // skipp if hidden
			}

			modules.push({
				id: entry.name.replace(/^\d+-/, ''),
				title: frontmatter.title,
			});
		} catch (error) {
			console.error(`Error reading module index for ${entry.name}:`, error);
		}
	}

	return modules;
}

export async function getModule(id: string): Promise<Module> {
	// Find the actual folder name (it might have a prefix like 01-)
	const entries = await fs.readdir(LESSONS_ROOT);
	const folderName = entries.find((e) => e === id || e.endsWith(`-${id}`));

	if (!folderName) {
		throw new Error(`Module ${id} not found`);
	}

	const moduleDir = path.join(LESSONS_ROOT, folderName);
	const indexContent = await fs.readFile(
		path.join(moduleDir, 'index.md'),
		'utf-8'
	);
	const { frontmatter } = parseMD(indexContent);

	if (isModuleHidden(frontmatter)) {
		throw new Error(HIDDEN_MODULE_ERROR);
	}

	const lessons: Lesson[] = [];

	// Read lessons from sw folder (primary for sorting)
	const swDir = path.join(moduleDir, 'sw');
	const enDir = path.join(moduleDir, 'en');

	const swFiles = await fs.readdir(swDir);
	const lessonFiles = swFiles.filter((f) => f.endsWith('.md')).sort();

	for (const file of lessonFiles) {
		const lessonId = file.replace(/^\d+-/, '').replace('.md', '');

		const swContent = await fs.readFile(path.join(swDir, file), 'utf-8');
		const enContent = await fs.readFile(path.join(enDir, file), 'utf-8');

		const swParsed = parseMD(swContent);
		const enParsed = parseMD(enContent);

		lessons.push({
			id: lessonId,
			title: {
				sw: swParsed.frontmatter.title,
				en: enParsed.frontmatter.title,
			},
			description: {
				sw: swParsed.body,
				en: enParsed.body,
			},
			task: {
				sw: swParsed.frontmatter.task,
				en: enParsed.frontmatter.task,
			},
			initialCode: swParsed.frontmatter.initialCode,
			solution: swParsed.frontmatter.solution,
			tests: swParsed.frontmatter.tests,
		});
	}

	return {
		id,
		title: frontmatter.title,
		lessons,
		difficulty: frontmatter.difficulty,
		executor: frontmatter.executor,
		panels: frontmatter.panels,
	};
}

export async function getAllModulesWithLessons(): Promise<Module[]> {
	const entries = await fs.readdir(LESSONS_ROOT, { withFileTypes: true });
	const moduleDirs = entries
		.filter((e) => e.isDirectory())
		.sort((a, b) => a.name.localeCompare(b.name));

	const modules: Module[] = [];

	for (const entry of moduleDirs) {
		try {
			const id = entry.name.replace(/^\d+-/, '');
			const module = await getModule(id);
			modules.push(module);
		} catch (error) {
			if (error instanceof Error && error.message === HIDDEN_MODULE_ERROR) {
				continue;
			}
			console.error(`Error reading module for ${entry.name}:`, error);
		}
	}

	return modules;
}
