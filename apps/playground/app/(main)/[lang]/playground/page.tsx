"use client";

import { useParams } from "next/navigation";

import { useState, useMemo, useRef } from "react";
import { Playground } from "@/components/playground/playground";
import { nuruLanguage } from "@nuru/ui/lib/nuru-syntax";

import { useExecutor } from "@/hooks/use-executor";

import type { PlaygroundLabels } from "@/types/playground";
import type { Locale } from "@/app/(main)/[lang]/dictionaries";

export default function Page() {
	const [code, setCode] = useState('andika("Jina langu ni: "+jaza("Unaitwa nani?"))');
	const [output, setOutput] = useState("");
	const { lang } = useParams<{ lang: Locale }>();

	const labels: PlaygroundLabels = {
		run: "RUN",
		testing: "Testing",
		error: "Error",
		hint: "Hint",
		reset: "Reset",
		showSolution: "Solution",
		nextModule: "Next Module",
		backToModules: "Back to Modules",
		completed: "Completed",
		lesson: "Lesson",
		of: "OF",
		terminal: "Terminal",
		outputPlaceholder: "Pato litaonekana hapa...",
		modules: "Modules",
		incomplete: "Incomplete",
		back: "Back",
		next: "Next",
		finish: "Finish",
		yourTask: "Your Task",
		showTests: "Show checks",
		hideTests: "Hide checks",
		testPassed: "Done",
		testFailed: "Keep trying",
		hiddenTest: "Hidden check",
		testsTitle: "What we check",
		yourOutput: "Your output",
		validationFailedTitle: "Let's fix a few things",
		inputOutputLabel: "Input and output",
		validationLabel: "Check",
		runFirst: "Run your code first to see how it does against each check.",
		notYet: "Not yet",
	};

	const wasmURL = useMemo(() => {
		if (process.env.NODE_ENV === "development") {
			return (
				process.env.NEXT_PUBLIC_WASM_DEV_URL ||
				"http://localhost:7070/main.wasm"
			);
		}
		return "/main.wasm";
	}, []);

	const executor = useExecutor("nuru", {
		wasmURL,
		onUncaughtOutput: (text) => setOutput((prev) => (prev ? prev + `\n${text}` : text)),
	});

	const handleRun = async () => {
		setOutput("");
		try {
			const execution = executor.execute(code, "Nehemia\nJogn\nblenv\nwzasaewf");
			for await (const event of execution) {
				if (event.type === "stdout" || event.type === "stderr") {
					setOutput((prev) => (prev ? prev + `\n${event.data}` : event.data));
				}
			}
		} catch (error) {
			setOutput(`error: ${error}`);
		}
	};

	return (
		<div className="h-[calc(100vh-64px)] w-full">
			<Playground
				labels={labels}
				lang={lang || "sw"}
                extensions={
                    [nuruLanguage]
                }
				state={{
					code,
					output,
				}}
				actions={{
					onCodeChange: setCode,
					onRun: handleRun,
					onReset: () => {
						setCode("");
						setOutput("");
					},
				}}
			/>
		</div>
	);
}
