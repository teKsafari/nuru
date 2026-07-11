"use client";

import { useExecutor } from "@/hooks/use-executor";
import { Playground } from "@/components/playground/playground";
import { IExecutor } from "@/types/executor";
import { useTheme } from "@wrksz/themes/client";
import { Module, Language, PlaygroundLabels, TestResult } from "@/types/playground";
import type { Dictionary } from "@/app/(main)/[lang]/dictionaries";
import { Suspense, useState, useEffect, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import confetti from "canvas-confetti";
import { nuruLanguage } from "@nuru/ui/lib/nuru-syntax";

interface AnzaClientProps {
	module: Module;
	allModules?: Module[];
	lessonSlug: string;
	nextModuleSlug?: string;
	lang: Language;
	dict: Dictionary;
}

export function AnzaClient({ module, allModules, lessonSlug, nextModuleSlug, lang, dict }: AnzaClientProps) {

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
	const [testResults, setTestResults] = useState<Record<string, TestResult>>({});
	const [isTesting, setIsTesting] = useState(false);
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
		setTestResults({});
		setTestErrors([]);
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

	const executor = useExecutor(module.executor || "nuru", {
		wasmURL,
		onUncaughtOutput: (text) => {return setOutput((prev) => (prev ? prev + `\n${text}` : text))},
	});

	const runCodeAndCollectOutput = useCallback(async (
		sourceCode: string,
		stdin?: string,
		onOutput?: (text: string) => void,
	) => {
		// The executor's async generator yields all stdout/stderr; collect it here.
		let eventOutput = "";
		const execution = executor.execute(sourceCode, stdin);
		for await (const event of execution) {
			if (event.type === "stdout" || event.type === "stderr") {
				eventOutput += (eventOutput ? "\n" : "") + event.data;
				onOutput?.(event.data);
			}
		}
		return eventOutput.trim();
	}, [executor]);

	const runSingleTest = useCallback(async (testCode: string, test: any): Promise<TestResult> => {
		try {
			const testOutput = await runCodeAndCollectOutput(testCode, test.input);

			let passed = false;
			if (test.type === "io" || test.type === "exact_output") {
				passed = testOutput === (test.expectedOutput || "").trim();
			} else if (test.type === "match_output") {
				const regex = new RegExp(test.pattern || "", test.flags || "");
				passed = regex.test(testOutput);
			} else if (test.type === "match_code") {
				const regex = new RegExp(test.pattern || "", test.flags || "");
				passed = regex.test(testCode);
			}

			return { passed, actualOutput: testOutput };
		} catch (error: any) {
			return { passed: false, error: error.toString(), actualOutput: "" };
		}
	}, [runCodeAndCollectOutput]);

	const checkSolution = useCallback(async (currentCode: string, lastRunOutput: string = "") => {
		setIsTesting(true);
		let allPassed = true;
		const errors: string[] = [];
		const results: Record<string, TestResult> = {};

		if (currentLesson.tests && currentLesson.tests.length > 0) {
			for (const test of currentLesson.tests) {
				const testId = test.id || Math.random().toString();
				
				let result: TestResult;
				if (test.type === "io") {
					result = await runSingleTest(currentCode, test);
				} else if (test.type === "match_code") {
					const regex = new RegExp(test.pattern || "", test.flags || "");
					const passed = regex.test(currentCode);
					result = { passed };
				} else if (test.type === "match_output") {
					const regex = new RegExp(test.pattern || "", test.flags || "");
					const passed = regex.test(lastRunOutput);
					result = { passed, actualOutput: lastRunOutput };
				} else if (test.type === "exact_output") {
					const passed = lastRunOutput === (test.expectedOutput || "").trim();
					result = { passed, actualOutput: lastRunOutput };
				} else {
					result = { passed: false, error: "Unknown test type" };
				}

				results[testId] = result;
				if (!result.passed) {
					allPassed = false;
					errors.push(test.message);
				}
			}
		} else {
			// Legacy string comparison fallback is deprecated.
			// All lessons must have structured test cases populated in the database.
			allPassed = false;
		}
		
		setTestResults(results);
		setTestErrors(errors);
		setIsTesting(false);

		if (allPassed) {
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
		return allPassed;
	}, [currentLesson.solution, currentLesson.tests, currentLessonIndex, module.id, runSingleTest]);

	const handleCodeChange = useCallback((newCode: string) => {
		setCode(newCode);
		localStorage.setItem(`nuru-code-${module.id}-${currentLesson.id}`, newCode);
	}, [module.id, currentLesson.id]);

	const handleRun = async () => {
		setOutput("");
		setTestErrors([]);
		setTestResults({});
		try {
			const fullOutput = await runCodeAndCollectOutput(code, undefined, (data) =>
				setOutput((prev) => (prev ? prev + `\n${data}` : data)),
			);
			await checkSolution(code, fullOutput);
		} catch (error) {
			setOutput(`${dict.playground.error}${error}`);
		}
	};

	const handleSubmit = async () => {
		setOutput(dict.playground.testing);
		setTestErrors([]);
		setTestResults({});
		try {
			const fullOutput = await runCodeAndCollectOutput(code, undefined, (data) =>
				setOutput((prev) =>
					prev === dict.playground.testing ? data : prev + `\n${data}`,
				),
			);
			const passed = await checkSolution(code, fullOutput);
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
		setTestResults({});
		setTestErrors([]);
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
		showTests: "Show Test Cases",
		hideTests: "Hide Test Cases",
		testPassed: "Passed",
		testFailed: "Failed",
		hiddenTest: "Hidden Test",
	};

	const extensions = useMemo(() => [nuruLanguage], []);

	return (
		<Suspense fallback={<div className="flex-1 bg-background animate-pulse" />}>
			<Playground
				theme={(theme) as "light" | "dark"}
				module={module}
				allModules={allModules}
				state={{

					currentLessonIndex,
					code,
					output,
					completedLessonIndices,
					testErrors,
					testResults,
					isTesting,
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
