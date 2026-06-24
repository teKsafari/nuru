"use client";
import { useState } from "react";
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
		state: { output, testErrors, testResults },
		labels,
		isCurrentLessonCompleted,
	} = usePlayground();

	const [tab, setTab] = useState<"output" | "tests">("output");
	const rendererId = module?.panels?.renderer?.type || "standard-terminal";
	const RendererComponent = getRenderer(rendererId);
	const tests = Object.entries(testResults || {});
	const passedCount = tests.filter(([, r]) => r.passed).length;
	const totalTests = tests.length;
	const allPassed = totalTests > 0 && passedCount === totalTests;

	const handleCopy = () => {
		if (output) navigator.clipboard?.writeText(output).catch(() => {});
	};

	if (isMobile) {
		return (
			<div className="flex h-full w-full flex-col overflow-hidden rounded-[20px] border border-slate-200 bg-white text-slate-900 shadow-sm">
				<div className="flex shrink-0 items-center justify-between border-b border-slate-200 px-4 py-3">
					<h2 className="text-[15px] font-semibold text-slate-900">Output</h2>
					{isCurrentLessonCompleted && (
						<div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-[12px] font-medium text-emerald-600">
							<CheckCircle2 className="h-3.5 w-3.5" />
							<span>Passed</span>
						</div>
					)}
				</div>

				<div className="px-4 py-3">
					<div className="grid grid-cols-2 rounded-2xl border border-slate-200 bg-slate-50 p-1">
						{(["output", "tests"] as const).map((t) => (
							<button
								key={t}
								onClick={() => setTab(t)}
								className={cn(
									"rounded-[14px] px-4 py-2.5 text-[13px] font-medium transition-all",
									tab === t
										? "bg-white text-blue-600 shadow-sm"
										: "text-slate-500 hover:text-slate-700",
								)}
							>
								{t === "output" ? "Output" : "Tests"}
							</button>
						))}
					</div>
				</div>

				<div className="min-h-0 flex-1">
					{tab === "output" ? (
						<div className="flex h-full flex-col px-4 pb-4">
							{showToolbar && (
								<div className="mb-3 flex justify-end gap-1">
									<button
										onClick={handleCopy}
										aria-label="Copy output"
										className="rounded-md p-1.5 text-slate-400 hover:bg-slate-800 hover:text-slate-100"
									>
										<Copy className="h-4 w-4" />
									</button>
									<button
										aria-label="Clear output"
										className="rounded-md p-1.5 text-slate-400 hover:bg-slate-800 hover:text-slate-100"
									>
										<Trash2 className="h-4 w-4" />
									</button>
								</div>
							)}
							<div className="min-h-0 flex-1 overflow-hidden rounded-2xl border border-slate-800 bg-[#071225]">
								<ScrollArea className="h-full">
									<div className="px-5 py-4">
										{rendererId === "standard-terminal" ? (
											output ? (
										<pre className="whitespace-pre-wrap font-mono text-[13px] leading-7 text-slate-100">
													{output.split("\n").map((line, i) => {
														const isError =
															line.toLowerCase().includes("error:") ||
															line.toLowerCase().includes("hitilafu:");
														return (
															<span key={i} className={cn("block", isError && "text-red-400")}>
																{line}
															</span>
														);
													})}
												</pre>
											) : (
												<p className="font-mono text-[13px] italic text-slate-500">
													{labels.outputPlaceholder}
												</p>
											)
										) : RendererComponent ? (
											<RendererComponent />
										) : (
											<p className="font-mono text-[12px] text-slate-500">
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
									<span className={cn("font-medium", allPassed ? "text-emerald-600" : "text-slate-600")}>
										{passedCount} / {totalTests || 0} tests passed
									</span>
									<span className="text-slate-500">
										{allPassed ? "All tests passed! 🎉" : "Keep going"}
									</span>
								</div>

								{testErrors && testErrors.length > 0 && (
									<div className="rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3">
										<div className="mb-1 flex items-center gap-2 text-[13px] font-semibold text-red-300">
											<AlertCircle className="h-4 w-4" />
											{labels.error}
										</div>
										<ul className="space-y-1 text-[12.5px] text-red-200/90">
											{testErrors.map((e, i) => (
												<li key={i}>{e}</li>
											))}
										</ul>
									</div>
								)}

								<ul className="space-y-3">
									{tests.length === 0 && (
									<li className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-5 text-center text-[13px] text-slate-500">
											Run the code to see test results.
										</li>
									)}
									{tests.map(([id, r], i) => (
										<li
											key={id}
										className="flex items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-4"
										>
											<div className="flex min-w-0 items-center gap-3">
												<span className="shrink-0">
													{r.passed ? (
														<CheckCircle2 className="h-6 w-6 text-emerald-400" />
													) : r.passed === false ? (
														<XCircle className="h-6 w-6 text-red-400" />
													) : (
														<MinusCircle className="h-6 w-6 text-slate-500" />
													)}
												</span>
												<div className="min-w-0">
											<div className="text-[13px] font-medium text-slate-900">Test {i + 1}</div>
													<div className="truncate text-[12px] text-slate-400">
														{r.error || "Expected output"}
													</div>
												</div>
											</div>
											<div className="flex items-center gap-3">
												<span className={cn("text-[14px] font-medium", r.passed ? "text-emerald-400" : r.passed === false ? "text-red-400" : "text-slate-500")}>
													{r.passed ? labels.testPassed : r.passed === false ? labels.testFailed : "—"}
												</span>
												<ChevronDown className="h-4 w-4 text-slate-500" />
											</div>
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

	return (
		<div className="flex h-full w-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
			<div className="flex shrink-0 items-center justify-between border-b border-slate-200 px-4">
				<div className="flex items-center gap-1">
					{(["output", "tests"] as const).map((t) => (
						<button
							key={t}
							onClick={() => setTab(t)}
							className={cn(
								"relative px-2 py-3 text-[13px] font-semibold capitalize transition-colors",
								tab === t ? "text-blue-600" : "text-slate-500 hover:text-slate-700",
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
					<div className="m-4 flex min-h-0 flex-1 flex-col overflow-hidden rounded-xl border border-slate-800 bg-[#0b1220]">
						{showToolbar && (
							<div className="flex items-center justify-end gap-1 px-2 py-1.5">
								<button
									onClick={handleCopy}
									aria-label="Copy output"
									className="rounded-md p-1.5 text-slate-400 hover:bg-slate-800 hover:text-slate-200"
								>
									<Copy className="h-3.5 w-3.5" />
								</button>
								<button
									aria-label="Clear output"
									className="rounded-md p-1.5 text-slate-400 hover:bg-slate-800 hover:text-slate-200"
								>
									<Trash2 className="h-3.5 w-3.5" />
								</button>
							</div>
						)}
						<ScrollArea className="flex-1">
							<div className="px-4 pb-4">
								{rendererId === "standard-terminal" ? (
									output ? (
										<pre className="whitespace-pre-wrap font-mono text-[12.5px] leading-relaxed text-slate-100">
											{output.split("\n").map((line, i) => {
												const isError =
													line.toLowerCase().includes("error:") ||
													line.toLowerCase().includes("hitilafu:");
												return (
													<span key={i} className={cn("block", isError && "text-red-400")}>
														{line}
													</span>
												);
											})}
										</pre>
									) : (
										<p className="font-mono text-[12px] italic text-slate-500">{labels.outputPlaceholder}</p>
									)
								) : RendererComponent ? (
									<RendererComponent />
								) : (
									<p className="font-mono text-[12px] text-slate-500">Renderer "{rendererId}" not found</p>
								)}
							</div>
						</ScrollArea>
					</div>
				) : (
					<ScrollArea className="flex-1">
						<div className="p-4">
							{totalTests > 0 && (
								<div className="mb-3 flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
									<div className="flex items-center gap-2 text-[13px] font-semibold">
										{allPassed ? <><span>All tests passed!</span><span aria-hidden>🎉</span></> : <span className="text-slate-700">{passedCount} of {totalTests} tests passed</span>}
									</div>
									<div className={cn("text-[12px] font-semibold", allPassed ? "text-emerald-600" : "text-slate-500")}>
										{passedCount} / {totalTests} tests passed
									</div>
								</div>
							)}

							<ul className="space-y-2">
								{tests.length === 0 && (
									<li className="rounded-xl border border-dashed border-slate-200 bg-slate-50/60 px-4 py-6 text-center text-[12.5px] text-slate-500">
										Bonyeza <strong className="font-semibold text-slate-700">{labels.run}</strong> ili kuona matokeo ya majaribio.
									</li>
								)}
								{tests.map(([id, r], i) => (
									<li
										key={id}
										className={cn(
											"flex items-center justify-between gap-3 rounded-xl border px-4 py-3 text-[13px]",
											r.passed ? "border-emerald-200 bg-emerald-50/50" : r.passed === false ? "border-red-200 bg-red-50/50" : "border-slate-200 bg-white",
										)}
									>
										<div className="flex min-w-0 items-center gap-3">
											<span className="shrink-0">
												{r.passed ? <CheckCircle2 className="h-4 w-4 text-emerald-500" /> : r.passed === false ? <XCircle className="h-4 w-4 text-red-500" /> : <MinusCircle className="h-4 w-4 text-slate-300" />}
											</span>
											<div className="min-w-0">
												<div className="font-semibold text-slate-800">Test {i + 1}</div>
												{r.error && <div className="truncate text-[12px] text-red-600">{r.error}</div>}
											</div>
										</div>
										<span className={cn("shrink-0 text-[12px] font-semibold", r.passed ? "text-emerald-600" : r.passed === false ? "text-red-600" : "text-slate-400")}>
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
