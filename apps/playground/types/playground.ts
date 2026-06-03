import type { Extension } from "@codemirror/state";

export type Language = "sw" | "en";

export interface TestCase {
	type: "match_output" | "match_code" | "exact_output";
	pattern?: string;
	flags?: string;
	expected?: string;
	message: string;
}

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

export interface PlaygroundLabels {
	run: string;
	testing: string;
	error: string;
	hint: string;
	reset: string;
	showSolution: string;
	nextModule: string;
	backToModules: string;
	completed: string;
	lesson: string;
	of: string;
	terminal: string;
	outputPlaceholder: string;
	modules: string;
	incomplete: string;
	back: string;
	next: string;
	finish: string;
	yourTask: string;
}

export interface PlaygroundProps {
	module: Module;
	state: {
		currentLessonIndex: number;
		code: string;
		output: string;
		completedLessonIndices: Set<number>;
		testErrors?: string[];
	};
	actions: {
		onLessonChange: (index: number) => void;
		onCodeChange: (code: string) => void;
		onRun: () => void;
		onSubmit: () => void;
		onShowSolution: () => void;
		onShowHint: () => void;
		onReset: () => void;
		onNextModule: () => void;
	};
	labels: PlaygroundLabels;
	theme?: "light" | "dark";
	lang: Language;
	extensions?: Extension[];
}
