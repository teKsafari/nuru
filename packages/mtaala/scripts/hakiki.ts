// hakiki = verify. Runs every lesson's reference solution through its tests
// with the real Nuru wasm build, and checks starter code does not already pass.
//   pnpm --filter @nuru/mtaala hakiki [module-slug]
import { loadCurriculum } from "./load";
import { checkLesson, makeRunner, resolveTests } from "./tests";

const only = process.argv[2];
const { run, close } = makeRunner();
let bad = 0;
let total = 0;

for (const mod of loadCurriculum()) {
	if (only && mod.slug !== only) continue;
	console.log(`\n${mod.slug}`);
	for (const lesson of mod.lessons) {
		total++;
		const tests = await resolveTests(lesson, run);
		const problems = await checkLesson(lesson, tests, run);
		if (problems.length) {
			bad++;
			console.log(`  x ${lesson.file}\n      ${problems.join("\n      ")}`);
		} else {
			console.log(`  ok ${lesson.slug} (${tests.map((t) => t.type).join(", ")})`);
		}
	}
}

close();
console.log(`\n${total - bad}/${total} masomo yamepita.`);
process.exit(bad ? 1 : 0);
