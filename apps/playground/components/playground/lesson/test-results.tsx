"use client";

import { ArrowRight, Check, ListChecks, LoaderCircle, Lock, X } from "lucide-react";
import type { TestCaseV1 } from "@nuru/ui/validation/test-cases";
import type { GradeResult } from "@nuru/ui/validation/grader";
import { Badge } from "@nuru/ui/components/badge";
import { Button } from "@nuru/ui/components/button";
import { cn } from "@nuru/ui/lib/utils";
import { fill } from "../shared";

export interface ResultsLabels {
	testsTitle: string;
	testsEmpty: string;
	passed: string;
	failed: string;
	hidden: string;
	expected: string;
	actual: string;
	input: string;
	nothing: string;
	close: string;
	score: string;
	checking: string;
	successTitle: string;
	successText: string;
	methaliSuccess: string;
	methaliSuccessGloss: string;
	methaliFail: string;
	methaliFailGloss: string;
	failText: string;
	testTypes: Record<string, string>;
}

export interface Verdict {
	passed: boolean;
	results: Record<string, GradeResult>;
}

interface TestResultsProps {
	tests: TestCaseV1[];
	verdict: Verdict | null;
	checking: boolean;
	labels: ResultsLabels;
	nextLabel: string;
	onNext?: () => void;
}

export function testKey(t: TestCaseV1, i: number) {
	return t.id ?? String(i);
}

export function TestResults({ tests, verdict, checking, labels, nextLabel, onNext }: TestResultsProps) {
	const passedCount = verdict ? tests.filter((t, i) => verdict.results[testKey(t, i)]?.passed).length : 0;

	return (
		<div className="h-full overflow-auto bg-karatasi px-4 py-4 sm:px-5" data-testid="test-results">
			{checking && (
				<div className="mb-4 flex items-center gap-2 font-mono text-sm text-muted-foreground">
					<LoaderCircle className="size-4 animate-spin" />
					{labels.checking}
				</div>
			)}

			{!checking && verdict?.passed && (
				<div className="mji mb-5 overflow-hidden" data-testid="success">
					<div className="pindo text-jua" aria-hidden />
					<div className="flex flex-col items-start gap-3 p-5">
						<h3 className="font-display text-3xl font-extrabold">{labels.successTitle}</h3>
						<p className="text-sm text-muted-foreground">{labels.successText}</p>
						<blockquote className="mt-1">
							<p className="font-display text-xl font-bold italic">
								<span className="alama-jua">{labels.methaliSuccess}</span>
							</p>
							{labels.methaliSuccessGloss && <p className="mt-1 text-sm text-muted-foreground">{labels.methaliSuccessGloss}</p>}
						</blockquote>
						{onNext && (
							<Button size="lg" onClick={onNext} className="mt-2 h-14 w-full px-8 text-lg sm:w-auto" data-testid="next-lesson">
								{nextLabel}
								<ArrowRight className="size-5!" />
							</Button>
						)}
					</div>
					<div className="pindo text-mwani" aria-hidden />
				</div>
			)}

			{!checking && verdict && !verdict.passed && (
				<div className="mb-5 rounded-lg border-2 border-mstari bg-[color-mix(in_oklab,var(--pilipili)_14%,var(--card))] p-4 shadow-kivuli-sm" data-testid="failure">
					<p className="font-display text-lg font-bold italic">{labels.methaliFail}</p>
					{labels.methaliFailGloss && <p className="text-sm text-muted-foreground">{labels.methaliFailGloss}</p>}
					<p className="mt-2 text-sm">{fill(labels.failText, { passed: passedCount, total: tests.length })}</p>
				</div>
			)}

			<div className="mb-2 flex items-center gap-2">
				<ListChecks className="size-4" />
				<h4 className="lebo">{labels.testsTitle}</h4>
				{verdict && (
					<span className="lebo ml-auto text-muted-foreground">
						{passedCount} / {tests.length}
					</span>
				)}
			</div>

			{!verdict && !checking && <p className="mb-3 text-sm text-muted-foreground">{labels.testsEmpty}</p>}

			<ul className="space-y-2.5">
				{tests.map((t, i) => {
					const r = verdict?.results[testKey(t, i)];
					const showDetail = r && !r.passed;
					const pct = r?.score !== undefined ? Math.round(r.score * 100) : null;
					return (
						<li
							key={testKey(t, i)}
							data-test={testKey(t, i)}
							data-passed={r ? (r.passed ? "1" : "0") : ""}
							className={cn(
								"rounded-lg border-2 border-mstari bg-card p-3",
								r?.passed && "bg-[color-mix(in_oklab,var(--mwani)_10%,var(--card))]",
							)}
						>
							<div className="flex flex-wrap items-center gap-2">
								{r ? (
									r.passed ? (
										<Badge variant="success">
											<Check className="size-3" strokeWidth={3} />
											{labels.passed}
										</Badge>
									) : (
										<Badge variant="destructive">
											<X className="size-3" strokeWidth={3} />
											{labels.failed}
										</Badge>
									)
								) : (
									<Badge variant="secondary">{i + 1}</Badge>
								)}
								<span className="text-sm font-semibold">
									{t.isPublic ? (
										(labels.testTypes[t.type] ?? t.type)
									) : (
										<span className="inline-flex items-center gap-1.5 text-muted-foreground">
											<Lock className="size-3.5" />
											{labels.hidden}
										</span>
									)}
								</span>
								{pct !== null && (
									<Badge variant={r!.passed ? "success" : pct >= 60 ? "default" : "outline"} className="ml-auto">
										{r!.passed ? fill(labels.score, { pct }) : fill(labels.close, { pct })}
									</Badge>
								)}
							</div>

							{showDetail && <p className="mt-2 text-sm text-foreground/85">{t.message}</p>}
							{showDetail && r.error && !t.isPublic && <p className="mt-1 font-mono text-xs text-pilipili">{r.error.split("\n")[0]}</p>}

							{showDetail && t.isPublic && (t.type === "io" || t.type === "exact_output" || t.type === "ubao_mfuatano") && (
								<div className="mt-3 space-y-2">
									{t.type === "io" && t.input && <Mini label={labels.input} text={t.input} tone="plain" />}
									<div className="grid gap-2 sm:grid-cols-2">
										<Mini label={labels.expected} text={t.expectedOutput ?? ""} empty={labels.nothing} tone="ok" />
										<Mini label={labels.actual} text={r.actualOutput ?? ""} empty={labels.nothing} tone="bad" error={r.error} />
									</div>
								</div>
							)}
							{showDetail && t.isPublic && t.type === "match_output" && r.actualOutput !== undefined && (
								<div className="mt-3">
									<Mini label={labels.actual} text={r.actualOutput} empty={labels.nothing} tone="bad" />
								</div>
							)}
						</li>
					);
				})}
			</ul>
		</div>
	);
}

function Mini({ label, text, empty, tone, error }: { label: string; text: string; empty?: string; tone: "ok" | "bad" | "plain"; error?: string }) {
	return (
		<div className="min-w-0">
			<div className={cn("lebo mb-1", tone === "ok" ? "text-mwani" : tone === "bad" ? "text-pilipili" : "text-muted-foreground")}>{label}</div>
			<pre className="max-h-48 overflow-auto rounded-md border-2 border-mstari bg-[var(--terminal-bg)] p-2.5 font-mono text-[12.5px] leading-relaxed whitespace-pre-wrap text-[var(--terminal-fg)]">
				{text || <span className="opacity-50">{empty}</span>}
				{error && <span className="block text-pilipili">{error}</span>}
			</pre>
		</div>
	);
}
