import { db, modules, lessons } from "@nuru/db";
import { asc, eq, sql } from "drizzle-orm";
import { Module, Lesson, Language } from "@/types/playground";

export async function getAllModules(): Promise<{ id: string; title: Record<Language, string> }[]> {
	const allModules = await db.select({
		id: modules.id,
		title: modules.title,
	})
	.from(modules)
	.where(eq(modules.visibility, "public"))
	.orderBy(asc(modules.order));
	
	return allModules as { id: string; title: Record<Language, string> }[];
}

export async function getModule(id: string): Promise<Module> {
	const moduleResult = await db.query.modules.findFirst({
		where: sql`${modules.id} = ${id} AND ${modules.visibility} = 'public'`,
		with: {
			lessons: {
				orderBy: [asc(lessons.order)],
			},
		},
	});

	if (!moduleResult) {
		throw new Error(`Module ${id} not found or is private`);
	}

	return {
		id: moduleResult.id,
		title: moduleResult.title as Record<Language, string>,
		difficulty: moduleResult.difficulty || undefined,
		executor: moduleResult.executorType,
		panels: moduleResult.layoutConfig as any,
		lessons: moduleResult.lessons.map(l => ({
			id: l.slug,
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
		title: m.title as Record<Language, string>,
		difficulty: m.difficulty || undefined,
		executor: m.executorType,
		panels: m.layoutConfig as any,
		lessons: m.lessons.map(l => ({
			id: l.slug,
			title: l.title as Record<Language, string>,
			description: l.description as Record<Language, string>,
			task: l.task as Record<Language, string> || undefined,
			initialCode: l.defaultCode || "",
			solution: l.solution || undefined,
			tests: l.tests as any,
		})),
	}));
}
