import { db, modules, lessons } from "@nuru/db";
import { asc, eq, sql } from "drizzle-orm";
import { Module, Lesson, Language } from "@/types/playground";

export async function getAllModules(): Promise<{ id: string; slug: string; title: Record<Language, string> }[]> {
	const allModules = await db.select({
		id: modules.id,
		slug: modules.slug,
		title: modules.title,
	})
	.from(modules)
	.where(eq(modules.visibility, "public"))
	.orderBy(asc(modules.order));
	
	return allModules as { id: string; slug: string; title: Record<Language, string> }[];
}

export async function getModuleBySlug(slug: string): Promise<Module> {
	const moduleResult = await db.query.modules.findFirst({
		where: sql`${modules.slug} = ${slug} AND ${modules.visibility} = 'public'`,
		with: {
			lessons: {
				orderBy: [asc(lessons.order)],
			},
		},
	});

	if (!moduleResult) {
		throw new Error(`Module ${slug} not found or is private`);
	}

	return {
		id: moduleResult.id,
		slug: moduleResult.slug,
		title: moduleResult.title as Record<Language, string>,
		difficulty: moduleResult.difficulty || undefined,
		executor: moduleResult.executorType,
		panels: moduleResult.layoutConfig as any,
		lessons: moduleResult.lessons.map(l => ({
			id: l.id,
			slug: l.slug,
			title: l.title as Record<Language, string>,
			description: l.description as Record<Language, string>,
			task: l.task as Record<Language, string> || undefined,
			initialCode: l.defaultCode || "",
			solution: l.solution || undefined,
			tests: l.tests as any,
		})),
	};
}

export async function getAllModulesWithLessons(): Promise<Module[]> {
	const allModules = await db.query.modules.findMany({
		where: eq(modules.visibility, "public"),
		with: {
			lessons: {
				orderBy: [asc(lessons.order)],
			},
		},
		orderBy: [asc(modules.order)],
	});

	return allModules.map(m => ({
		id: m.id,
		slug: m.slug,
		title: m.title as Record<Language, string>,
		difficulty: m.difficulty || undefined,
		executor: m.executorType,
		panels: m.layoutConfig as any,
		lessons: m.lessons.map(l => ({
			id: l.id,
			slug: l.slug,
			title: l.title as Record<Language, string>,
			description: l.description as Record<Language, string>,
			task: l.task as Record<Language, string> || undefined,
			initialCode: l.defaultCode || "",
			solution: l.solution || undefined,
			tests: l.tests as any,
		})),
	}));
}
