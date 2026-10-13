import "server-only";

import { and, asc, eq, inArray, isNull, desc, sql } from "drizzle-orm";
import { db, madarasa, wanafunzi, maendeleo, modules, lessons, users } from "@nuru/db";

import { getAuth } from "@/lib/utils/auth.server";
import { readLearnerSession } from "./session.server";
import type { MimiResponse } from "./shared";

export async function findDarasaByCode(code: string) {
	const [row] = await db
		.select()
		.from(madarasa)
		.where(and(eq(madarasa.code, code), isNull(madarasa.archivedAt)))
		.limit(1);
	return row ?? null;
}

export async function teacherName(logtoId: string) {
	const [u] = await db.select({ name: users.name }).from(users).where(eq(users.logtoId, logtoId)).limit(1);
	return u?.name ?? null;
}

/**
 * Who owns progress for this request. A learner cookie wins over a Logto session,
 * so a learner signed in on a teacher's logged-in device records as the learner.
 */
export type Owner =
	| { kind: "mwanafunzi"; mwanafunziId: string; darasaId: string }
	| { kind: "logto"; logtoId: string; claims: NonNullable<Awaited<ReturnType<typeof getAuth>>["claims"]> }
	| null;

export async function resolveOwner(): Promise<Owner> {
	const s = await readLearnerSession();
	if (s) {
		const [w] = await db
			.select({ id: wanafunzi.id, darasaId: wanafunzi.darasaId, archivedAt: madarasa.archivedAt })
			.from(wanafunzi)
			.innerJoin(madarasa, eq(madarasa.id, wanafunzi.darasaId))
			.where(eq(wanafunzi.id, s.m))
			.limit(1);
		if (w && !w.archivedAt) return { kind: "mwanafunzi", mwanafunziId: w.id, darasaId: w.darasaId };
	}
	const { isAuthenticated, claims } = await getAuth();
	if (isAuthenticated && claims?.sub) return { kind: "logto", logtoId: claims.sub, claims };
	return null;
}

/** Modules a darasa studies: the assigned ones, or every public module when none are assigned. */
export async function modulesForDarasa(moduleIds: string[]): Promise<MimiResponse["moduli"]> {
	const rows = await db.query.modules.findMany({
		where:
			moduleIds.length > 0
				? and(inArray(modules.id, moduleIds), eq(modules.visibility, "public"))
				: eq(modules.visibility, "public"),
		with: { lessons: { orderBy: [asc(lessons.order)], columns: { id: true, slug: true, title: true } } },
		orderBy: [asc(modules.order)],
		columns: { id: true, slug: true, title: true },
	});
	// Keep the teacher's chosen order when modules were assigned.
	if (moduleIds.length > 0) rows.sort((a, b) => moduleIds.indexOf(a.id) - moduleIds.indexOf(b.id));
	return rows;
}

async function progressFor(owner: NonNullable<Owner>) {
	const where =
		owner.kind === "mwanafunzi" ? eq(maendeleo.mwanafunziId, owner.mwanafunziId) : eq(maendeleo.logtoId, owner.logtoId);
	return db
		.select({ lessonId: maendeleo.lessonId, moduleId: maendeleo.moduleId, passed: maendeleo.passed, attempts: maendeleo.attempts })
		.from(maendeleo)
		.where(where);
}

/** The current learner, their darasa, its modules and their progress. */
export async function getMimi(): Promise<MimiResponse & { owner: Owner }> {
	const empty = { mwanafunzi: null, darasa: null, moduli: [], maendeleo: [] };
	const owner = await resolveOwner();
	if (!owner) return { ...empty, owner };

	let w: typeof wanafunzi.$inferSelect | undefined;
	if (owner.kind === "mwanafunzi") {
		[w] = await db.select().from(wanafunzi).where(eq(wanafunzi.id, owner.mwanafunziId)).limit(1);
	} else {
		// A Logto user's most recently joined, still-open darasa.
		const rows = await db
			.select({ w: wanafunzi })
			.from(wanafunzi)
			.innerJoin(madarasa, eq(madarasa.id, wanafunzi.darasaId))
			.where(and(eq(wanafunzi.logtoId, owner.logtoId), isNull(madarasa.archivedAt)))
			.orderBy(desc(wanafunzi.createdAt))
			.limit(1);
		w = rows[0]?.w;
	}
	if (!w) return { ...empty, owner };

	const [d] = await db.select().from(madarasa).where(eq(madarasa.id, w.darasaId)).limit(1);
	if (!d) return { ...empty, owner };

	const [moduli, progress, tName] = await Promise.all([
		modulesForDarasa(d.moduleIds ?? []),
		progressFor(owner),
		teacherName(d.teacherLogtoId),
	]);

	// Touch lastSeenAt at most every five minutes.
	void db
		.update(wanafunzi)
		.set({ lastSeenAt: sql`now()` })
		.where(and(eq(wanafunzi.id, w.id), sql`(${wanafunzi.lastSeenAt} IS NULL OR ${wanafunzi.lastSeenAt} < now() - interval '5 minutes')`))
		.catch(() => {});

	return {
		owner,
		mwanafunzi: { id: w.id, displayName: w.displayName, viaLogto: owner.kind === "logto" },
		darasa: { id: d.id, name: d.name, code: d.code, teacherName: tName },
		moduli,
		maendeleo: progress,
	};
}
