import { z } from "zod";

export const testCaseSchema_v1 = z.object({
  id: z.string().optional(), // for stable React keys and result tracking
  type: z.enum(["io", "match_output", "match_code", "exact_output"]),
  input: z.string().optional(),          // For 'io': stdin 
  expectedOutput: z.string().optional(), // For 'io' or 'exact_output': exact stdout expected
  pattern: z.string().optional(),        // For 'match_output' or 'match_code': regex string
  flags: z.string().optional(),          // Regex flags
  message: z.string(),                   // Failure message
  isPublic: z.boolean().default(false),  // Visibility to the student
});

export type TestCaseV1 = z.infer<typeof testCaseSchema_v1>;
