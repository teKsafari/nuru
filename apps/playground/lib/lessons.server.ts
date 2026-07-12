import { db, modules, lessons } from "@nuru/db";
import { asc, eq, sql } from "drizzle-orm";
import { cache } from "react";
import { unstable_cache } from "next/cache";
import { Module, Language, CurriculumModule } from "@/types/playground";

// Curriculum content is near-static (edited only from the dashboard app). Those
// edits can't invalidate this app's cache cross-deployment, so we bound staleness
// with a short time-based revalidate instead of relying on tag invalidation.
const CURRICULUM_TAG = "curriculum";
const CURRICULUM_REVALIDATE = 300; // seconds

// `unstable_cache` gives cross-request caching (fewer Neon HTTP round-trips);
// wrapping in React `cache` dedupes repeat calls within a single request so the
// module layout and the lesson page share one lookup.

const loadAllModules = unstable_cache(
	async (): Promise<{ id: string; slug: string; title: Record<Language, string> }[]> => {
		const allModules = await db.select({
			id: modules.id,
			slug: modules.slug,
			title: modules.title,
		})
		.from(modules)
		.where(eq(modules.visibility, "public"))
		.orderBy(asc(modules.order));

		return allModules as { id: string; slug: string; title: Record<Language, string> }[];
	},
	["all-modules"],
	{ tags: [CURRICULUM_TAG], revalidate: CURRICULUM_REVALIDATE },
);

export const getAllModules = cache(loadAllModules);

const loadCurriculumTree = unstable_cache(
	async (): Promise<CurriculumModule[]> => {
		const allModules = await db.query.modules.findMany({
			where: eq(modules.visibility, "public"),
			columns: { id: true, slug: true, title: true },
			with: {
				lessons: {
					columns: { id: true, slug: true, title: true },
					orderBy: [asc(lessons.order)],
				},
			},
			orderBy: [asc(modules.order)],
		});

		return allModules.map(m => ({
			id: m.id,
			slug: m.slug,
			title: m.title as Record<Language, string>,
			lessons: m.lessons.map(l => ({
				id: l.id,
				slug: l.slug,
				title: l.title as Record<Language, string>,
			})),
		}));
	},
	["curriculum-tree"],
	{ tags: [CURRICULUM_TAG], revalidate: CURRICULUM_REVALIDATE },
);

/**
 * Light curriculum tree (module + lesson slugs/titles, no bodies) for the sidebar,
 * course map, and header. Avoids shipping every lesson's code/solution/tests.
 */
export const getCurriculumTree = cache(loadCurriculumTree);

const loadModuleBySlug = unstable_cache(
	async (slug: string): Promise<Module> => {
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
	},
	["module-by-slug"],
	{ tags: [CURRICULUM_TAG], revalidate: CURRICULUM_REVALIDATE },
);

export const getModuleBySlug = cache((slug: string) => loadModuleBySlug(slug));

const loadAllModulesWithLessons = unstable_cache(
	async (): Promise<Module[]> => {
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
	},
	["all-modules-with-lessons"],
	{ tags: [CURRICULUM_TAG], revalidate: CURRICULUM_REVALIDATE },
);

/** Full curriculum with every lesson body. Used by the masomo map/progress pages. */
export const getAllModulesWithLessons = cache(loadAllModulesWithLessons);
