// Upserts the curriculum into Postgres. Idempotent: ids are derived from slugs,
// so re-seeding updates content without breaking learners' saved progress.
//   DATABASE_URL=... pnpm --filter @nuru/mtaala seed
//
// Lesson ids. A lesson's id is `les_<module slug>_<lesson slug>` unless its sw/
// front-matter pins one:
//   id: les_misingi-ya-nuru_kama      # keeps this id whatever the file is called
//   aliases: [kama, les_zamani_kama]  # ids (or slugs in this module) it used to have
// Renaming a file or fixing a slug changes the derived id. List the old slug or id
// under `aliases` and the seed moves every learner's progress (maendeleo) from the
// old lesson to the new one before removing the old lesson.
//
// Removal. Lessons gone from the Markdown are removed from their module, but only
// lessons the seed manages (ids starting with `les_`; the dashboard gives its
// lessons random UUIDs) and only when no learner has progress on them. Anything
// the seed refuses to do is listed at the end and the script exits with code 1.
import fs from "node:fs";
import path from "node:path";
import YAML from "yaml";
import { db, maendeleo, modules, lessons, organizations, users } from "@nuru/db";
import { and, eq, inArray, like, ne, notInArray, sql } from "drizzle-orm";
import { loadCurriculum, MODULI_DIR } from "./load";
import { makeRunner, resolveTests } from "./tests";

const SYSTEM_USER = "nuru-mtaala";
const ORG_ID = "org_teksafari";
const ID_PATTERN = /^les_[A-Za-z0-9_-]{1,190}$/;

const migogoro: string[] = [];

/** The `id` and `aliases` of a lesson's sw/ front-matter (load.ts does not read them). */
function frontMatterIds(file: string): { id?: string; aliases: string[] } {
	try {
		const raw = fs.readFileSync(path.join(MODULI_DIR, file), "utf8");
		const m = raw.match(/^---\r?\n([\s\S]*?)\r?\n---/);
		const data = m ? (YAML.parse(m[1]) ?? {}) : {};
		const aliases = Array.isArray(data.aliases) ? data.aliases : data.aliases ? [data.aliases] : [];
		return { id: typeof data.id === "string" ? data.id.trim() : undefined, aliases: aliases.map(String).map((s: string) => s.trim()).filter(Boolean) };
	} catch {
		return { aliases: [] };
	}
}

/**
 * Move learners' progress from lesson `from` to lesson `to` in one statement.
 * A learner with rows on both keeps one row: attempts add up, passed is either.
 */
async function moveProgress(from: string, to: string, toModule: string) {
	await db.execute(sql`
		WITH old AS (SELECT * FROM maendeleo WHERE lesson_id = ${from}),
		merged AS (
			UPDATE maendeleo n SET
				attempts = n.attempts + old.attempts,
				passed = n.passed OR old.passed,
				first_passed_at = LEAST(n.first_passed_at, old.first_passed_at),
				last_code = COALESCE(n.last_code, old.last_code),
				updated_at = GREATEST(n.updated_at, old.updated_at)
			FROM old
			WHERE n.lesson_id = ${to} AND (n.mwanafunzi_id = old.mwanafunzi_id OR n.logto_id = old.logto_id)
			RETURNING old.id AS old_id
		),
		gone AS (DELETE FROM maendeleo d USING merged WHERE d.id = merged.old_id RETURNING d.id)
		UPDATE maendeleo SET lesson_id = ${to}, module_id = ${toModule}
		WHERE lesson_id = ${from} AND id NOT IN (SELECT old_id FROM merged)
	`);
}

async function progressCount(lessonId: string) {
	const [row] = await db.select({ n: sql<number>`count(*)::int` }).from(maendeleo).where(eq(maendeleo.lessonId, lessonId));
	return Number(row?.n ?? 0);
}

async function main() {
	await db
		.insert(users)
		.values({ id: SYSTEM_USER, logtoId: SYSTEM_USER, name: "Mtaala wa Nuru", email: null })
		.onConflictDoNothing();
	await db
		.insert(organizations)
		.values({ id: ORG_ID, name: "teKsafari", slug: "teksafari" })
		.onConflictDoNothing();

	const { run, close } = makeRunner();
	const curriculum = loadCurriculum();
	const seen = new Map<string, string>(); // lesson id -> file

	for (const mod of curriculum) {
		const moduleId = `mod_${mod.slug}`;

		// modules.slug is unique: a dashboard module may already use this slug.
		const [clash] = await db
			.select({ id: modules.id })
			.from(modules)
			.where(and(eq(modules.slug, mod.slug), ne(modules.id, moduleId)))
			.limit(1);
		if (clash) {
			migogoro.push(`moduli ${mod.slug}: slug tayari inatumiwa na moduli ${clash.id}. Moduli hii imerukwa; badilisha slug moja kati yao.`);
			continue;
		}

		const values = {
			id: moduleId,
			slug: mod.slug,
			title: mod.title,
			difficulty: mod.difficulty,
			executorType: "nuru-wasm",
			visibility: "public",
			// modules has no description column, so the module blurb rides along in layoutConfig.
			layoutConfig: mod.description ? { ...mod.layoutConfig, description: mod.description } : mod.layoutConfig,
			order: mod.order,
			organizationId: ORG_ID,
			createdBy: SYSTEM_USER,
		};
		await db.insert(modules).values(values).onConflictDoUpdate({ target: modules.id, set: values });

		const lessonIds: string[] = [];
		for (const lesson of mod.lessons) {
			const fm = frontMatterIds(lesson.file);
			const id = fm.id ?? `les_${mod.slug}_${lesson.slug}`;
			if (!ID_PATTERN.test(id)) {
				migogoro.push(`${lesson.file}: id "${id}" si sahihi (ianze na les_, herufi, tarakimu, _ au - tu). Somo limerukwa.`);
				continue;
			}
			if (seen.has(id)) {
				migogoro.push(`${lesson.file}: id ${id} tayari ni ya ${seen.get(id)}. Somo limerukwa.`);
				continue;
			}
			// The same id in another module (a pinned id moved between modules): keep it, but say so.
			const [elsewhere] = await db.select({ moduleId: lessons.moduleId }).from(lessons).where(eq(lessons.id, id)).limit(1);
			if (elsewhere && elsewhere.moduleId !== moduleId) {
				if (!fm.id) {
					migogoro.push(`${lesson.file}: id ${id} ipo kwenye moduli ${elsewhere.moduleId}. Somo limerukwa.`);
					continue;
				}
				await db.execute(sql`UPDATE maendeleo SET module_id = ${moduleId} WHERE lesson_id = ${id}`);
			}
			seen.set(id, lesson.file);
			lessonIds.push(id);

			const tests = await resolveTests(lesson, run);
			const row = {
				id,
				moduleId,
				slug: lesson.slug,
				title: lesson.title,
				description: lesson.description,
				task: lesson.task ?? null,
				defaultCode: lesson.initialCode,
				solution: lesson.solution ?? null,
				tests,
				order: lesson.order,
			};
			await db.insert(lessons).values(row).onConflictDoUpdate({ target: lessons.id, set: row });

			// Old ids of this lesson: carry their progress over, then drop them.
			for (const alias of fm.aliases) {
				const oldId = alias.startsWith("les_") ? alias : `les_${mod.slug}_${alias}`;
				if (oldId === id) continue;
				const [old] = await db.select({ id: lessons.id }).from(lessons).where(eq(lessons.id, oldId)).limit(1);
				if (!old) continue;
				await moveProgress(oldId, id, moduleId);
				await db.delete(lessons).where(and(eq(lessons.id, oldId), sql`NOT EXISTS (SELECT 1 FROM maendeleo WHERE lesson_id = ${oldId})`));
				console.log(`  ${oldId} -> ${id}: maendeleo yamehamishwa`);
			}
		}

		// Seed-managed lessons removed from the Markdown leave the module, unless a
		// learner has progress on them (the foreign key would cascade it away).
		const stale = await db
			.select({ id: lessons.id })
			.from(lessons)
			.where(and(eq(lessons.moduleId, moduleId), like(lessons.id, "les\\_%"), lessonIds.length ? notInArray(lessons.id, lessonIds) : undefined));
		const keep: string[] = [];
		for (const { id } of stale) {
			const n = await progressCount(id);
			if (n > 0) {
				keep.push(id);
				migogoro.push(
					`${id}: halipo tena kwenye Markdown lakini lina maendeleo ${n} ya wanafunzi. Halijafutwa. Liongeze kwenye "aliases" ya somo jipya, au lifute kwa mkono.`,
				);
			}
		}
		const remove = stale.map((s) => s.id).filter((id) => !keep.includes(id));
		if (remove.length) {
			await db
				.delete(lessons)
				.where(and(inArray(lessons.id, remove), sql`NOT EXISTS (SELECT 1 FROM maendeleo WHERE maendeleo.lesson_id = ${lessons.id})`));
		}
		console.log(`${mod.slug}: masomo ${lessonIds.length}${remove.length ? `, yameondolewa ${remove.length}` : ""}`);
	}

	close();
	if (migogoro.length) {
		console.error(`\nMigogoro ${migogoro.length}:`);
		for (const m of migogoro) console.error(`  - ${m}`);
		console.log(`Imekamilika kwa migogoro: moduli ${curriculum.length}.`);
		process.exit(1);
	}
	console.log(`Imekamilika: moduli ${curriculum.length}.`);
	process.exit(0);
}

main().catch((e) => {
	console.error(e);
	process.exit(1);
});
