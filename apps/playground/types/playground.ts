import { Executor } from "@/lib/executor";
import type { Interpreter } from "@/lib/executor";
import { Dictionary } from "@/app/(main)/[lang]/dictionaries";

export type Language = "sw" | "en";

export interface LessonStep {
	id: string;
	title: Record<Language, string>;
	description: Record<Language, string>;
	initialCode: string;
	solution?: string;
	task?: Record<Language, string>;
}

export interface Lesson {
	id: string;
	title: Record<Language, string>;
	steps: LessonStep[];
	difficulty?: string;
}

export interface PlaygroundProps {
	lesson: Lesson;
	executor: Executor<Interpreter>;
	theme?: "light" | "dark";
	nextLessonId?: string;
	lang: Language;
	dict: Dictionary;
}
