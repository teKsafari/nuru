import type { TestCaseV1 as TestCase } from "@nuru/ui/validation/test-cases";

export type Language = "sw" | "en";

export interface Lesson {
	id: string;
	slug: string;
	title: Record<Language, string>;
	description: Record<Language, string>;
	initialCode: string;
	/** The reference solution stays on the server; fetch it from /api/suluhisho once unlocked. */
	hasSolution?: boolean;
	/** Simulators the reference solution uses, so the right panels open. */
	solutionUses?: { kobe: boolean; ubao: boolean };
	task?: Record<Language, string>;
	tests?: TestCase[];
}

export interface Module {
	id: string;
	slug: string;
	title: Record<Language, string>;
	lessons: Lesson[];
	difficulty?: string;
	executor?: string;
	panels?: {
		terminal?: { defaultState?: "open" | "closed"; closable?: boolean };
		renderer?: { defaultState?: "open" | "closed" | "maximized"; type?: string; closable?: boolean };
	};
}
