import type { Extension } from "@codemirror/state";

export type Language = "sw" | "en";

export interface TestCase {
	type: "match_output" | "match_code" | "exact_output";
	pattern?: string;
	flags?: string;
	expected?: string;
	message: string;
}

export interface LessonStep {
	id: string;
	title: Record<Language, string>;
	description: Record<Language, string>;
	initialCode: string;
	solution?: string;
	task?: Record<Language, string>;
	tests?: TestCase[];
}

export interface Lesson {
	id: string;
	title: Record<Language, string>;
	steps: LessonStep[];
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
	nextLesson: string;
	backToLessons: string;
	completed: string;
	step: string;
	of: string;
	terminal: string;
	outputPlaceholder: string;
	lessons: string;
	incomplete: string;
	back: string;
	next: string;
	finish: string;
	yourTask: string;
}

export interface PlaygroundProps {
	lesson: Lesson;
	state: {
		currentStepIndex: number;
		code: string;
		output: string;
		completedStepIndices: Set<number>;
		testErrors?: string[];
	};
	actions: {
		onStepChange: (index: number) => void;
		onCodeChange: (code: string) => void;
		onRun: () => void;
		onSubmit: () => void;
		onShowSolution: () => void;
		onShowHint: () => void;
		onReset: () => void;
		onNextLesson: () => void;
	};
	labels: PlaygroundLabels;
	theme?: "light" | "dark";
	lang: Language;
	extensions?: Extension[];
}
