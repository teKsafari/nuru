"use client";

import type { Dictionary } from "@/app/(main)/[lang]/dictionaries";
import type { Language, Module } from "@/types/playground";
import { LessonView } from "@/components/playground/lesson/lesson-view";

interface AnzaClientProps {
	module: Module;
	lessonSlug: string;
	nextModuleSlug?: string;
	lang: Language;
	dict: Dictionary;
}

export function AnzaClient(props: AnzaClientProps) {
	return <LessonView {...props} />;
}
