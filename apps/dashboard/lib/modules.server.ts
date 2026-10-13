import "server-only";

import { asc, eq } from "drizzle-orm";

import { db, lessons, modules } from "@/lib/db";
import { requirePermission } from "@/lib/permissions";

// Read helpers for the educator module pages. They live outside the "use server"
// action files so the client can never call them, and each one checks that the
// caller owns the module (Super Admin sees every module).

async function caller() {
	const claims = await requirePermission("edit:own_lesson");
	return { sub: claims.sub, isSuperAdmin: !!claims.roles?.includes("Super Admin") };
}

/** A module and its lessons, or null when it is missing or not the caller's. */
export async function getOwnedModuleWithLessons(id: string) {
	const me = await caller();
	const module = await db.query.modules.findFirst({
		where: eq(modules.id, id),
		with: { lessons: { orderBy: [asc(lessons.order)] } },
	});
	if (!module || (!me.isSuperAdmin && module.createdBy !== me.sub)) return null;
	return module;
}

/** A module's id and title, or null when it is missing or not the caller's. */
export async function getOwnedModule(id: string) {
	const me = await caller();
	const module = await db.query.modules.findFirst({
		where: eq(modules.id, id),
		columns: { id: true, title: true, createdBy: true },
	});
	if (!module || (!me.isSuperAdmin && module.createdBy !== me.sub)) return null;
	return module;
}

/** A lesson in a module the caller owns, or null. */
export async function getOwnedLesson(moduleId: string, lessonId: string) {
	const module = await getOwnedModule(moduleId);
	if (!module) return null;
	const lesson = await db.query.lessons.findFirst({ where: eq(lessons.id, lessonId) });
	if (!lesson || lesson.moduleId !== moduleId) return null;
	return { module, lesson };
}
