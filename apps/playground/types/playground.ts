import type { Extension } from "@codemirror/state";
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
	showTests: string;
	hideTests: string;
	testPassed: string;
	testFailed: string;
	hiddenTest: string;
}

export interface TestResult {
	passed: boolean;
	actualOutput?: string;
	error?: string;
}

export interface PlaygroundProps {
	module?: Module;
	state: {
		currentLessonIndex?: number;
		code: string;
		output: string;
		completedLessonIndices?: Set<number>;
		testErrors?: string[];
		testResults?: Record<string, TestResult>;
		isTesting?: boolean;
	};
	actions: {
		onLessonChange?: (index: number) => void;
		onCodeChange: (code: string) => void;
		onRun: () => void;
		onSubmit?: () => void;
		onShowSolution?: () => void;
		onShowHint?: () => void;
		onReset: () => void;
		onNextModule?: () => void;
	};
	labels: PlaygroundLabels;
	theme?: "light" | "dark";
	lang: Language;
	extensions?: Extension[];
}
