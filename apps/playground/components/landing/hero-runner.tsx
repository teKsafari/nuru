"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useTheme } from "@wrksz/themes/client";
import { Play, Loader2 } from "lucide-react";

import { useNuru } from "@nuru/wasm/react";
import { CodeEditor } from "@nuru/ui/components/code-editor";
import { nuruLanguage } from "@nuru/ui/lib/nuru-syntax";
import { cn } from "@nuru/ui/lib/utils";

interface HeroRunnerProps {
	initialCode: string;
	runLabel: string;
	runningLabel: string;
	outputLabel: string;
	readyLabel: string;
	loadingLabel: string;
	placeholder: string;
}

type OutputSegment = { text: string; isError: boolean };

// Same resolution the lesson playground uses (see anza-client.tsx): a local
// dev server serves the Go build, production serves the TinyGo build from /public.
function resolveWasmURL() {
	if (process.env.NODE_ENV === "development") {
		return process.env.NEXT_PUBLIC_WASM_DEV_URL || "http://localhost:7070/main.wasm";
	}
	return "/main.wasm";
}

export function HeroRunner({
	initialCode,
	runLabel,
	runningLabel,
	outputLabel,
	readyLabel,
	loadingLabel,
	placeholder,
}: HeroRunnerProps) {
	const { resolvedTheme } = useTheme();
	const [code, setCode] = useState(initialCode);
	const [segments, setSegments] = useState<OutputSegment[]>([]);
	const [running, setRunning] = useState(false);
	// CodeMirror and the resolved theme are client-only; render a static preview
	// during SSR/first paint to avoid hydration mismatch (same trick as ThemeToggle).
	const [mounted, setMounted] = useState(false);
	useEffect(() => setMounted(true), []);

	const wasmURL = useMemo(() => resolveWasmURL(), []);

	// Push-based: the WASM runtime calls this for every andika()/error while
	// execute() runs. Accumulate the chunks in order.
	const nuru = useNuru((text, isError) => {
		setSegments((prev) => [...prev, { text, isError }]);
	}, { wasmURL });

	const ready = nuru.initialized;

	const run = useCallback(() => {
		if (!ready || running) return;
		setSegments([]);
		setRunning(true);
		try {
			// Interpretation is synchronous; output has streamed through the
			// receiver by the time this returns.
			nuru.execute(code);
		} catch (err) {
			setSegments((prev) => [...prev, { text: String(err), isError: true }]);
		} finally {
			setRunning(false);
		}
	}, [ready, running, nuru, code]);

	return (
		<div className="border-border bg-card w-full overflow-hidden rounded-2xl border shadow-lg">
			<div className="flex flex-col">
				{/* Title bar */}
				<div className="border-border flex items-center gap-2 border-b px-4 py-2.5">
					<span className="flex gap-1.5">
						<span className="size-3 rounded-full bg-red-400/80" />
						<span className="size-3 rounded-full bg-yellow-400/80" />
						<span className="size-3 rounded-full bg-green-400/80" />
					</span>
					<span className="text-muted-foreground ml-1 font-mono text-xs">habari.nuru</span>
					<span
						className={cn(
							"ml-auto flex items-center gap-1.5 text-xs font-medium",
							ready ? "text-success" : "text-muted-foreground",
						)}
					>
						<span
							className={cn(
								"size-2 rounded-full",
								ready ? "bg-success" : "bg-muted-foreground/50 animate-pulse",
							)}
						/>
						{ready ? readyLabel : loadingLabel}
					</span>
				</div>

				{/* Editor */}
				<div className="min-h-[168px]">
					{mounted ? (
						<CodeEditor
							code={code}
							onChange={setCode}
							theme={resolvedTheme === "light" ? "light" : "dark"}
							extensions={[nuruLanguage]}
							className="h-full"
						/>
					) : (
						<pre className="text-foreground overflow-auto px-4 py-3 font-mono text-[13px] leading-relaxed whitespace-pre-wrap">
							{code}
						</pre>
					)}
				</div>

				{/* Run bar */}
				<div className="border-border flex items-center justify-between border-t px-3 py-2">
					<span className="text-muted-foreground pl-1 font-mono text-[11px] tracking-wide uppercase">
						{outputLabel}
					</span>
					<button
						type="button"
						onClick={run}
						disabled={!ready || running}
						className="bg-primary text-primary-foreground inline-flex items-center gap-1.5 rounded-md px-3.5 py-1.5 text-sm font-semibold shadow-sm transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
					>
						{running ? (
							<Loader2 className="size-4 animate-spin" />
						) : (
							<Play className="size-4 fill-current" />
						)}
						{running ? runningLabel : runLabel}
					</button>
				</div>

				{/* Output console */}
				<pre className="bg-muted/40 text-foreground max-h-40 min-h-[60px] overflow-auto px-4 py-3 font-mono text-[13px] leading-relaxed whitespace-pre-wrap">
					{segments.length === 0 ? (
						<span className="text-muted-foreground">{placeholder}</span>
					) : (
						// Each receiver call (one andika() / one error) is its own line,
						// matching how the lesson playground presents stdout.
						segments.map((seg, i) => (
							<div key={i} className={seg.isError ? "text-destructive" : undefined}>
								{seg.text}
							</div>
						))
					)}
				</pre>
			</div>
		</div>
	);
}
