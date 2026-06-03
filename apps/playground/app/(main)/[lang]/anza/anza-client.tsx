"use client";

import { useNuru } from "@nuru/wasm/react";
import { Playground } from "@/components/playground/playground";
import { NuruExecutor } from "@/lib/executors/nuru-executor";
import { MockExecutor } from "@/lib/executors/mock-executor";
import { IExecutor } from "@/types/executor";
import { useTheme } from "@wrksz/themes/client";
import { Module, Lesson, Language, PlaygroundLabels } from "@/types/playground";
import { Dictionary } from "@/app/(main)/[lang]/dictionaries";
import { Suspense, useState, useEffect, useCallback, useMemo, useRef } from "react";
import { useRouter } from "next/navigation";
import confetti from "canvas-confetti";
import { nuruLanguage } from "@/lib/nuru-syntax";

interface AnzaClientProps {
	module: Module;
	lessonSlug: string;
	nextModuleSlug?: string;
	lang: Language;
	dict: Dictionary;
}

export function AnzaClient({ module, lessonSlug, nextModuleSlug, lang, dict }: AnzaClientProps) {
	const { theme} = useTheme();
	const router = useRouter();
	const currentLessonIndex = useMemo(() => {
		const index = module.lessons.findIndex((s) => s.slug === lessonSlug);
		return index !== -1 ? index : 0;
	}, [module.lessons, lessonSlug]);

	const currentLesson = module.lessons[currentLessonIndex];

	const [code, setCode] = useState(currentLesson.initialCode);
	const [output, setOutput] = useState("");
	const [testErrors, setTestErrors] = useState<string[]>([]);
	const [completedLessonIndices, setCompletedLessonIndices] = useState<Set<number>>(new Set());

	// Handle initial hydration from localStorage on client
	useEffect(() => {
		// Load code - Use ID for persistence to handle slug changes safely
		const storedCode = localStorage.getItem(`nuru-code-${module.id}-${currentLesson.id}`);
		if (storedCode !== null) {
			setCode(storedCode);
		} else {
			setCode(currentLesson.initialCode);
		}

		// Load progress - Use ID for persistence
		const storedCompleted = localStorage.getItem(`nuru-completed-${module.id}`);
		if (storedCompleted) {
			try {
				setCompletedLessonIndices(new Set(JSON.parse(storedCompleted)));
			} catch (e) {
				setCompletedLessonIndices(new Set());
			}
		}
	}, [module.id, currentLesson.id, currentLesson.initialCode]);

	// Sync code when lesson changes
	useEffect(() => {
		const storedCode = localStorage.getItem(`nuru-code-${module.id}-${currentLesson.id}`);
		setCode(storedCode !== null ? storedCode : currentLesson.initialCode);
		setOutput("");
	}, [currentLessonIndex, module.id, currentLesson.id, currentLesson.initialCode]);

	// Reset output when module changes
	useEffect(() => {
		setOutput("");
	}, [module.id]);

	const wasmURL = useMemo(() => {
		if (process.env.NODE_ENV === "development") {
			return (
				process.env.NEXT_PUBLIC_WASM_DEV_URL ||
				"http://localhost:7070/main.wasm"
			);
		}
		return "/main.wasm";
	}, []);

	const nuruExecutorRef = useRef<NuruExecutor | null>(null);
	
	const nuruInstance = useNuru((text, isError) => {
		// If an execution is active, the executor will handle it via the event queue.
		// Otherwise, we fallback to direct output for initialization messages.
		if (nuruExecutorRef.current) {
			nuruExecutorRef.current.handleOutput(text, isError);
		}
		
		// Always append to output for real-time feedback, 
		// but NuruExecutor will also yield it for the specific execution loop.
		// To avoid double-printing during handleRun, we could refine this, 
		// but for initialization it's necessary.
		if (!nuruExecutorRef.current || !nuruExecutorRef.current.isExecuting()) {
			setOutput((prev) => (prev ? prev + `\n${text}` : text));
		}
	}, { wasmURL });

	const executor = useMemo<IExecutor>(() => {
		if (module.executor === "mock") {
			return new MockExecutor();
		}

		const exec = new NuruExecutor(nuruInstance);
		nuruExecutorRef.current = exec;
		return exec;
	}, [nuruInstance, module.executor]);

	const checkSolution = useCallback((currentCode: string, outputText: string = "") => {
		let isCorrect = false;
		const errors: string[] = [];

		if (currentLesson.tests && currentLesson.tests.length > 0) {
			isCorrect = true; // Assume correct until a test fails
			for (const test of currentLesson.tests) {
				if (test.type === "match_output") {
					const regex = new RegExp(test.pattern || "", test.flags || "");
					if (!regex.test(outputText)) {
						errors.push(test.message);
						isCorrect = false;
						break;
					}
				} else if (test.type === "exact_output") {
					if (outputText.trim() !== (test.expected || "").trim()) {
						errors.push(test.message);
						isCorrect = false;
						break;
					}
				} else if (test.type === "match_code") {
					const regex = new RegExp(test.pattern || "", test.flags || "");
					if (!regex.test(currentCode)) {
						errors.push(test.message);
						isCorrect = false;
						break;
					}
				}
			}
		} else if (currentLesson.solution) {
			// Fallback to simple normalization if no tests are defined
			const normalize = (s: string) => s.replace(/\/\/.*$/gm, "").replace(/\s/g, "");
			isCorrect = normalize(currentCode) === normalize(currentLesson.solution);
		}
		
		setTestErrors(errors);

		if (isCorrect) {
			setCompletedLessonIndices(prev => {
				const next = new Set(prev).add(currentLessonIndex);
				localStorage.setItem(`nuru-completed-${module.id}`, JSON.stringify(Array.from(next)));
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
	}, [currentLesson.solution, currentLesson.tests, currentLessonIndex, module.id]);

	const handleCodeChange = useCallback((newCode: string) => {
		setCode(newCode);
		localStorage.setItem(`nuru-code-${module.id}-${currentLesson.id}`, newCode);
	}, [module.id, currentLesson.id]);

	const handleRun = async () => {
		setOutput("");
		setTestErrors([]);
		let fullOutput = "";
		try {
			const execution = executor.execute(code);
			for await (const event of execution) {
				if (event.type === "stdout" || event.type === "stderr") {
					fullOutput += event.data + "\n";
					setOutput((prev) => (prev ? prev + `\n${event.data}` : event.data));
				}
			}
			checkSolution(code, fullOutput.trim());
		} catch (error) {
			setOutput(`${dict.playground.error}${error}`);
		}
	};

	const handleSubmit = async () => {
		setOutput(dict.playground.testing);
		setTestErrors([]);
		let fullOutput = "";
		try {
			const execution = executor.execute(code);
			for await (const event of execution) {
				if (event.type === "stdout" || event.type === "stderr") {
					fullOutput += event.data + "\n";
					setOutput((prev) => (prev === dict.playground.testing ? event.data : prev + `\n${event.data}`));
				}
			}
			const passed = checkSolution(code, fullOutput.trim());
			if (passed) {
				setOutput((prev) => prev + "\n✓ Submitted!");
			}
		} catch (error) {
			setOutput(`${dict.playground.error}${error}`);
		}
	};

	const handleShowSolution = () => {
		if (currentLesson.solution) {
			setCode(currentLesson.solution);
			localStorage.setItem(`nuru-code-${module.id}-${currentLesson.id}`, currentLesson.solution);
		}
	};

	const handleShowHint = () => {
		const hintMessage = dict.playground.hint;
		setOutput(prev => prev ? `${prev}\n\n${hintMessage}` : hintMessage);
	};

	const handleReset = () => {
		setCode(currentLesson.initialCode);
		setOutput("");
		localStorage.setItem(`nuru-code-${module.id}-${currentLesson.id}`, currentLesson.initialCode);
	};

	const handleNextModule = () => {
		if (nextModuleSlug) {
			router.push(`/${lang}/anza/${nextModuleSlug}`);
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
		nextModule: dict.lessonPanel.nextLesson,
		backToModules: dict.lessonPanel.lessons,
		completed: dict.lessonPanel.completed,
		lesson: dict.lessonPanel.step,
		of: "OF",
		terminal: "Terminal",
		outputPlaceholder: dict.outputPanel.placeholder,
		modules: dict.lessonPanel.lessons,
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
				theme={(theme) as "light" | "dark"}
				module={module}
				state={{
					currentLessonIndex,
					code,
					output,
					completedLessonIndices,
					testErrors,
				}}
				actions={{
					onLessonChange: (index) => router.push(`/${lang}/anza/${module.slug}/${module.lessons[index].slug}`),
					onCodeChange: handleCodeChange,
					onRun: handleRun,
					onSubmit: handleSubmit,
					onShowSolution: handleShowSolution,
					onShowHint: handleShowHint,
					onReset: handleReset,
					onNextModule: handleNextModule,
				}}
				labels={labels}
				lang={lang}
				extensions={extensions}
			/>
		</Suspense>
	);
}