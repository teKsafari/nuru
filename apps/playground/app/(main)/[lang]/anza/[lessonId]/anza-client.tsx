"use client";

// import { useContext } from "react";
import { useNuru } from "@nuru/wasm/react";
// import { AuthContext } from "@/components/providers/auth-provider";
import { Playground } from "@/components/playground/playground";
import { Executor } from "@/lib/executor";
import { useTheme } from "next-themes";
import { Lesson, Language } from "@/types/playground";
import { Dictionary } from "@/app/(main)/[lang]/dictionaries";
import { Suspense } from "react";

interface AnzaClientProps {
	lesson: Lesson;
	nextLessonId?: string;
	lang: Language;
	dict: Dictionary;
}

export function AnzaClient({ lesson, nextLessonId, lang, dict }: AnzaClientProps) {
	const { theme, forcedTheme } = useTheme();
	// const { isAuthenticated, claims } = useContext(AuthContext);

	const nuruExecutor = new Executor("nuru", useNuru);

	return (
		<Suspense fallback={<div className="flex-1 bg-background animate-pulse" />}>
			<Playground
				theme={(forcedTheme || theme) as "light" | "dark"}
				lesson={lesson}
				executor={nuruExecutor}
				nextLessonId={nextLessonId}
				lang={lang}
				dict={dict}
			/>
		</Suspense>
	);
}
