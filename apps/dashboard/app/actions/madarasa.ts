"use server";

import { randomInt } from "node:crypto";
import { and, asc, desc, eq, inArray, or, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { z } from "zod";

import { db, madarasa, wanafunzi, maendeleo, modules, lessons, users } from "@/lib/db";
import { requireEducator } from "@/lib/permissions";

// Darasa (classroom) actions for teachers. Every action checks the caller is an
// Educator or Super Admin, and that the darasa is theirs (Super Admin sees all).

const CODE_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // no 0/O, no 1/I

function newCode() {
	let s = "";
	for (let i = 0; i < 6; i++) s += CODE_ALPHABET[randomInt(CODE_ALPHABET.length)];
	return `${s.slice(0, 3)}-${s.slice(3)}`;
}

async function ensureTeacherRow(claims: { sub: string; name?: unknown; username?: unknown; email?: unknown }) {
	await db
		.insert(users)
		.values({
			id: claims.sub,
			logtoId: claims.sub,
			name: (claims.name as string) || (claims.username as string) || null,
			email: (claims.email as string) || null,
		})
		.onConflictDoNothing();
}

/** Load a darasa the caller may manage, or throw. */
async function ownedDarasa(darasaId: string) {
	const me = await requireEducator();
	const [d] = await db.select().from(madarasa).where(eq(madarasa.id, darasaId)).limit(1);
	if (!d) throw new Error("Darasa halipo");
	if (!me.isSuperAdmin && d.teacherLogtoId !== me.sub) throw new Error("Forbidden: si darasa lako");
	return { d, me };
}

async function ownedMwanafunzi(mwanafunziId: string) {
	const [w] = await db.select().from(wanafunzi).where(eq(wanafunzi.id, mwanafunziId)).limit(1);
	if (!w) throw new Error("Mwanafunzi hayupo");
	const { d } = await ownedDarasa(w.darasaId);
	return { w, d };
}

export type DarasaSummary = {
	id: string;
	name: string;
	code: string;
	moduleIds: string[];
	createdAt: string;
	archivedAt: string | null;
	teacherName: string | null;
	wanafunzi: number;
	passed: number;
	isMine: boolean;
};

export async function listMadarasa(): Promise<DarasaSummary[]> {
	const me = await requireEducator();
	const rows = await db
		.select({
			d: madarasa,
			teacherName: users.name,
			wanafunzi: sql<number>`(select count(*)::int from ${wanafunzi} w where w.darasa_id = "madarasa"."id")`,
			passed: sql<number>`(
				select count(*)::int from ${maendeleo} m
				join ${wanafunzi} w on (m.mwanafunzi_id = w.id or (w.logto_id is not null and m.logto_id = w.logto_id))
				where w.darasa_id = "madarasa"."id" and m.passed
			)`,
		})
		.from(madarasa)
		.leftJoin(users, eq(users.logtoId, madarasa.teacherLogtoId))
		.where(me.isSuperAdmin ? undefined : eq(madarasa.teacherLogtoId, me.sub))
		.orderBy(sql`${madarasa.archivedAt} is not null`, desc(madarasa.createdAt));
	return rows.map((r) => ({
		id: r.d.id,
		name: r.d.name,
		code: r.d.code,
		moduleIds: r.d.moduleIds ?? [],
		createdAt: r.d.createdAt,
		archivedAt: r.d.archivedAt,
		teacherName: r.teacherName,
		wanafunzi: r.wanafunzi,
		passed: r.passed,
		isMine: r.d.teacherLogtoId === me.sub,
	}));
}

export type AssignableModule = { id: string; title: { sw: string; en: string }; lessons: number; difficulty: string | null };

/** Public modules: the only ones learners can open in the playground. */
export async function listAssignableModules(): Promise<AssignableModule[]> {
	await requireEducator();
	const rows = await db
		.select({
			id: modules.id,
			title: modules.title,
			difficulty: modules.difficulty,
			lessons: sql<number>`(select count(*)::int from ${lessons} l where l.module_id = "modules"."id")`,
		})
		.from(modules)
		.where(eq(modules.visibility, "public"))
		.orderBy(asc(modules.order));
	return rows;
}

const CreateInput = z.object({
	name: z.string().trim().min(2, "Jina liwe na herufi 2 au zaidi").max(60),
	moduleIds: z.array(z.string().min(1)).max(50).default([]),
});

export async function createDarasa(input: { name: string; moduleIds: string[] }) {
	const me = await requireEducator();
	const parsed = CreateInput.safeParse(input);
	if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Ombi si sahihi" };
	await ensureTeacherRow(me.claims);

	// Keep only public module ids, in the order given.
	const valid = parsed.data.moduleIds.length
		? new Set(
				(
					await db
						.select({ id: modules.id })
						.from(modules)
						.where(and(inArray(modules.id, parsed.data.moduleIds), eq(modules.visibility, "public")))
				).map((m) => m.id),
			)
		: new Set<string>();
	const moduleIds = parsed.data.moduleIds.filter((id) => valid.has(id));

	const id = crypto.randomUUID();
	for (let attempt = 0; attempt < 8; attempt++) {
		const code = newCode();
		try {
			await db.insert(madarasa).values({ id, name: parsed.data.name, code, teacherLogtoId: me.sub, moduleIds });
			revalidatePath("/educator/madarasa");
			return { id, code };
		} catch (e) {
			// Retry only when the random code collided with an existing one.
			const [clash] = await db.select({ id: madarasa.id }).from(madarasa).where(eq(madarasa.code, code)).limit(1);
			if (!clash) throw e;
		}
	}
	return { error: "Imeshindikana kutengeneza msimbo. Jaribu tena." };
}

export async function updateDarasaModules(darasaId: string, moduleIds: string[]) {
	await ownedDarasa(darasaId);
	const ids = z.array(z.string().min(1)).max(50).parse(moduleIds);
	await db.update(madarasa).set({ moduleIds: ids }).where(eq(madarasa.id, darasaId));
	revalidatePath(`/educator/madarasa/${darasaId}`);
}

export async function renameDarasa(darasaId: string, name: string) {
	await ownedDarasa(darasaId);
	const n = z.string().trim().min(2).max(60).parse(name);
	await db.update(madarasa).set({ name: n }).where(eq(madarasa.id, darasaId));
	revalidatePath(`/educator/madarasa/${darasaId}`);
	revalidatePath("/educator/madarasa");
}

/** Archive closes the darasa: the code stops working and learners are signed out. */
export async function setDarasaArchived(darasaId: string, archived: boolean) {
	await ownedDarasa(darasaId);
	await db
		.update(madarasa)
		.set({ archivedAt: archived ? new Date().toISOString() : null })
		.where(eq(madarasa.id, darasaId));
	revalidatePath(`/educator/madarasa/${darasaId}`);
	revalidatePath("/educator/madarasa");
}

export async function deleteDarasa(darasaId: string) {
	await ownedDarasa(darasaId);
	await db.delete(madarasa).where(eq(madarasa.id, darasaId));
	revalidatePath("/educator/madarasa");
}

export async function newDarasaCode(darasaId: string) {
	await ownedDarasa(darasaId);
	for (let attempt = 0; attempt < 8; attempt++) {
		const code = newCode();
		try {
			await db.update(madarasa).set({ code }).where(eq(madarasa.id, darasaId));
			revalidatePath(`/educator/madarasa/${darasaId}`);
			return { code };
		} catch (e) {
			const [clash] = await db.select({ id: madarasa.id }).from(madarasa).where(eq(madarasa.code, code)).limit(1);
			if (!clash) throw e;
		}
	}
	return { error: "Imeshindikana" };
}

/** Clear a learner's picture password; they choose new pictures on their next sign-in. */
export async function resetMwanafunziPicha(mwanafunziId: string) {
	const { d } = await ownedMwanafunzi(mwanafunziId);
	await db
		.update(wanafunzi)
		.set({ pictureHash: null, failedAttempts: 0, lockedUntil: null })
		.where(eq(wanafunzi.id, mwanafunziId));
	revalidatePath(`/educator/madarasa/${d.id}`);
}

export async function removeMwanafunzi(mwanafunziId: string) {
	const { d } = await ownedMwanafunzi(mwanafunziId);
	await db.delete(wanafunzi).where(eq(wanafunzi.id, mwanafunziId));
	revalidatePath(`/educator/madarasa/${d.id}`);
}

export type GridLesson = { id: string; slug: string; title: { sw: string; en: string }; order: number };
export type GridModule = { id: string; slug: string; title: { sw: string; en: string }; lessons: GridLesson[] };
export type GridLearner = {
	id: string;
	displayName: string;
	viaLogto: boolean;
	needsPictures: boolean;
	lockedUntil: string | null;
	createdAt: string;
	lastSeenAt: string | null;
};
export type GridCell = { lessonId: string; passed: boolean; attempts: number; updatedAt: string; firstPassedAt: string | null };

export type DarasaDetail = {
	darasa: { id: string; name: string; code: string; moduleIds: string[]; archivedAt: string | null; createdAt: string; teacherName: string | null };
	moduli: GridModule[];
	wanafunzi: GridLearner[];
	/** cells[mwanafunziId][lessonId] */
	cells: Record<string, Record<string, GridCell>>;
	at: string;
};

/** Everything the class page needs: the darasa, its modules and lessons, learners and the progress grid. */
export async function getDarasaDetail(darasaId: string): Promise<DarasaDetail> {
	const { d } = await ownedDarasa(darasaId);
	const moduleIds = d.moduleIds ?? [];

	const [mods, learners, teacher] = await Promise.all([
		db.query.modules.findMany({
			where: moduleIds.length ? and(inArray(modules.id, moduleIds), eq(modules.visibility, "public")) : eq(modules.visibility, "public"),
			with: { lessons: { orderBy: [asc(lessons.order)], columns: { id: true, slug: true, title: true, order: true } } },
			orderBy: [asc(modules.order)],
			columns: { id: true, slug: true, title: true },
		}),
		db.select().from(wanafunzi).where(eq(wanafunzi.darasaId, d.id)).orderBy(asc(wanafunzi.displayName)),
		db.select({ name: users.name }).from(users).where(eq(users.logtoId, d.teacherLogtoId)).limit(1),
	]);
	if (moduleIds.length) mods.sort((a, b) => moduleIds.indexOf(a.id) - moduleIds.indexOf(b.id));

	const cells: DarasaDetail["cells"] = {};
	if (learners.length) {
		const ids = learners.map((w) => w.id);
		const logtoIds = learners.map((w) => w.logtoId).filter((x): x is string => !!x);
		const rows = await db
			.select()
			.from(maendeleo)
			.where(logtoIds.length ? or(inArray(maendeleo.mwanafunziId, ids), inArray(maendeleo.logtoId, logtoIds)) : inArray(maendeleo.mwanafunziId, ids));
		const byLogto = new Map(learners.filter((w) => w.logtoId).map((w) => [w.logtoId!, w.id]));
		for (const r of rows) {
			const wid = r.mwanafunziId ?? (r.logtoId ? byLogto.get(r.logtoId) : undefined);
			if (!wid) continue;
			(cells[wid] ??= {})[r.lessonId] = {
				lessonId: r.lessonId,
				passed: r.passed,
				attempts: r.attempts,
				updatedAt: r.updatedAt,
				firstPassedAt: r.firstPassedAt,
			};
		}
	}

	return {
		darasa: {
			id: d.id,
			name: d.name,
			code: d.code,
			moduleIds,
			archivedAt: d.archivedAt,
			createdAt: d.createdAt,
			teacherName: teacher[0]?.name ?? null,
		},
		moduli: mods,
		wanafunzi: learners.map((w) => ({
			id: w.id,
			displayName: w.displayName,
			viaLogto: !!w.logtoId,
			needsPictures: !w.logtoId && !w.pictureHash,
			lockedUntil: w.lockedUntil && new Date(w.lockedUntil) > new Date() ? w.lockedUntil : null,
			createdAt: w.createdAt,
			lastSeenAt: w.lastSeenAt,
		})),
		cells,
		at: new Date().toISOString(),
	};
}

/** The learner's last submitted code for one lesson, for the read-only viewer. */
export async function getLastCode(mwanafunziId: string, lessonId: string) {
	const { w } = await ownedMwanafunzi(mwanafunziId);
	const [row] = await db
		.select({ lastCode: maendeleo.lastCode, attempts: maendeleo.attempts, passed: maendeleo.passed, updatedAt: maendeleo.updatedAt })
		.from(maendeleo)
		.where(
			and(
				eq(maendeleo.lessonId, lessonId),
				w.logtoId ? or(eq(maendeleo.mwanafunziId, w.id), eq(maendeleo.logtoId, w.logtoId)) : eq(maendeleo.mwanafunziId, w.id),
			),
		)
		.orderBy(desc(maendeleo.updatedAt))
		.limit(1);
	return row ?? null;
}
