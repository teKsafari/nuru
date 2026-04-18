import fs from 'fs/promises';
import path from 'path';
import yaml from 'yaml';
import { Lesson, LessonStep } from '@/types/playground';

const LESSONS_ROOT = path.join(process.cwd(), 'content/lessons');

function parseMD(content: string) {
	const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
	if (match) {
		const frontmatter = yaml.parse(match[1]);
		const body = content.slice(match[0].length).trim();
		return { frontmatter, body };
	}
	return { frontmatter: {}, body: content };
}

export async function getAllLessons() {
	const entries = await fs.readdir(LESSONS_ROOT, { withFileTypes: true });
	const lessonDirs = entries
		.filter((e) => e.isDirectory())
		.sort((a, b) => a.name.localeCompare(b.name));

	const lessons = [];

	for (const entry of lessonDirs) {
		try {
			const indexContent = await fs.readFile(
				path.join(LESSONS_ROOT, entry.name, 'index.md'),
				'utf-8'
			);
			const { frontmatter } = parseMD(indexContent);
			lessons.push({
				id: entry.name.replace(/^\d+-/, ''),
				title: frontmatter.title,
			});
		} catch (error) {
			console.error(`Error reading lesson index for ${entry.name}:`, error);
		}
	}

	return lessons;
}

export async function getLesson(id: string): Promise<Lesson> {
	// Find the actual folder name (it might have a prefix like 01-)
	const entries = await fs.readdir(LESSONS_ROOT);
	const folderName = entries.find((e) => e === id || e.endsWith(`-${id}`));

	if (!folderName) {
		throw new Error(`Lesson ${id} not found`);
	}

	const lessonDir = path.join(LESSONS_ROOT, folderName);
	const indexContent = await fs.readFile(
		path.join(lessonDir, 'index.md'),
		'utf-8'
	);
	const { frontmatter } = parseMD(indexContent);

	const steps: LessonStep[] = [];

	// Read steps from sw folder (primary for sorting)
	const swDir = path.join(lessonDir, 'sw');
	const enDir = path.join(lessonDir, 'en');

	const swFiles = await fs.readdir(swDir);
	const stepFiles = swFiles.filter((f) => f.endsWith('.md')).sort();

	for (const file of stepFiles) {
		const stepId = file.replace(/^\d+-/, '').replace('.md', '');

		const swContent = await fs.readFile(path.join(swDir, file), 'utf-8');
		const enContent = await fs.readFile(path.join(enDir, file), 'utf-8');

		const swParsed = parseMD(swContent);
		const enParsed = parseMD(enContent);

		steps.push({
			id: stepId,
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
		});
	}

	return {
		id,
		title: frontmatter.title,
		steps,
		difficulty: frontmatter.difficulty,
	};
}

export async function getAllLessonsWithSteps(): Promise<Lesson[]> {
	const entries = await fs.readdir(LESSONS_ROOT, { withFileTypes: true });
	const lessonDirs = entries
		.filter((e) => e.isDirectory())
		.sort((a, b) => a.name.localeCompare(b.name));

	const lessons: Lesson[] = [];

	for (const entry of lessonDirs) {
		try {
			const id = entry.name.replace(/^\d+-/, '');
			const lesson = await getLesson(id);
			lessons.push(lesson);
		} catch (error) {
			console.error(`Error reading lesson for ${entry.name}:`, error);
		}
	}

	return lessons;
}
