"use server";

import { db, lessons } from "@/lib/db";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function createLesson(moduleId: string, data: any) {
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

	revalidatePath(`/educator/lessons`);
	return { id: lessonId };
}

export async function getLessonsByModule(moduleId: string) {
	return await db.select().from(lessons).where(eq(lessons.moduleId, moduleId));
}
