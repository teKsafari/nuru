"use client";

import { useNuru } from "@nuru/wasm/react";
import { Playground } from "@/components/playground/playground";
import { Executor } from "@/lib/executor";
import { useTheme } from "@wrksz/themes/client";
import { Lesson, Language, PlaygroundLabels } from "@/types/playground";
import { Dictionary } from "@/app/(main)/[lang]/dictionaries";
import { Suspense, useState, useEffect, useCallback, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import confetti from "canvas-confetti";
import { nuruLanguage } from "@/lib/nuru-syntax";

interface AnzaClientProps {
	lesson: Lesson;
	nextLessonId?: string;
	lang: Language;
	dict: Dictionary;
}

export function AnzaClient({ lesson, nextLessonId, lang, dict }: AnzaClientProps) {
	const { theme, forcedTheme } = useTheme();
	const router = useRouter();
	const searchParams = useSearchParams();
	const [currentStepIndex, setCurrentStepIndex] = useState(0);

	// Initial step from URL
	useEffect(() => {
		const stepId = searchParams.get("step");
		if (stepId) {
			const index = lesson.steps.findIndex((s) => s.id === stepId);
			if (index !== -1) {
				setCurrentStepIndex(index);
			}
		}
	}, [searchParams, lesson.steps]);

	const currentStep = lesson.steps[currentStepIndex];

	const [code, setCode] = useState(currentStep.initialCode);
	const [output, setOutput] = useState("");
	const [completedStepIndices, setCompletedStepIndices] = useState<Set<number>>(new Set());

	// Sync code when step changes
	useEffect(() => {
		setCode(currentStep.initialCode);
		setOutput("");
	}, [currentStepIndex, lesson.id, currentStep.initialCode]);

	// Reset progress when lesson changes
	useEffect(() => {
		setCompletedStepIndices(new Set());
	}, [lesson.id]);

	const executor = new Executor("nuru", useNuru);

	useEffect(() => {
		executor.onOutput((text, isError) => {
			setOutput((prev) => (prev ? prev + `\n${text}` : text));
		});
	}, [executor]);

	const checkSolution = useCallback((currentCode: string) => {
		if (!currentStep.solution) return false;
		
		// Simple normalization: remove whitespace and comments
		const normalize = (s: string) => s.replace(/\/\/.*$/gm, "").replace(/\s/g, "");
		const isCorrect = normalize(currentCode) === normalize(currentStep.solution);
		
		if (isCorrect) {
			setCompletedStepIndices(prev => new Set(prev).add(currentStepIndex));
			confetti({
				particleCount: 100,
				spread: 70,
				origin: { y: 0.6 },
				colors: ["#22c55e", "#10b981", "#3b82f6"]
			});
		}
		return isCorrect;
	}, [currentStep.solution, currentStepIndex]);

	const handleRun = async () => {
		if (executor.onBeforeRun) {
			executor.onBeforeRun();
		}
		setOutput("");
		try {
			await executor.run(code);
			checkSolution(code);
		} catch (error) {
			setOutput(`${dict.playground.error}${error}`);
		}
	};

	const handleSubmit = async () => {
		setOutput(dict.playground.testing);
		try {
			const result = await executor.submit(code);
			setOutput(result);
		} catch (error) {
			setOutput(`${dict.playground.error}${error}`);
		}
	};

	const handleShowSolution = () => {
		if (currentStep.solution) {
			setCode(currentStep.solution);
		} else if (executor.getSolution) {
			setCode(executor.getSolution());
		}
	};

	const handleShowHint = () => {
		const hintMessage = dict.playground.hint;
		setOutput(prev => prev ? `${prev}\n\n${hintMessage}` : hintMessage);
	};

	const handleReset = () => {
		setCode(currentStep.initialCode);
		setOutput("");
	};

	const handleNextLesson = () => {
		if (nextLessonId) {
			router.push(`/${lang}/anza/${nextLessonId}`);
		} else {
			router.push(`/${lang}/anza`);
		}
	};

	const labels: PlaygroundLabels = {
		run: "RUN",
		testing: dict.playground.testing,
		error: dict.playground.error,
		hint: dict.playground.hint,
		reset: dict.codePanel.reset,
		showSolution: dict.codePanel.showSolution,
		nextLesson: dict.lessonPanel.nextLesson,
		backToLessons: dict.lessonPanel.lessons,
		completed: dict.lessonPanel.completed,
		step: dict.lessonPanel.step,
		of: "OF",
		terminal: "Terminal",
		outputPlaceholder: dict.outputPanel.placeholder,
		lessons: dict.lessonPanel.lessons,
		incomplete: dict.lessonPanel.incomplete,
		back: dict.lessonPanel.back,
		next: dict.lessonPanel.next,
		finish: dict.lessonPanel.finish,
		yourTask: dict.lessonPanel.yourTask,
	};

	const extensions = useMemo(() => [nuruLanguage], []);

	return (
		<Suspense fallback={<div className="flex-1 bg-background animate-pulse" />}>
			<Playground
				theme={(forcedTheme || theme) as "light" | "dark"}
				lesson={lesson}
				state={{
					currentStepIndex,
					code,
					output,
					completedStepIndices,
				}}
				actions={{
					onStepChange: setCurrentStepIndex,
					onCodeChange: setCode,
					onRun: handleRun,
					onSubmit: handleSubmit,
					onShowSolution: handleShowSolution,
					onShowHint: handleShowHint,
					onReset: handleReset,
					onNextLesson: handleNextLesson,
				}}
				labels={labels}
				lang={lang}
				extensions={extensions}
			/>
		</Suspense>
	);
}
