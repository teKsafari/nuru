"use client";

import { useEffect, useRef, useState } from "react";
import { Play } from "lucide-react";
import { cn } from "@nuru/ui/lib/utils";
import { tokenize, tokenClassOnInk } from "./nuru-highlight";
import type { HeroProgram } from "./hero-programs";

type Phase = "typing" | "running" | "done";

// The hero's live code card. It types a short Nuru program, "presses" Endesha
// and prints the output. Pure animation: the outputs are checked against the
// real interpreter by kamusi/hakiki-mifano.mts, but nothing runs here.
// The server renders the first program complete, so there is no flash and
// nothing is lost without JavaScript or with reduced motion.
export function CodeCard({ programs, labels }: { programs: HeroProgram[]; labels: { run: string; output: string; label: string } }) {
	const [index, setIndex] = useState(0);
	const [typed, setTyped] = useState(programs[0].code.length);
	const [phase, setPhase] = useState<Phase>("done");
	const [shownLines, setShownLines] = useState(programs[0].matokeo.split("\n").length);
	const root = useRef<HTMLDivElement>(null);
	const visible = useRef(true);
	const reduced = useRef(false);

	const program = programs[index];
	const lines = program.matokeo.split("\n");

	useEffect(() => {
		reduced.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
		const io = new IntersectionObserver(([e]) => (visible.current = e.isIntersecting), { threshold: 0.2 });
		if (root.current) io.observe(root.current);
		return () => io.disconnect();
	}, []);

	// One timer drives the whole loop; it idles while the card is off screen or the tab is hidden.
	useEffect(() => {
		const paused = () => !visible.current || document.hidden;
		let delay: number;
		let step: () => void;
		if (phase === "typing") {
			if (typed < program.code.length) {
				const next = program.code[typed];
				delay = next === "\n" ? 140 : 26 + Math.random() * 34;
				step = () => setTyped((t) => t + 1);
			} else {
				delay = 450;
				step = () => {
					setPhase("running");
					setShownLines(0);
				};
			}
		} else if (phase === "running") {
			if (shownLines < lines.length) {
				delay = shownLines === 0 ? 380 : 220;
				step = () => setShownLines((n) => n + 1);
			} else {
				delay = 0;
				step = () => setPhase("done");
			}
		} else {
			if (reduced.current) return;
			delay = 3600;
			step = () => goTo((index + 1) % programs.length);
		}
		let timer = 0;
		const tick = () => {
			if (paused()) {
				timer = window.setTimeout(tick, 500);
				return;
			}
			step();
		};
		timer = window.setTimeout(tick, delay);
		return () => window.clearTimeout(timer);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [phase, typed, shownLines, index]);

	function goTo(i: number) {
		setIndex(i);
		if (reduced.current) {
			setTyped(programs[i].code.length);
			setShownLines(programs[i].matokeo.split("\n").length);
			setPhase("done");
		} else {
			setTyped(0);
			setShownLines(0);
			setPhase("typing");
		}
	}

	const tokens = tokenize(program.code.slice(0, typed));

	return (
		<div
			ref={root}
			className="relative overflow-hidden rounded-[14px] border-2 border-mstari bg-[#15120f] text-[#fff3d6] shadow-kivuli-lg"
			role="group"
			aria-roledescription="carousel"
			aria-label={labels.label}
		>
			<div className="flex items-center gap-1 border-b-2 border-[#fff3d6]/15 px-2 pt-2" role="tablist">
				{programs.map((p, i) => (
					<button
						key={p.faili}
						type="button"
						role="tab"
						aria-selected={i === index}
						onClick={() => goTo(i)}
						className={cn(
							"lebo -mb-[2px] rounded-t-md border-2 border-b-0 px-2.5 py-1.5 transition-colors",
							i === index ? "border-[#fff3d6]/25 bg-[#211c17] text-[#ffc93c]" : "border-transparent text-[#fff3d6]/50 hover:text-[#fff3d6]",
						)}
					>
						{p.faili}
					</button>
				))}
				<span
					className={cn(
						"ml-auto mb-1.5 flex items-center gap-1.5 rounded-md border-2 border-[#15120f] bg-[#3ccf86] px-2.5 py-1 text-xs font-bold text-[#15120f] shadow-[2px_2px_0_0_#000] transition-transform duration-100",
						phase === "running" && shownLines === 0 && "translate-x-0.5 translate-y-0.5 shadow-none",
					)}
					aria-hidden
				>
					<Play className="size-3 fill-current" />
					{labels.run}
				</span>
			</div>

			<pre className="min-h-[13.5rem] overflow-x-auto bg-[#211c17] px-4 py-4 font-mono [font-variant-ligatures:none] text-[13px] leading-6 sm:text-sm" aria-label={program.faili}>
				<code>
					{tokens.map((t, i) =>
						tokenClassOnInk[t.k] ? (
							<span key={i} className={tokenClassOnInk[t.k]}>
								{t.v}
							</span>
						) : (
							t.v
						),
					)}
					{phase === "typing" && <span className="ml-px inline-block h-[1.1em] w-[0.55em] translate-y-[0.2em] animate-pulse bg-[#ffc93c]" aria-hidden />}
				</code>
			</pre>

			<div className="min-h-[7.25rem] border-t-2 border-dashed border-[#fff3d6]/20 px-4 pt-2.5 pb-4" aria-live="polite">
				<p className="lebo mb-1.5 text-[#fff3d6]/45">{labels.output}</p>
				<div className="font-mono text-[13px] leading-6 sm:text-sm">
					{lines.slice(0, shownLines).map((line, i) => (
						<div key={`${index}-${i}`} className="flex gap-2 animate-in fade-in slide-in-from-left-1 duration-150">
							<span className="text-[#ffc93c]" aria-hidden>
								›
							</span>
							<span>{line}</span>
						</div>
					))}
				</div>
			</div>
		</div>
	);
}
