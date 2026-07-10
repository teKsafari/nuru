"use client";
import { Copy, Trash2, CheckCircle2 } from "lucide-react";
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
		state: { output },
		labels,
		isCurrentLessonCompleted,
	} = usePlayground();

	const rendererId = module?.panels?.renderer?.type || "standard-terminal";
	const RendererComponent = getRenderer(rendererId);

	const handleCopy = () => {
		if (output) navigator.clipboard?.writeText(output).catch(() => {});
	};

	// The program output only. Test/requirement results live in the lesson's
	// Requirements checklist, so this panel never shows pass/fail or errors that
	// are really just unmet requirements — only the program's own output (and
	// real runtime errors, highlighted red by the error:/hitilafu: check).
	const terminalBody =
		rendererId === "standard-terminal" ? (
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
		);

	const toolbar = showToolbar && (
		<div className="flex items-center gap-1">
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
	);

	if (isMobile) {
		return (
			<div className="flex h-full w-full flex-col overflow-hidden rounded-[20px] border border-border bg-card text-foreground shadow-sm">
				<div className="flex shrink-0 items-center justify-between gap-3 px-3 py-2">
					<span className="text-[12px] font-semibold uppercase tracking-wider text-muted-foreground">
						Output
					</span>
					<div className="flex items-center gap-2">
						{isCurrentLessonCompleted && (
							<div className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-success/10 px-2.5 py-1 text-[12px] font-medium text-success">
								<CheckCircle2 className="h-3.5 w-3.5" />
								<span>Passed</span>
							</div>
						)}
						{toolbar}
					</div>
				</div>
				<div className="min-h-0 flex-1 px-3 pb-3">
					<div className="h-full overflow-hidden rounded-lg border border-border bg-muted/40">
						<ScrollArea className="h-full">
							<div className="px-4 py-3">{terminalBody}</div>
						</ScrollArea>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className="flex h-full w-full flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
			<div className="flex shrink-0 items-center justify-between border-b border-border px-4 py-2">
				<span className="text-[13px] font-semibold text-foreground">Output</span>
				{toolbar}
			</div>
			<div className="min-h-0 flex-1 p-3">
				<div className="h-full overflow-hidden rounded-lg border border-border bg-muted/40">
					<ScrollArea className="h-full">
						<div className="px-4 py-3">{terminalBody}</div>
					</ScrollArea>
				</div>
			</div>
		</div>
	);
}
