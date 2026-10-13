"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";
import { cn } from "@nuru/ui/lib/utils";
import type { UbaoBus, UbaoEvent } from "./program-bus";

const LEDS = 8;
const DEFAULT_LED = "#ff3b30";
const LCD_COLS = 16;

export interface UbaoLabels {
	board: string;
	leds: string;
	buzzer: string;
	screen: string;
	mute: string;
	unmute: string;
}

type Board = {
	on: boolean[];
	color: string[];
	lcd: string;
	beep: { f: number; until: number } | null;
};

const freshBoard = (): Board => ({
	on: Array(LEDS + 1).fill(false),
	color: Array(LEDS + 1).fill(DEFAULT_LED),
	lcd: "",
	beep: null,
});

// ---- buzzer sound ----

let audio: AudioContext | null = null;
let muted = false;

/** Call from a click handler (Endesha) so browsers allow the buzzer to sound. */
export function primeAudio() {
	try {
		if (!audio) {
			const Ctx = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
			if (!Ctx) return;
			audio = new Ctx();
		}
		if (audio.state === "suspended") void audio.resume();
	} catch {}
}

function playTone(f: number, ms: number) {
	if (muted || !audio || audio.state !== "running") return;
	const dur = Math.min(Math.max(ms, 10), 5000) / 1000;
	const t0 = audio.currentTime;
	const osc = audio.createOscillator();
	const gain = audio.createGain();
	osc.type = "square";
	osc.frequency.value = Math.min(Math.max(f, 20), 12000);
	gain.gain.setValueAtTime(0, t0);
	gain.gain.linearRampToValueAtTime(0.05, t0 + 0.005);
	gain.gain.setValueAtTime(0.05, t0 + Math.max(0.006, dur - 0.01));
	gain.gain.linearRampToValueAtTime(0, t0 + dur);
	osc.connect(gain).connect(audio.destination);
	osc.start(t0);
	osc.stop(t0 + dur + 0.02);
}

/** Lays text out on a 16x2 character screen. */
function lcdRows(text: string): [string, string] {
	const parts = text.split("\n");
	let rows: string[];
	if (parts.length > 1) rows = [parts[0], parts[1]];
	else rows = [text.slice(0, LCD_COLS), text.slice(LCD_COLS, LCD_COLS * 2)];
	return [rows[0].slice(0, LCD_COLS).padEnd(LCD_COLS, " "), (rows[1] ?? "").slice(0, LCD_COLS).padEnd(LCD_COLS, " ")];
}

export function UbaoBoard({ bus, labels, className }: { bus: UbaoBus; labels: UbaoLabels; className?: string }) {
	const board = useRef<Board>(freshBoard());
	const [, setVersion] = useState(0);
	const raf = useRef(0);
	const [isMuted, setMuted] = useState(false);

	const bump = useCallback(() => {
		if (raf.current) return;
		raf.current = requestAnimationFrame(() => {
			raf.current = 0;
			setVersion((v) => v + 1);
		});
	}, []);

	const apply = useCallback((e: UbaoEvent, live: boolean) => {
		const b = board.current;
		switch (e.t) {
			case "led":
				if (e.i >= 1 && e.i <= LEDS) b.on[e.i] = e.on;
				break;
			case "color":
				if (e.i >= 1 && e.i <= LEDS) b.color[e.i] = e.c;
				break;
			case "lcd":
				b.lcd = e.s;
				break;
			case "beep":
				if (live) {
					b.beep = { f: e.f, until: performance.now() + Math.min(e.ms, 5000) };
					playTone(e.f, e.ms);
				}
				break;
		}
	}, []);

	useEffect(() => {
		board.current = freshBoard();
		for (const e of bus.history) apply(e, false);
		bump();
		return bus.subscribe({
			reset: () => {
				board.current = freshBoard();
				bump();
			},
			events: (events) => {
				for (const e of events) apply(e, true);
				bump();
			},
		});
	}, [bus, apply, bump]);

	// Let the buzzer animation end on time.
	const b = board.current;
	const beeping = b.beep && b.beep.until > performance.now() ? b.beep : null;
	useEffect(() => {
		if (!beeping) return;
		const id = setTimeout(bump, Math.max(16, beeping.until - performance.now()));
		return () => clearTimeout(id);
	}, [beeping, bump]);

	useEffect(() => () => cancelAnimationFrame(raf.current), []);

	const [row1, row2] = lcdRows(b.lcd);

	return (
		<div className={cn("flex h-full min-h-0 items-start justify-center overflow-auto bg-karatasi-2 p-3 sm:items-center sm:p-6", className)}>
			<div
				data-testid="ubao-board"
				className="relative w-full max-w-[560px] rounded-[14px] border-2 border-mstari bg-[#17603f] p-4 text-[#e9f5e1] shadow-kivuli sm:p-6"
			>
				<Traces />
				{[
					"top-2.5 left-2.5",
					"top-2.5 right-2.5",
					"bottom-2.5 left-2.5",
					"bottom-2.5 right-2.5",
				].map((pos) => (
					<span
						key={pos}
						className={cn("absolute size-3.5 rounded-full border-[3px] border-[#d8c27a] bg-karatasi-2", pos)}
						aria-hidden
					/>
				))}

				<div className="relative flex items-center justify-between gap-2 px-3">
					<span className="lebo text-[#e9f5e1]">{labels.board}</span>
					<button
						type="button"
						onClick={() => {
							muted = !isMuted;
							setMuted(!isMuted);
							primeAudio();
						}}
						className="inline-flex size-9 items-center justify-center rounded-md text-[#e9f5e1] hover:bg-white/10"
						aria-label={isMuted ? labels.unmute : labels.mute}
						title={isMuted ? labels.unmute : labels.mute}
					>
						{isMuted ? <VolumeX className="size-4" /> : <Volume2 className="size-4" />}
					</button>
				</div>

				{/* 16x2 screen */}
				<div className="relative mt-3 rounded-lg border-2 border-mstari bg-[#1b1b1b] p-2.5 sm:p-3">
					<div className="lebo mb-1.5 text-[0.6rem] text-white/50">{labels.screen} · 16×2</div>
					<div
						data-testid="ubao-lcd"
						className="grid gap-[3px] rounded-[4px] bg-[#9fc04a] p-2 font-mono text-[#16210c] shadow-[inset_0_0_0_2px_#7f9e33]"
						style={{ gridTemplateColumns: `repeat(${LCD_COLS}, minmax(0, 1fr))` }}
						aria-label={b.lcd}
					>
						{(row1 + row2).split("").map((ch, i) => (
							<span
								key={i}
								className="flex aspect-[5/8] items-center justify-center rounded-[1px] bg-[#93b43f] text-[clamp(0.7rem,3.2vw,1.15rem)] leading-none font-bold"
							>
								{ch === " " ? "" : ch}
							</span>
						))}
					</div>
				</div>

				{/* LEDs */}
				<div className="relative mt-5">
					<div className="lebo mb-2 px-1 text-[0.6rem] text-white/60">{labels.leds}</div>
					<div className="grid grid-cols-8 gap-1.5 sm:gap-3">
						{Array.from({ length: LEDS }, (_, k) => {
							const i = k + 1;
							const on = b.on[i];
							const c = b.color[i];
							return (
								<div key={i} className="flex flex-col items-center gap-1.5" data-led={i} data-on={on ? "1" : "0"}>
									<div
										className="relative aspect-square w-full max-w-11 rounded-full border-2 border-mstari transition-[background-color,box-shadow] duration-75"
										style={{
											background: on
												? `radial-gradient(circle at 35% 30%, #ffffff 0%, ${c} 38%, ${c} 100%)`
												: `radial-gradient(circle at 35% 30%, color-mix(in oklab, ${c} 35%, #ffffff) 0%, color-mix(in oklab, ${c} 30%, #2a2a2a) 55%)`,
											boxShadow: on ? `0 0 14px 4px color-mix(in oklab, ${c} 70%, transparent), 0 0 34px 10px color-mix(in oklab, ${c} 35%, transparent)` : "none",
										}}
									/>
									<div className="flex h-3 gap-1.5" aria-hidden>
										<span className="h-full w-[2px] bg-[#d8c27a]" />
										<span className="h-full w-[2px] bg-[#d8c27a]" />
									</div>
									<span className="font-mono text-xs font-bold text-[#e9f5e1]">{i}</span>
								</div>
							);
						})}
					</div>
				</div>

				{/* Buzzer */}
				<div className="relative mt-5 flex items-center gap-4 rounded-lg border-2 border-dashed border-white/25 px-3 py-2.5">
					<div className="relative flex size-14 shrink-0 items-center justify-center rounded-full border-2 border-mstari bg-[#111]">
						<span className="size-3 rounded-full bg-[#333]" />
						<span className="absolute inset-2 rounded-full border border-white/15" />
						{beeping && (
							<>
								<span className="absolute -inset-1 animate-ping rounded-full border-2 border-jua" />
								<span className="absolute -inset-3 animate-ping rounded-full border-2 border-jua/60 [animation-delay:120ms]" />
							</>
						)}
					</div>
					<div className="min-w-0">
						<div className="lebo text-[#e9f5e1]">{labels.buzzer}</div>
						<div className="font-mono text-sm text-jua" data-testid="ubao-buzzer">
							{beeping ? `${Math.round(beeping.f)} Hz` : "··· "}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

function Traces() {
	return (
		<svg className="pointer-events-none absolute inset-0 h-full w-full opacity-35" aria-hidden preserveAspectRatio="none" viewBox="0 0 100 100">
			<g fill="none" stroke="#7fd39c" strokeWidth="0.35">
				<path d="M4 30 H20 L26 36 V60 L32 66 H70" />
				<path d="M96 40 H82 L76 46 V70 L70 76 H40" />
				<path d="M10 92 H44 L50 86 H90" />
				<path d="M60 8 V20 L66 26 H92" />
				<path d="M8 12 H30 L36 18 V26" />
			</g>
			<g fill="#d8c27a">
				<circle cx="20" cy="30" r="0.9" />
				<circle cx="70" cy="66" r="0.9" />
				<circle cx="40" cy="76" r="0.9" />
				<circle cx="90" cy="86" r="0.9" />
				<circle cx="92" cy="26" r="0.9" />
				<circle cx="36" cy="26" r="0.9" />
			</g>
		</svg>
	);
}
