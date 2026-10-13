import { NextResponse } from "next/server";
import { z } from "zod";
import { inArray, sql } from "drizzle-orm";
import { db, lessons, maendeleo } from "@nuru/db";

import { resolveOwner } from "@/lib/darasa/queries.server";
import { ensureUserRow } from "@/lib/utils/auth.server";

export const dynamic = "force-dynamic";

const MAX_CODE = 20_000;

const Item = z.object({
	moduleId: z.string().min(1).max(200),
	lessonId: z.string().min(1).max(200),
	passed: z.boolean(),
	code: z.string().max(200_000).default(""),
});
// One attempt, or a batch flushed from the offline queue.
const Body = z.union([Item, z.object({ items: z.array(Item).min(1).max(100) })]);

/**
 * Record lesson attempts for the current learner (darasa cookie) or Logto user.
 * Anonymous visitors get { ignored: true }; their progress stays in localStorage.
 */
export async function POST(req: Request) {
	const parsed = Body.safeParse(await req.json().catch(() => null));
	if (!parsed.success) return NextResponse.json({ error: "ombi_si_sahihi" }, { status: 400 });
	const items = "items" in parsed.data ? parsed.data.items : [parsed.data];

	const owner = await resolveOwner();
	if (!owner) return NextResponse.json({ ok: true, ignored: true });
	if (owner.kind === "logto") await ensureUserRow(owner.claims);

	// Trust the database for which module a lesson belongs to; drop unknown lessons.
	const known = await db
		.select({ id: lessons.id, moduleId: lessons.moduleId })
		.from(lessons)
		.where(inArray(lessons.id, [...new Set(items.map((i) => i.lessonId))]));
	const moduleOf = new Map(known.map((l) => [l.id, l.moduleId]));

	let saved = 0;
	for (const item of items) {
		const moduleId = moduleOf.get(item.lessonId);
		if (!moduleId) continue;
		const code = item.code.slice(0, MAX_CODE);
		const values = {
			id: crypto.randomUUID(),
			mwanafunziId: owner.kind === "mwanafunzi" ? owner.mwanafunziId : null,
			logtoId: owner.kind === "logto" ? owner.logtoId : null,
			lessonId: item.lessonId,
			moduleId,
			passed: item.passed,
			attempts: 1,
			lastCode: code,
			firstPassedAt: item.passed ? (sql`now()` as unknown as string) : null,
		};
		await db
			.insert(maendeleo)
			.values(values)
			.onConflictDoUpdate({
				target: owner.kind === "mwanafunzi" ? [maendeleo.mwanafunziId, maendeleo.lessonId] : [maendeleo.logtoId, maendeleo.lessonId],
				set: {
					attempts: sql`${maendeleo.attempts} + 1`,
					passed: sql`${maendeleo.passed} OR ${item.passed}`,
					lastCode: code,
					firstPassedAt: item.passed ? sql`COALESCE(${maendeleo.firstPassedAt}, now())` : sql`${maendeleo.firstPassedAt}`,
					updatedAt: sql`now()`,
				},
			});
		saved++;
	}
	return NextResponse.json({ ok: true, saved });
}
