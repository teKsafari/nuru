"use client";

import { useParams } from "next/navigation";

import { useState, useMemo, useRef } from "react";
import { Playground } from "@/components/playground/playground";
import { nuruLanguage } from "@nuru/ui/lib/nuru-syntax";

import { useNuru } from "@nuru/wasm/react";

import type { PlaygroundLabels } from "@/types/playground";
import type { Locale } from "@/app/(main)/[lang]/dictionaries";
import type { NuruExecutor } from "@/lib/executors/nuru-executor";

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
		showTests: "Show Test Cases",
		hideTests: "Hide Test Cases",
		testPassed: "Passed",
		testFailed: "Failed",
		hiddenTest: "Hidden Test",
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

	const nuruExecutorRef = useRef<NuruExecutor | null>(null);

	const nuruInstance = useNuru(
		(text, isError) => {
			if (nuruExecutorRef.current) {
				nuruExecutorRef.current.handleOutput(text, isError);
			}

			if (!nuruExecutorRef.current || !nuruExecutorRef.current.isExecuting()) {
				setOutput((prev) => (prev ? prev + `\n${text}` : text));
			}
		},
		{ wasmURL },
	);

	const handleRun = async () => {
		setOutput("");
		try {
			nuruInstance.execute(code, ["Nehemia", "Jogn", "blenv", "wzasaewf"]);
		} catch (error) {
			setOutput(`error: ${error}`);
		}
	};

	return (
		<div className="h-full w-full">
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
