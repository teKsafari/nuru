"use client";

import type { ReactNode } from "react";
import { CircuitBoard, ListChecks, SquareTerminal, Turtle } from "lucide-react";
import { cn } from "@nuru/ui/lib/utils";
import type { Program } from "./use-program";
import { Terminal, type TerminalLabels } from "./terminal";
import { KobeCanvas, type KobeLabels } from "./kobe-canvas";
import { UbaoBoard, type UbaoLabels } from "./ubao-board";

export type OutputTab = "terminal" | "kobe" | "ubao" | "tests";

export interface OutputLabels {
	tabs: Record<OutputTab, string>;
	terminal: TerminalLabels;
	kobe: KobeLabels;
	ubao: UbaoLabels;
}

const ICONS: Record<OutputTab, typeof SquareTerminal> = {
	terminal: SquareTerminal,
	kobe: Turtle,
	ubao: CircuitBoard,
	tests: ListChecks,
};

interface OutputTabsProps {
	program: Program;
	tabs: OutputTab[];
	active: OutputTab;
	onChange: (tab: OutputTab) => void;
	labels: OutputLabels;
	ghost?: string;
	/** Content of the "tests" tab. */
	tests?: ReactNode;
	/** Small marker on a tab, e.g. pass/fail on tests. */
	badges?: Partial<Record<OutputTab, ReactNode>>;
	/** Extra controls at the right end of the tab bar. */
	actions?: ReactNode;
	className?: string;
}

/**
 * Output area shared by Uwanja and lessons. Every pane stays mounted so a
 * drawing keeps animating while the learner looks at the terminal.
 */
export function OutputTabs({ program, tabs, active, onChange, labels, ghost, tests, badges, actions, className }: OutputTabsProps) {
	return (
		<div className={cn("flex h-full min-h-0 flex-col bg-card", className)}>
			<div className="flex shrink-0 items-stretch justify-between gap-2 border-b-2 border-mstari bg-karatasi-2 pr-2">
				<div role="tablist" className="flex min-w-0 items-stretch overflow-x-auto">
					{tabs.map((t) => {
						const Icon = ICONS[t];
						const on = t === active;
						return (
							<button
								key={t}
								role="tab"
								aria-selected={on}
								data-tab={t}
								onClick={() => onChange(t)}
								className={cn(
									"relative inline-flex h-11 shrink-0 items-center gap-2 border-r-2 border-mstari px-4 text-sm font-semibold transition-colors",
									on ? "bg-card text-foreground" : "text-muted-foreground hover:bg-card/60 hover:text-foreground",
								)}
							>
								<Icon className="size-4" />
								{labels.tabs[t]}
								{badges?.[t]}
								{on && <span className="absolute inset-x-0 -bottom-[2px] h-[3px] bg-jua" aria-hidden />}
							</button>
						);
					})}
				</div>
				{actions && <div className="flex shrink-0 items-center gap-1.5">{actions}</div>}
			</div>
			<div className="relative min-h-0 flex-1">
				<Pane on={active === "terminal"}>
					<Terminal
						lines={program.lines}
						phase={program.phase}
						prompt={program.prompt}
						summary={program.summary}
						runtimeState={program.runtimeState}
						onAnswer={program.answer}
						labels={labels.terminal}
					/>
				</Pane>
				{tabs.includes("kobe") && (
					<Pane on={active === "kobe"}>
						<KobeCanvas bus={program.kobe} ghost={ghost} labels={labels.kobe} />
					</Pane>
				)}
				{tabs.includes("ubao") && (
					<Pane on={active === "ubao"}>
						<UbaoBoard bus={program.ubao} labels={labels.ubao} />
					</Pane>
				)}
				{tabs.includes("tests") && <Pane on={active === "tests"}>{tests}</Pane>}
			</div>
		</div>
	);
}

/**
 * Panes are stacked; the active one sits on top. Inactive panes are inert, not
 * display:none, so a canvas keeps its size and a drawing keeps animating.
 */
export function Pane({ on, children }: { on: boolean; children: ReactNode }) {
	return (
		<div role="tabpanel" className={cn("absolute inset-0", on ? "z-10" : "pointer-events-none z-0")} aria-hidden={!on} inert={!on}>
			{children}
		</div>
	);
}
