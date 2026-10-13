"use client";

import { AlertTriangle, Check, CircleCheck, CircleX, Loader2, Play, Sparkles, X } from "lucide-react";
import { Button } from "@nuru/ui/components/button";
import { Label } from "@nuru/ui/components/label";
import { Textarea } from "@nuru/ui/components/textarea";
import { ubaoSignature, type GradeResult } from "@nuru/ui/validation/grader";
import type { TestCaseV1 } from "@nuru/ui/validation/test-cases";
import { cn } from "@nuru/ui/lib/utils";
import type { Dict } from "@/lib/dict";
import type { Capture, RunnerState } from "./use-nuru-runner";
import { drewSomething, litSomething } from "./generate-tests";
import { KobeStill } from "./kobe-still";
import { UbaoStrip } from "./ubao-strip";
import { TYPE_ACCENT } from "./test-card";

export type Grade = { passed: boolean; results: Record<string, GradeResult> };

export type VerifyOutcome = {
	snapshot: string;
	tests: TestCaseV1[];
	/** jaza() answers used for the output shown, when the solution needed them. */
	plainInput?: string[];
	solution: Grade & { plain: Capture };
	starter: Grade | null;
};

function Banner({ tone, icon, title, note }: { tone: "ok" | "bad" | "warn"; icon: React.ReactNode; title: string; note?: string }) {
	return (
		<div
			role="status"
			className={cn(
				"flex gap-3 rounded-md border-2 border-mstari p-3",
				tone === "ok" && "bg-[color-mix(in_oklab,var(--mwani)_18%,var(--card))]",
				tone === "bad" && "bg-[color-mix(in_oklab,var(--pilipili)_16%,var(--card))]",
				tone === "warn" && "bg-[color-mix(in_oklab,var(--chungwa)_22%,var(--card))]",
			)}
		>
			<span className={cn("mt-0.5 shrink-0 [&_svg]:size-5", tone === "ok" && "text-mwani", tone === "bad" && "text-pilipili", tone === "warn" && "text-chungwa")}>{icon}</span>
			<div>
				<p className="font-semibold leading-snug">{title}</p>
				{note && <p className="mt-0.5 text-sm italic text-muted-foreground">{note}</p>}
			</div>
		</div>
	);
}

function Mark({ r }: { r?: GradeResult }) {
	if (!r) return <span className="text-muted-foreground">-</span>;
	return (
		<span className={cn("inline-flex size-6 items-center justify-center rounded-sm border-2 border-mstari", r.passed ? "bg-mwani text-white" : "bg-pilipili text-[#15120f]")} title={typeof r.score === "number" ? `${Math.round(r.score * 100)}%` : undefined}>
			{r.passed ? <Check className="size-3.5" /> : <X className="size-3.5" />}
		</span>
	);
}

export function VerifyPanel({
	t,
	runner,
	running,
	outcome,
	stale,
	error,
	onRun,
	onGenerate,
	generating,
	genNote,
	stdin,
	setStdin,
}: {
	t: Dict;
	runner: RunnerState;
	running: boolean;
	outcome: VerifyOutcome | null;
	stale: boolean;
	error: string | null;
	onRun: () => void;
	onGenerate: () => void;
	generating: boolean;
	genNote: string | null;
	stdin: string;
	setStdin: (v: string) => void;
}) {
	const v = t.verify;
	const busy = running || generating || runner !== "ready";
	const plain = outcome?.solution.plain;
	const ubao = plain && litSomething(plain.events) ? ubaoSignature(plain.events) : "";
	const lcd = plain ? [...plain.events].reverse().find((e) => e.ch === "ubao" && e.t === "lcd")?.s : undefined;

	return (
		<div className="space-y-5">
			<p className="text-sm text-muted-foreground">{v.lead}</p>

			<Button type="button" variant="ink" size="lg" className="w-full" onClick={onRun} disabled={busy}>
				{running || runner === "loading" ? <Loader2 className="animate-spin" /> : <Play />}
				{runner === "loading" ? v.loading : running ? v.running : v.run}
			</Button>
			{runner === "error" && <Banner tone="bad" icon={<AlertTriangle />} title={v.loadError} />}
			{error && <Banner tone="warn" icon={<AlertTriangle />} title={error} />}

			{outcome && (
				<div className={cn("space-y-4 transition-opacity", stale && "opacity-70")}>
					{stale && <p className="lebo text-chungwa">{v.staleNote}</p>}
					{outcome.tests.length === 0 ? (
						<Banner tone="warn" icon={<AlertTriangle />} title={v.noTests} />
					) : outcome.solution.passed ? (
						<Banner tone="ok" icon={<CircleCheck />} title={v.solutionPasses} note={t.app.methaliSuccess} />
					) : (
						<Banner tone="bad" icon={<CircleX />} title={v.solutionFails} note={t.app.methaliFail} />
					)}
					{outcome.starter &&
						(outcome.starter.passed ? (
							<Banner tone="warn" icon={<AlertTriangle />} title={v.starterPasses} />
						) : (
							<Banner tone="ok" icon={<CircleCheck />} title={v.starterOk} />
						))}

					{outcome.tests.length > 0 && (
						<div className="overflow-x-auto rounded-md border-2 border-mstari">
							<table className="w-full text-sm">
								<thead className="bg-karatasi-2">
									<tr className="border-b-2 border-mstari">
										<th className="lebo px-2 py-2 text-left">{t.editor.test}</th>
										<th className="lebo px-2 py-2 text-center">{t.editor.solution}</th>
										<th className="lebo px-2 py-2 text-center">{t.editor.starter}</th>
									</tr>
								</thead>
								<tbody>
									{outcome.tests.map((test, i) => {
										const key = test.id ?? String(i);
										const sr = outcome.solution.results[key];
										return (
											<tr key={key} className="border-b border-mstari/15 last:border-0">
												<td className="px-2 py-1.5">
													<span className="flex items-center gap-2">
														<span className={cn("size-2.5 shrink-0 rounded-full border border-mstari", TYPE_ACCENT[test.type].split(" ")[0])} />
														<span className="font-semibold">{i + 1}</span>
														<span className="truncate text-muted-foreground">{t.testTypes[test.type]}</span>
														{typeof sr?.score === "number" && <span className="font-mono text-xs text-muted-foreground">{Math.round(sr.score * 100)}%</span>}
													</span>
												</td>
												<td className="px-2 py-1.5 text-center">
													<Mark r={sr} />
												</td>
												<td className="px-2 py-1.5 text-center">
													<Mark r={outcome.starter?.results[key]} />
												</td>
											</tr>
										);
									})}
								</tbody>
							</table>
						</div>
					)}

					{plain && (
						<div className="space-y-3">
							<div>
								<p className="lebo mb-1.5">
									{v.output}
									{outcome.plainInput && <span className="ml-2 normal-case tracking-normal text-muted-foreground">jaza() ← {outcome.plainInput.join(", ")}</span>}
								</p>
								<pre className="max-h-48 overflow-auto whitespace-pre-wrap rounded-md border-2 border-mstari bg-[var(--terminal-bg)] p-3 font-mono text-xs text-[var(--terminal-fg)]">
									{plain.stdout || <span className="opacity-60">{v.noOutput}</span>}
									{plain.stderr && <span className="mt-2 block text-[#ff8a80]">{plain.stderr}</span>}
								</pre>
							</div>
							{drewSomething(plain.events) && (
								<div>
									<p className="lebo mb-1.5">{v.drawing}</p>
									<KobeStill events={plain.events} className="max-w-[280px]" />
								</div>
							)}
							{ubao && (
								<div>
									<p className="lebo mb-1.5">{v.board}</p>
									<UbaoStrip sequence={ubao} className="max-w-xs" />
									{lcd && <p className="mt-2 inline-block rounded-sm border-2 border-mstari bg-[#9bbc0f] px-2 py-1 font-mono text-sm text-[#15120f]">{lcd}</p>}
								</div>
							)}
						</div>
					)}
				</div>
			)}

			<div className="space-y-3 border-t-2 border-dashed border-mstari/30 pt-5">
				<div>
					<p className="font-semibold">{v.generate}</p>
					<p className="text-sm text-muted-foreground">{v.generateHelp}</p>
				</div>
				<div className="space-y-1.5">
					<Label htmlFor="verify-stdin" className="lebo">
						{v.stdinLabel}
					</Label>
					<Textarea id="verify-stdin" rows={2} value={stdin} onChange={(e) => setStdin(e.target.value)} className="font-mono text-sm" placeholder={"Asha\n12"} />
				</div>
				<Button type="button" variant="outline" className="w-full" onClick={onGenerate} disabled={busy}>
					{generating ? <Loader2 className="animate-spin" /> : <Sparkles />}
					{v.generate}
				</Button>
				{genNote && (
					<p role="status" className="text-sm font-semibold">
						{genNote}
					</p>
				)}
			</div>
		</div>
	);
}
