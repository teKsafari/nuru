import { z } from "zod";

// Test types:
//   io            run with `input` lines fed to jaza(), stdout must equal expectedOutput
//   exact_output  stdout of a plain run must equal expectedOutput
//   match_output  stdout of a plain run must match the regex `pattern`
//   match_code    the learner's source must match the regex `pattern`
//   kobe_picha    the learner's kobe drawing must cover the same cells as the
//                 reference drawing in expectedOutput (see grader.ts). Any path
//                 that draws the same picture passes.
//   ubao_mfuatano the sequence of LED board states must equal expectedOutput
export const TEST_TYPES = ["io", "match_output", "match_code", "exact_output", "kobe_picha", "ubao_mfuatano"] as const;

export const testCaseSchema_v1 = z.object({
	id: z.string().optional(), // for stable React keys and result tracking
	type: z.enum(TEST_TYPES),
	input: z.string().optional(), // For 'io': stdin, one jaza() answer per line
	expectedOutput: z.string().optional(), // For 'io' / 'exact_output': stdout. For kobe/ubao: serialized reference.
	pattern: z.string().optional(), // For 'match_output' or 'match_code': regex string
	flags: z.string().optional(), // Regex flags
	message: z.string(), // Failure message, shown to the learner
	isPublic: z.boolean().default(false), // Visibility to the student
});

export type TestCaseV1 = z.infer<typeof testCaseSchema_v1>;
export type TestType = (typeof TEST_TYPES)[number];
