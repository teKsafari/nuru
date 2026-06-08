"use server";

import { db, modules, lessons } from "@/lib/db";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
export async function createModule(data: any) {
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
	});

	revalidatePath("/educator/lessons");
	return { id: moduleId };
}

export async function getModulesByOrganization(orgId: string) {
	return await db.select().from(modules).where(eq(modules.organizationId, orgId));
}

export async function getAllPublicModules() {
	return await db.select().from(modules).where(eq(modules.visibility, "public"));
}

export async function getEducatorModules() {
    // For now, return all modules until we have a proper association with the educator's org
	return await db.select().from(modules);
}
