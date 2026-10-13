import type { TestCaseV1 as TestCase } from "@nuru/ui/validation/test-cases";

export type Language = "sw" | "en";

export interface Lesson {
	id: string;
	slug: string;
	title: Record<Language, string>;
	description: Record<Language, string>;
	initialCode: string;
	solution?: string;
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
