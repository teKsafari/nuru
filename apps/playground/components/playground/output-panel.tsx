"use client";
import { useEffect, useRef, useState } from "react";
import {
	Copy,
	Trash2,
	CheckCircle2,
	XCircle,
	AlertCircle,
	MinusCircle,
	ChevronDown,
} from "lucide-react";
import { ScrollArea } from "@/components/playground/scroll-area";
import { cn } from "@nuru/ui/lib/utils";
import { usePlayground } from "./playground-context";
import { getRenderer } from "./renderers/registry";

interface OutputPanelProps {
	showToolbar?: boolean;
	isMobile?: boolean;
}

export function OutputPanel({ showToolbar = true, isMobile = false }: OutputPanelProps) {
	const {
		module,
		state: { output, testErrors, testResults, currentLessonIndex },
		labels,
		isCurrentLessonCompleted,
	} = usePlayground();

	const [tab, setTab] = useState<"output" | "tests">("output");
	const [expandedTest, setExpandedTest] = useState<string | null>(null);

	// When the user runs code (output or test results change), force the tab
	// back to "output" so they see results. Skip the initial mount.
	const prevOutput = useRef<string | undefined>(output);
	const prevTestKey = useRef<string>(JSON.stringify(testResults || {}));
	const firstRender = useRef(true);
	useEffect(() => {
		const nextKey = JSON.stringify(testResults || {});
		if (firstRender.current) {
			firstRender.current = false;
			prevOutput.current = output;
			prevTestKey.current = nextKey;
			return;
		}
		if (output !== prevOutput.current || nextKey !== prevTestKey.current) {
			setTab("output");
		}
		prevOutput.current = output;
		prevTestKey.current = nextKey;
	}, [output, testResults]);

	const rendererId = module?.panels?.renderer?.type || "standard-terminal";
	const RendererComponent = getRenderer(rendererId);
	const tests = Object.entries(testResults || {});
	const passedCount = tests.filter(([, r]) => r.passed).length;
	const totalTests = tests.length;
	const allPassed = totalTests > 0 && passedCount === totalTests;
	const lessonTests = module?.lessons?.[currentLessonIndex ?? 0]?.tests || [];
	const findTestDef = (id: string) => lessonTests.find((t) => t.id === id);

	const handleCopy = () => {
		if (output) navigator.clipboard?.writeText(output).catch(() => {});
	};

	if (isMobile) {
		return (
			<div className="flex h-full w-full flex-col overflow-hidden rounded-[20px] border border-border bg-card text-foreground shadow-sm">
				<div className="flex shrink-0 items-center gap-3 px-4 py-3">
					<div className="grid flex-1 grid-cols-2 rounded-2xl border border-border bg-muted p-1">
						{(["output", "tests"] as const).map((t) => (
							<button
								key={t}
								onClick={() => setTab(t)}
								className={cn(
									"rounded-[14px] px-4 py-2.5 text-[13px] font-medium transition-all",
									tab === t
										? "bg-card text-blue-600 shadow-sm"
										: "text-muted-foreground hover:text-foreground",
								)}
							>
								{t === "output" ? "Output" : "Tests"}
							</button>
						))}
					</div>
					{isCurrentLessonCompleted && (
						<div className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-[12px] font-medium text-emerald-600">
							<CheckCircle2 className="h-3.5 w-3.5" />
							<span>Passed</span>
						</div>
					)}
				</div>

				<div className="min-h-0 flex-1">
					{tab === "output" ? (
						<div className="flex h-full flex-col px-3 pb-3">
							{showToolbar && (
								<div className="mb-2 flex justify-end gap-1">
									<button
										onClick={handleCopy}
										aria-label="Copy output"
										className="rounded-md p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground"
									>
										<Copy className="h-4 w-4" />
									</button>
									<button
										aria-label="Clear output"
										className="rounded-md p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground"
									>
										<Trash2 className="h-4 w-4" />
									</button>
								</div>
							)}
							<div className="min-h-0 flex-1 overflow-hidden rounded-lg border border-border bg-muted/40">
								<ScrollArea className="h-full">
									<div className="px-4 py-3">
										{rendererId === "standard-terminal" ? (
											output ? (
										<pre className="whitespace-pre-wrap font-mono text-[13px] leading-7 text-foreground">
													{output.split("\n").map((line, i) => {
														const isError =
															line.toLowerCase().includes("error:") ||
															line.toLowerCase().includes("hitilafu:");
														return (
															<span key={i} className={cn("block", isError && "text-red-600 dark:text-red-400")}>
																{line}
															</span>
														);
													})}
												</pre>
											) : (
												<p className="font-mono text-[13px] italic text-muted-foreground">
													{labels.outputPlaceholder}
												</p>
											)
										) : RendererComponent ? (
											<RendererComponent />
										) : (
											<p className="font-mono text-[12px] text-muted-foreground">
												Renderer "{rendererId}" not found
											</p>
										)}
									</div>
								</ScrollArea>
							</div>
						</div>
					) : (
						<ScrollArea className="h-full px-4 pb-4">
							<div className="space-y-4 pb-3">
								<div className="flex items-center justify-between pt-1 text-[13px]">
									<span className={cn("font-medium", allPassed ? "text-emerald-600" : "text-muted-foreground")}>
										{passedCount} / {totalTests || 0} tests passed
									</span>
									<span className="text-muted-foreground">
										{allPassed ? "All tests passed! 🎉" : "Keep going"}
									</span>
								</div>

								{testErrors && testErrors.length > 0 && (
									<div className="flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-3">
										<AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-500" />
										<div className="min-w-0 flex-1">
											<div className="mb-1 text-[13px] font-semibold text-red-700">{labels.error}</div>
											<ul className="space-y-1 text-[12.5px] leading-relaxed text-red-700/90">
												{testErrors.map((e, i) => (
													<li key={i}>{e}</li>
												))}
											</ul>
										</div>
									</div>
								)}

								<ul className="space-y-3">
									{tests.length === 0 && (
									<li className="rounded-2xl border border-border bg-muted px-4 py-5 text-center text-[13px] text-muted-foreground">
											Run the code to see test results.
										</li>
									)}
									{tests.map(([id, r], i) => {
										const def = findTestDef(id);
										const isOpen = expandedTest === id;
										return (
											<li
												key={id}
												className={cn(
													"overflow-hidden rounded-2xl border bg-card",
													r.passed === false ? "border-red-200" : r.passed ? "border-emerald-200" : "border-border",
												)}
											>
												<button
													type="button"
													onClick={() => setExpandedTest(isOpen ? null : id)}
													className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left"
												>
													<div className="flex min-w-0 items-center gap-3">
														<span className="shrink-0">
															{r.passed ? (
																<CheckCircle2 className="h-5 w-5 text-emerald-500" />
															) : r.passed === false ? (
																<XCircle className="h-5 w-5 text-red-500" />
															) : (
																<MinusCircle className="h-5 w-5 text-muted-foreground" />
															)}
														</span>
														<div className="min-w-0">
															<div className="text-[13px] font-semibold text-foreground">Test {i + 1}</div>
															<div className="truncate text-[12px] text-muted-foreground">
																{def?.isPublic === false ? labels.hiddenTest : "Expected output"}
															</div>
														</div>
													</div>
													<div className="flex items-center gap-2">
														<span className={cn("text-[12px] font-semibold", r.passed ? "text-emerald-600" : r.passed === false ? "text-red-600" : "text-muted-foreground")}>
															{r.passed ? labels.testPassed : r.passed === false ? labels.testFailed : "—"}
														</span>
														<ChevronDown className={cn("h-4 w-4 text-muted-foreground transition-transform", isOpen && "rotate-180")} />
													</div>
												</button>
												{isOpen && (
													<div className="space-y-3 border-t border-border bg-muted/60 px-4 py-3">
														{r.error && (
															<div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-[12px] leading-relaxed text-red-700">
																{r.error}
															</div>
														)}
														{def?.isPublic !== false && def?.expectedOutput !== undefined && (
															<div>
																<div className="mb-1 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">Expected output</div>
																<pre className="overflow-x-auto rounded-lg border border-border bg-card px-3 py-2 font-mono text-[12px] text-foreground">{def.expectedOutput || "(empty)"}</pre>
															</div>
														)}
														{(() => {
															const shown = (r.actualOutput && r.actualOutput.length > 0)
																? r.actualOutput
																: (output && output.length > 0 ? output : "");
															return (
																<div>
																	<div className="mb-1 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">Your output</div>
																	<pre className="overflow-x-auto rounded-lg border border-border bg-muted/40 px-3 py-2 font-mono text-[12px] text-foreground">{shown || "(no output)"}</pre>
																</div>
															);
														})()}
														{def?.isPublic !== false && def?.input && (
															<div>
																<div className="mb-1 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">Input</div>
																<pre className="overflow-x-auto rounded-lg border border-border bg-card px-3 py-2 font-mono text-[12px] text-foreground">{def.input}</pre>
															</div>
														)}
													</div>
												)}
											</li>
										);
									})}
								</ul>

							</div>
						</ScrollArea>
					)}
				</div>
			</div>
		);
	}

	return (
		<div className="flex h-full w-full flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
			<div className="flex shrink-0 items-center justify-between border-b border-border px-4">
				<div className="flex items-center gap-1">
					{(["output", "tests"] as const).map((t) => (
						<button
							key={t}
							onClick={() => setTab(t)}
							className={cn(
								"relative px-2 py-3 text-[13px] font-semibold capitalize transition-colors",
								tab === t ? "text-blue-600" : "text-muted-foreground hover:text-foreground",
							)}
						>
							{t === "output" ? "Output" : "Tests"}
							{tab === t && (
								<span className="absolute inset-x-0 -bottom-px h-0.5 rounded bg-blue-600" />
							)}
						</button>
					))}
				</div>
			</div>

			<div className="flex min-h-0 flex-1 flex-col">
				{testErrors && testErrors.length > 0 && (
					<div className="m-4 mb-0 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3">
						<AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-500" />
						<div className="min-w-0 flex-1">
							<div className="mb-1 text-[13px] font-semibold text-red-700">{labels.error}</div>
							<ul className="space-y-1 text-[12.5px] leading-relaxed text-red-700/90">
								{testErrors.map((e, i) => (
									<li key={i}>{e}</li>
								))}
							</ul>
						</div>
					</div>
				)}

				{tab === "output" ? (
					<div className="m-3 flex min-h-0 flex-1 flex-col overflow-hidden rounded-lg border border-border bg-muted/40">
						{showToolbar && (
							<div className="flex items-center justify-end gap-1 px-2 py-1.5">
								<button
									onClick={handleCopy}
									aria-label="Copy output"
									className="rounded-md p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground"
								>
									<Copy className="h-3.5 w-3.5" />
								</button>
								<button
									aria-label="Clear output"
									className="rounded-md p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground"
								>
									<Trash2 className="h-3.5 w-3.5" />
								</button>
							</div>
						)}
						<ScrollArea className="flex-1">
							<div className="px-4 pb-4">
								{rendererId === "standard-terminal" ? (
									output ? (
										<pre className="whitespace-pre-wrap font-mono text-[12.5px] leading-relaxed text-foreground">
											{output.split("\n").map((line, i) => {
												const isError =
													line.toLowerCase().includes("error:") ||
													line.toLowerCase().includes("hitilafu:");
												return (
													<span key={i} className={cn("block", isError && "text-red-600 dark:text-red-400")}>
														{line}
													</span>
												);
											})}
										</pre>
									) : (
										<p className="font-mono text-[12px] italic text-muted-foreground">{labels.outputPlaceholder}</p>
									)
								) : RendererComponent ? (
									<RendererComponent />
								) : (
									<p className="font-mono text-[12px] text-muted-foreground">Renderer "{rendererId}" not found</p>
								)}
							</div>
						</ScrollArea>
					</div>
				) : (
					<ScrollArea className="flex-1">
						<div className="p-4">
							{totalTests > 0 && (
								<div className="mb-3 flex items-center justify-between rounded-xl border border-border bg-muted px-4 py-3">
									<div className="flex items-center gap-2 text-[13px] font-semibold">
										{allPassed ? <><span>All tests passed!</span><span aria-hidden>🎉</span></> : <span className="text-foreground">{passedCount} of {totalTests} tests passed</span>}
									</div>
									<div className={cn("text-[12px] font-semibold", allPassed ? "text-emerald-600" : "text-muted-foreground")}>
										{passedCount} / {totalTests} tests passed
									</div>
								</div>
							)}

							<ul className="space-y-2">
								{tests.length === 0 && (
									<li className="rounded-xl border border-dashed border-border bg-muted/60 px-4 py-6 text-center text-[12.5px] text-muted-foreground">
										Bonyeza <strong className="font-semibold text-foreground">{labels.run}</strong> ili kuona matokeo ya majaribio.
									</li>
								)}
								{tests.map(([id, r], i) => (
									<li
										key={id}
										className={cn(
											"flex items-center justify-between gap-3 rounded-xl border px-4 py-3 text-[13px]",
											r.passed ? "border-emerald-200 bg-emerald-50/50" : r.passed === false ? "border-red-200 bg-red-50/50" : "border-border bg-card",
										)}
									>
										<div className="flex min-w-0 items-center gap-3">
											<span className="shrink-0">
												{r.passed ? <CheckCircle2 className="h-4 w-4 text-emerald-500" /> : r.passed === false ? <XCircle className="h-4 w-4 text-red-500" /> : <MinusCircle className="h-4 w-4 text-muted-foreground/60" />}
											</span>
											<div className="min-w-0">
												<div className="font-semibold text-foreground">Test {i + 1}</div>
												{r.error && <div className="truncate text-[12px] text-red-600">{r.error}</div>}
											</div>
										</div>
										<span className={cn("shrink-0 text-[12px] font-semibold", r.passed ? "text-emerald-600" : r.passed === false ? "text-red-600" : "text-muted-foreground")}>
											{r.passed ? labels.testPassed : r.passed === false ? labels.testFailed : "—"}
										</span>
									</li>
								))}
							</ul>
						</div>
					</ScrollArea>
				)}
			</div>
		</div>
	);
}
