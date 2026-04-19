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

	// Handle initial hydration from localStorage on client
	useEffect(() => {
		// Load code
		const storedCode = localStorage.getItem(`nuru-code-${lesson.id}-${currentStep.id}`);
		if (storedCode !== null) {
			setCode(storedCode);
		} else {
			setCode(currentStep.initialCode);
		}

		// Load progress
		const storedCompleted = localStorage.getItem(`nuru-completed-${lesson.id}`);
		if (storedCompleted) {
			try {
				setCompletedStepIndices(new Set(JSON.parse(storedCompleted)));
			} catch (e) {
				setCompletedStepIndices(new Set());
			}
		}
	}, [lesson.id, currentStep.id, currentStep.initialCode]);

	// Sync code when step changes
	useEffect(() => {
		const storedCode = localStorage.getItem(`nuru-code-${lesson.id}-${currentStep.id}`);
		setCode(storedCode !== null ? storedCode : currentStep.initialCode);
		setOutput("");
	}, [currentStepIndex, lesson.id, currentStep.id, currentStep.initialCode]);

	// Reset output when lesson changes
	useEffect(() => {
		setOutput("");
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
			setCompletedStepIndices(prev => {
				const next = new Set(prev).add(currentStepIndex);
				localStorage.setItem(`nuru-completed-${lesson.id}`, JSON.stringify(Array.from(next)));
				return next;
			});
			confetti({
				particleCount: 100,
				spread: 70,
				origin: { y: 0.6 },
				colors: ["#22c55e", "#10b981", "#3b82f6"]
			});
		}
		return isCorrect;
	}, [currentStep.solution, currentStepIndex, lesson.id]);

	const handleCodeChange = useCallback((newCode: string) => {
		setCode(newCode);
		localStorage.setItem(`nuru-code-${lesson.id}-${currentStep.id}`, newCode);
	}, [lesson.id, currentStep.id]);

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
			localStorage.setItem(`nuru-code-${lesson.id}-${currentStep.id}`, currentStep.solution);
		} else if (executor.getSolution) {
			const sol = executor.getSolution();
			setCode(sol);
			localStorage.setItem(`nuru-code-${lesson.id}-${currentStep.id}`, sol);
		}
	};

	const handleShowHint = () => {
		const hintMessage = dict.playground.hint;
		setOutput(prev => prev ? `${prev}\n\n${hintMessage}` : hintMessage);
	};

	const handleReset = () => {
		setCode(currentStep.initialCode);
		setOutput("");
		localStorage.setItem(`nuru-code-${lesson.id}-${currentStep.id}`, currentStep.initialCode);
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
					onCodeChange: handleCodeChange,
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
