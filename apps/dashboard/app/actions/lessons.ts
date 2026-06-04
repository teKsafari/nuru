"use server";

import { db, modules, lessons } from "@/lib/db";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { requirePermission, verifyOwnership } from "@/lib/permissions";

export async function createLesson(moduleId: string, data: any) {
	const claims = await requirePermission("create:lesson");
	const module = await db.query.modules.findFirst({ where: eq(modules.id, moduleId) });
	if (!module) throw new Error("Module not found");

	verifyOwnership(module.createdBy, claims.sub, claims.roles);

	const lessonId = crypto.randomUUID();
	const slug = data.title.en.toLowerCase().replace(/ /g, "-");

	await db.insert(lessons).values({
		id: lessonId,
		moduleId,
		slug,
		title: data.title,
		description: data.description,
		task: data.task,
		defaultCode: data.defaultCode,
		solution: data.solution,
		tests: data.tests,
	});

	revalidatePath(`/educator/modules/${moduleId}`);
	return { id: lessonId };
}

export async function reorderLessons(moduleId: string, orderedIds: string[]) {
	const claims = await requirePermission("edit:own_lesson");
	const module = await db.query.modules.findFirst({ where: eq(modules.id, moduleId) });
	if (!module) throw new Error("Module not found");

	verifyOwnership(module.createdBy, claims.sub, claims.roles);

	// Update the order for each lesson
	for (let i = 0; i < orderedIds.length; i++) {
		await db.update(lessons)
			.set({ order: i })
			.where(eq(lessons.id, orderedIds[i]));
	}
	
	revalidatePath(`/educator/modules/${moduleId}`);
}

export async function updateLesson(id: string, moduleId: string, data: any) {
	const claims = await requirePermission("edit:own_lesson");
	const module = await db.query.modules.findFirst({ where: eq(modules.id, moduleId) });
	if (!module) throw new Error("Module not found");

	verifyOwnership(module.createdBy, claims.sub, claims.roles);

	await db.update(lessons).set({
		title: data.title,
		description: data.description,
		task: data.task,
		defaultCode: data.defaultCode,
		solution: data.solution,
		tests: data.tests,
	}).where(eq(lessons.id, id));
	revalidatePath(`/educator/modules/${moduleId}`);
}

export async function deleteLesson(id: string, moduleId: string) {
	const claims = await requirePermission("delete:own_lesson");
	const module = await db.query.modules.findFirst({ where: eq(modules.id, moduleId) });
	if (!module) throw new Error("Module not found");

	verifyOwnership(module.createdBy, claims.sub, claims.roles);

	await db.delete(lessons).where(eq(lessons.id, id));
	revalidatePath(`/educator/modules/${moduleId}`);
}

export async function getLessonsByModule(moduleId: string) {
	return await db.select().from(lessons).where(eq(lessons.moduleId, moduleId));
}
