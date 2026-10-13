// Upserts the curriculum into Postgres. Idempotent: ids are derived from slugs,
// so re-seeding updates content without breaking learners' saved progress.
//   DATABASE_URL=... pnpm --filter @nuru/mtaala seed
import { db, modules, lessons, organizations, users } from "@nuru/db";
import { and, eq, notInArray } from "drizzle-orm";
import { loadCurriculum } from "./load";
import { makeRunner, resolveTests } from "./tests";

const SYSTEM_USER = "nuru-mtaala";
const ORG_ID = "org_teksafari";

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

	for (const mod of curriculum) {
		const moduleId = `mod_${mod.slug}`;
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
			const id = `les_${mod.slug}_${lesson.slug}`;
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
		}

		// Lessons removed from the Markdown disappear from the module too.
		await db.delete(lessons).where(and(eq(lessons.moduleId, moduleId), notInArray(lessons.id, lessonIds)));
		console.log(`${mod.slug}: masomo ${mod.lessons.length}`);
	}

	close();
	console.log(`Imekamilika: moduli ${curriculum.length}.`);
	process.exit(0);
}

main().catch((e) => {
	console.error(e);
	process.exit(1);
});
