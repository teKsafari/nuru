import { db, modules, lessons } from "@nuru/db";
import { and, asc, eq, sql } from "drizzle-orm";
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

type LessonRow = typeof lessons.$inferSelect;

/**
 * The lesson as sent to the browser. The reference solution stays on the
 * server: the page only learns that one exists (and which simulators it uses),
 * and GET /api/suluhisho hands it over once the learner has unlocked it. This
 * stops a learner reading the answer in the page source. It is not a security
 * boundary: the unlock is counted in the browser, the endpoint needs no
 * login, and grading still runs client-side, so /api/maendeleo trusts the
 * browser's `passed` flag. Server-side re-grading is out of scope.
 */
function toClientLesson(l: LessonRow): Lesson {
	const solution = l.solution || "";
	return {
		id: l.id,
		slug: l.slug,
		title: l.title as Record<Language, string>,
		description: l.description as Record<Language, string>,
		task: (l.task as Record<Language, string>) || undefined,
		initialCode: l.defaultCode || "",
		hasSolution: solution.trim().length > 0,
		solutionUses: {
			kobe: /tumia\s+kobe\b/.test(solution),
			ubao: /tumia\s+ubao\b/.test(solution),
		},
		tests: l.tests as Lesson["tests"],
	};
}

/** A public lesson's reference solution, or null. Used by GET /api/suluhisho. */
export async function getLessonSolution(lessonId: string): Promise<string | null> {
	const rows = await db
		.select({ solution: lessons.solution })
		.from(lessons)
		.innerJoin(modules, eq(lessons.moduleId, modules.id))
		.where(and(eq(lessons.id, lessonId), eq(modules.visibility, "public")))
		.limit(1);
	return rows[0]?.solution || null;
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
		panels: moduleResult.layoutConfig as Module["panels"],
		lessons: moduleResult.lessons.map(toClientLesson),
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
		panels: m.layoutConfig as Module["panels"],
		lessons: m.lessons.map(toClientLesson),
	}));
}
