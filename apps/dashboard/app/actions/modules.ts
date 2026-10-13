"use server";

import { db, modules, lessons } from "@/lib/db";
import { eq, asc } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { requirePermission, verifyOwnership } from "@/lib/permissions";
import { slugify } from "@/lib/slug";

type LocalizedInput = { sw: string; en?: string };

function localized(v: LocalizedInput | string) {
	if (typeof v === "string") return { sw: v, en: v };
	const sw = v.sw.trim();
	return { sw, en: v.en?.trim() || sw };
}

export async function createModule(data: any) {
	const claims = await requirePermission("create:lesson");
	const moduleId = crypto.randomUUID();
	const title = localized(data.title);

	await db.insert(modules).values({
		id: moduleId,
		slug: slugify(title.sw),
		title,
		difficulty: data.difficulty,
		executorType: data.executorType || "nuru-wasm",
		visibility: data.visibility || "private",
		layoutConfig: data.layoutConfig ?? { terminal: true },
		createdBy: claims.sub,
	});

	revalidatePath("/educator/modules");
	return { id: moduleId };
}

export async function getModulesByOrganization(orgId: string) {
	return await db.select().from(modules).where(eq(modules.organizationId, orgId));
}

const withLessonSummary = {
	lessons: { columns: { id: true, tests: true } },
} as const;

export async function getAllPublicModules() {
	return await db.query.modules.findMany({
		where: eq(modules.visibility, "public"),
		orderBy: [asc(modules.order), asc(modules.createdAt)],
		with: withLessonSummary,
	});
}

/** The caller's modules (every module for a Super Admin), with lesson ids and tests for counts. */
export async function getEducatorModules() {
	const claims = await requirePermission();
	const isSuper = claims.roles?.includes("Super Admin");
	return await db.query.modules.findMany({
		where: isSuper ? undefined : eq(modules.createdBy, claims.sub),
		orderBy: [asc(modules.order), asc(modules.createdAt)],
		with: withLessonSummary,
	});
}

export async function updateModule(id: string, data: any) {
	const claims = await requirePermission("edit:own_lesson");
	const module = await db.query.modules.findFirst({ where: eq(modules.id, id) });
	if (!module) throw new Error("Module not found");

	verifyOwnership(module.createdBy, claims.sub, claims.roles);

	await db
		.update(modules)
		.set({
			title: localized(data.title),
			difficulty: data.difficulty,
			executorType: data.executorType,
			visibility: data.visibility,
			layoutConfig: data.layoutConfig,
		})
		.where(eq(modules.id, id));
	revalidatePath("/educator/modules");
	revalidatePath(`/educator/modules/${id}`);
}

export async function deleteModule(id: string) {
	const claims = await requirePermission("delete:own_lesson");
	const module = await db.query.modules.findFirst({ where: eq(modules.id, id) });
	if (!module) throw new Error("Module not found");

	verifyOwnership(module.createdBy, claims.sub, claims.roles);

	await db.delete(modules).where(eq(modules.id, id));
	revalidatePath("/educator/modules");
}

export async function getModuleWithLessons(id: string) {
	return await db.query.modules.findFirst({
		where: eq(modules.id, id),
		with: {
			lessons: {
				orderBy: [asc(lessons.order)],
			},
		},
	});
}
