"use client";

import { useEffect, useRef, useState } from "react";
import { CornerDownLeft, LoaderCircle } from "lucide-react";
import { cn } from "@nuru/ui/lib/utils";
import type { Phase, RunSummary, TermLine } from "./use-program";
import type { RuntimeState } from "./use-nuru-runtime";

export interface TerminalLabels {
	empty: string;
	loading: string;
	loadFailed: string;
	running: string;
	waiting: string;
	inputPlaceholder: string;
	send: string;
	done: string; // "{ms}"
	failed: string; // "{ms}"
	stopped: string;
	timeout: string; // "{s}"
	crashed: string;
}

interface TerminalProps {
	lines: TermLine[];
	phase: Phase;
	prompt: string | null;
	summary: RunSummary | null;
	runtimeState: RuntimeState;
	onAnswer: (text: string) => void;
	labels: TerminalLabels;
	className?: string;
	/** Rendered under the transcript (e.g. test results). */
	children?: React.ReactNode;
}

export function fill(template: string, values: Record<string, string | number>) {
	return template.replace(/\{(\w+)\}/g, (_, k) => String(values[k] ?? ""));
}

/** Kanga terminal: ink ground, cream mono text, chili errors, inline jaza() input. */
export function Terminal({ lines, phase, prompt, summary, runtimeState, onAnswer, labels, className, children }: TerminalProps) {
	const scrollRef = useRef<HTMLDivElement>(null);
	const inputRef = useRef<HTMLInputElement>(null);
	const [draft, setDraft] = useState("");
	const stick = useRef(true);

	// Follow the output unless the learner scrolled up to read.
	useEffect(() => {
		const el = scrollRef.current;
		if (el && stick.current) el.scrollTop = el.scrollHeight;
	}, [lines, phase, summary, children]);

	useEffect(() => {
		if (phase === "input") {
			setDraft("");
			const el = scrollRef.current;
			if (el) el.scrollTop = el.scrollHeight;
			// The page may first have to bring the terminal pane forward.
			const id = setTimeout(() => inputRef.current?.focus({ preventScroll: true }), 60);
			return () => clearTimeout(id);
		}
	}, [phase, prompt]);

	const submit = () => {
		onAnswer(draft);
		setDraft("");
	};

	const status = summary ? statusLine(summary, labels) : null;

	return (
		<div
			className={cn(
				"relative flex h-full min-h-0 flex-col bg-[var(--terminal-bg)] font-mono text-[13.5px] leading-relaxed text-[var(--terminal-fg)]",
				className,
			)}
		>
			<div
				ref={scrollRef}
				onScroll={(e) => {
					const el = e.currentTarget;
					stick.current = el.scrollHeight - el.scrollTop - el.clientHeight < 24;
				}}
				className="min-h-0 flex-1 overflow-auto px-4 py-3"
				role="log"
				aria-live="polite"
			>
				{lines.length === 0 && phase === "idle" && !summary && (
					<p className="text-[var(--terminal-fg)]/50 select-none">
						{runtimeState === "loading" ? (
							<span className="inline-flex items-center gap-2">
								<LoaderCircle className="size-3.5 animate-spin" /> {labels.loading}
							</span>
						) : runtimeState === "error" ? (
							<span className="text-pilipili">{labels.loadFailed}</span>
						) : (
							<>
								<span className="text-jua">$</span> {labels.empty}
							</>
						)}
					</p>
				)}

				{lines.map((l) => (
					<div
						key={l.id}
						className={cn(
							"break-words whitespace-pre-wrap",
							l.kind === "err" && "text-pilipili",
							l.kind === "info" && "text-[var(--terminal-fg)]/60 italic",
						)}
					>
						{l.kind === "answer" ? (
							<>
								<span className="text-[var(--terminal-fg)]/80">{l.prompt}</span>
								<span className="text-jua">{l.text}</span>
							</>
						) : l.text === "" ? (
							" "
						) : (
							l.text
						)}
					</div>
				))}

				{phase === "input" && (
					<form
						className="flex flex-wrap items-center gap-x-1 gap-y-2"
						onSubmit={(e) => {
							e.preventDefault();
							submit();
						}}
					>
						{prompt ? <span className="whitespace-pre-wrap">{prompt}</span> : null}
						<span className="flex min-w-[12rem] flex-1 items-center gap-2">
							<span className="text-jua" aria-hidden>
								&gt;
							</span>
							<input
								ref={inputRef}
								value={draft}
								onChange={(e) => setDraft(e.target.value)}
								aria-label={prompt || labels.inputPlaceholder}
								placeholder={labels.inputPlaceholder}
								autoComplete="off"
								autoCapitalize="off"
								spellCheck={false}
								enterKeyHint="send"
								className="min-w-0 flex-1 border-b-2 border-jua bg-transparent py-1 text-jua caret-jua outline-none placeholder:text-[var(--terminal-fg)]/35"
							/>
							<button
								type="submit"
								className="inline-flex h-9 shrink-0 items-center gap-1.5 rounded-md border-2 border-jua px-3 text-xs font-bold text-jua hover:bg-jua hover:text-wino"
							>
								<CornerDownLeft className="size-3.5" />
								{labels.send}
							</button>
						</span>
					</form>
				)}

				{phase === "running" && (
					<div className="mt-1 flex items-center gap-2 text-[var(--terminal-fg)]/50">
						<span className="inline-block h-4 w-2 animate-pulse bg-jua" aria-hidden />
						<span className="sr-only">{labels.running}</span>
					</div>
				)}

				{status && (
					<div className={cn("mt-3 flex items-center gap-2 border-t border-dashed border-[var(--terminal-fg)]/20 pt-2 text-xs", status.tone)}>
						<span className="lebo">{status.text}</span>
					</div>
				)}
				{children}
			</div>
			{phase === "input" && (
				<div className="pointer-events-none absolute top-2 right-3">
					<span className="lebo rounded-sm bg-jua px-1.5 py-0.5 text-wino">{labels.waiting}</span>
				</div>
			)}
		</div>
	);
}

function statusLine(s: RunSummary, labels: TerminalLabels): { text: string; tone: string } {
	switch (s.status) {
		case "ok":
		case "needs-input":
			if (s.hadError) return { text: fill(labels.failed, { ms: s.ms }), tone: "text-pilipili" };
			return { text: fill(labels.done, { ms: s.ms }), tone: "text-mwani" };
		case "stopped":
			return { text: labels.stopped, tone: "text-chungwa" };
		case "timeout":
			return { text: fill(labels.timeout, { s: Math.round((s.timeoutMs ?? 0) / 1000) }), tone: "text-chungwa" };
		default:
			return { text: labels.crashed, tone: "text-pilipili" };
	}
}
