"use server";

import { db, modules, lessons } from "@/lib/db";
import { eq, and, max } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { requirePermission, verifyOwnership } from "@/lib/permissions";
import { slugify } from "@/lib/slug";
import type { TestCaseV1 } from "@nuru/ui/validation/test-cases";

type Localized = { sw: string; en: string };

export type LessonInput = {
	title: Localized;
	description: Localized;
	task: Localized;
	defaultCode: string;
	solution: string;
	tests: TestCaseV1[];
};

/** English falls back to Swahili, so learners in either language always see text. */
function fill(v: Localized): Localized {
	const sw = v.sw.trim();
	return { sw, en: v.en.trim() || sw };
}

function clean(data: LessonInput) {
	return {
		title: fill(data.title),
		description: fill(data.description),
		task: data.task.sw.trim() || data.task.en.trim() ? fill(data.task) : null,
		defaultCode: data.defaultCode,
		solution: data.solution || null,
		tests: data.tests.map((t) => ({ ...t, id: t.id || crypto.randomUUID() })),
	};
}

async function ownModule(moduleId: string, scope: string) {
	const claims = await requirePermission(scope);
	const module = await db.query.modules.findFirst({ where: eq(modules.id, moduleId) });
	if (!module) throw new Error("Module not found");
	verifyOwnership(module.createdBy, claims.sub, claims.roles);
	return module;
}

export async function createLesson(moduleId: string, data: LessonInput) {
	await ownModule(moduleId, "create:lesson");

	const lessonId = crypto.randomUUID();
	const values = clean(data);
	const [{ last }] = await db.select({ last: max(lessons.order) }).from(lessons).where(eq(lessons.moduleId, moduleId));

	await db.insert(lessons).values({
		id: lessonId,
		moduleId,
		slug: slugify(values.title.sw),
		order: (last ?? -1) + 1,
		...values,
	});

	revalidatePath(`/educator/modules/${moduleId}`);
	return { id: lessonId };
}

export async function reorderLessons(moduleId: string, orderedIds: string[]) {
	await ownModule(moduleId, "edit:own_lesson");

	for (let i = 0; i < orderedIds.length; i++) {
		await db
			.update(lessons)
			.set({ order: i })
			.where(and(eq(lessons.id, orderedIds[i]), eq(lessons.moduleId, moduleId)));
	}

	revalidatePath(`/educator/modules/${moduleId}`);
}

export async function updateLesson(id: string, moduleId: string, data: LessonInput) {
	await ownModule(moduleId, "edit:own_lesson");

	await db
		.update(lessons)
		.set(clean(data))
		.where(and(eq(lessons.id, id), eq(lessons.moduleId, moduleId)));
	revalidatePath(`/educator/modules/${moduleId}`);
	revalidatePath(`/educator/modules/${moduleId}/lessons/${id}`);
}

export async function deleteLesson(id: string, moduleId: string) {
	await ownModule(moduleId, "delete:own_lesson");

	await db.delete(lessons).where(and(eq(lessons.id, id), eq(lessons.moduleId, moduleId)));
	revalidatePath(`/educator/modules/${moduleId}`);
}

export async function getLessonsByModule(moduleId: string) {
	return await db.select().from(lessons).where(eq(lessons.moduleId, moduleId));
}
