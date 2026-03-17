import fs from 'fs/promises';
import path from 'path';
import yaml from 'yaml';
import { Lesson, LessonStep, Language } from '@/types/playground';

const LESSONS_ROOT = path.join(process.cwd(), 'content/lessons');

function parseMD(content: string) {
	const parts = content.split('---');
	if (parts.length >= 3) {
		const frontmatter = yaml.parse(parts[1]);
		const body = parts.slice(2).join('---').trim();
		return { frontmatter, body };
	}
	return { frontmatter: {}, body: content };
}

export async function getAllLessons() {
	const entries = await fs.readdir(LESSONS_ROOT, { withFileTypes: true });
	const lessons = [];

	for (const entry of entries) {
		if (entry.isDirectory()) {
			const indexContent = await fs.readFile(
				path.join(LESSONS_ROOT, entry.name, 'index.md'),
				'utf-8'
			);
			const { frontmatter } = parseMD(indexContent);
			lessons.push({
				id: entry.name,
				title: frontmatter.title,
			});
		}
	}

	return lessons;
}

export async function getLesson(id: string): Promise<Lesson> {
	const lessonDir = path.join(LESSONS_ROOT, id);
	const indexContent = await fs.readFile(path.join(lessonDir, 'index.md'), 'utf-8');
	const { frontmatter } = parseMD(indexContent);

	const steps: LessonStep[] = [];

	// Read steps from sw folder (primary for sorting)
	const swFiles = await fs.readdir(path.join(lessonDir, 'sw'));
	const stepFiles = swFiles.filter(f => f.endsWith('.md')).sort();

	for (const file of stepFiles) {
		const stepId = file.replace(/^\d+-/, '').replace('.md', '');

		const swContent = await fs.readFile(path.join(lessonDir, 'sw', file), 'utf-8');
		const enContent = await fs.readFile(path.join(lessonDir, 'en', file), 'utf-8');

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
	};
}
