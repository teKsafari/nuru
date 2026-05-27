"use server";

import { db, modules, lessons } from "@/lib/db";
import { eq, asc } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { requirePermission, verifyOwnership } from "@/lib/permissions";

export async function createModule(data: any) {
	const claims = await requirePermission("create:lesson");
	const moduleId = crypto.randomUUID();
	const slug = data.title.en.toLowerCase().replace(/ /g, "-");

	await db.insert(modules).values({
		id: moduleId,
		slug,
		title: data.title,
		difficulty: data.difficulty,
		executorType: data.executorType || "nuru-wasm",
		visibility: data.visibility || "private",
		layoutConfig: data.layoutConfig,
		createdBy: claims.sub,
	});

	revalidatePath("/educator/modules");
	return { id: moduleId };
}

export async function getModulesByOrganization(orgId: string) {
	return await db.select().from(modules).where(eq(modules.organizationId, orgId));
}

export async function getAllPublicModules() {
	return await db.select().from(modules).where(eq(modules.visibility, "public"));
}

export async function getEducatorModules() {
	const claims = await requirePermission();

	if (claims.roles?.includes("Super Admin")) {
		console.log("includes superr")
		const modulesData=await db.select().from(modules);
		console.log({modulesData});
		return modulesData
	}

	return await db.select().from(modules).where(eq(modules.createdBy, claims.sub));
}

export async function updateModule(id: string, data: any) {
	const claims = await requirePermission("edit:own_lesson");
	const module = await db.query.modules.findFirst({ where: eq(modules.id, id) });
	if (!module) throw new Error("Module not found");

	verifyOwnership(module.createdBy, claims.sub, claims.roles);

	await db
		.update(modules)
		.set({
			title: data.title,
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
