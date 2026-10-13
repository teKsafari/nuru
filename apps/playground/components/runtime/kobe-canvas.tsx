"use client";

import { useCallback, useEffect, useRef } from "react";
import { Download } from "lucide-react";
import { cn } from "@nuru/ui/lib/utils";
import type { KobeBus, KobeEvent } from "./program-bus";

// The kobe world: 600 x 600 units, origin at the centre, y grows upward,
// heading 0 faces east. The drawing layer is kept at 2 pixels per unit.
const WORLD = 600;
const RES = 2;
const PAPER = "#fffdf6";
const INK = "#15120f";
const GHOST = "#3b7bff";
const CELL = 8;

// Distance (units) and turn (degrees) per animation frame for kobe.kasi 1..10.
const STEP_PX = [Infinity, 1.2, 2.5, 4, 6, 9, 13, 20, 32, 60, 140];
const STEP_DEG = [Infinity, 3, 5, 7, 10, 14, 20, 30, 45, 80, 180];
export const DEFAULT_KASI = 6;

export interface KobeLabels {
	download: string;
	ghost: string;
}

interface KobeCanvasProps {
	bus: KobeBus;
	/** expectedOutput of a kobe_picha test: JSON list of "cx,cy" 8-unit cells. */
	ghost?: string;
	labels: KobeLabels;
	className?: string;
	fileName?: string;
}

type Turtle = { x: number; y: number; h: number; visible: boolean };
type Anim = { e: KobeEvent; done: number; total: number; from?: number };

export function KobeCanvas({ bus, ghost, labels, className, fileName = "kobe.png" }: KobeCanvasProps) {
	const boxRef = useRef<HTMLDivElement>(null);
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const readoutRef = useRef<HTMLSpanElement>(null);

	const s = useRef({
		layer: null as HTMLCanvasElement | null,
		ghostLayer: null as HTMLCanvasElement | null,
		bg: null as string | null,
		turtle: { x: 0, y: 0, h: 0, visible: true } as Turtle,
		queue: [] as KobeEvent[],
		head: 0,
		anim: null as Anim | null,
		speed: DEFAULT_KASI,
		raf: 0,
		size: 0,
		dpr: 1,
	});

	const layerCtx = () => {
		const st = s.current;
		if (!st.layer) {
			st.layer = document.createElement("canvas");
			st.layer.width = st.layer.height = WORLD * RES;
		}
		const ctx = st.layer.getContext("2d")!;
		ctx.setTransform(RES, 0, 0, -RES, (WORLD * RES) / 2, (WORLD * RES) / 2);
		ctx.lineCap = "round";
		ctx.lineJoin = "round";
		return ctx;
	};

	// ---- applying events to the drawing layer ----

	const commit = useCallback((e: KobeEvent) => {
		const st = s.current;
		const t = st.turtle;
		const ctx = layerCtx();
		switch (e.t) {
			case "line":
				ctx.strokeStyle = e.c;
				ctx.lineWidth = e.w;
				ctx.beginPath();
				ctx.moveTo(e.x1, e.y1);
				ctx.lineTo(e.x2, e.y2);
				ctx.stroke();
				t.x = e.x2;
				t.y = e.y2;
				break;
			case "move":
				t.x = e.x;
				t.y = e.y;
				break;
			case "turn":
				t.h = e.h;
				break;
			case "circle":
				ctx.beginPath();
				ctx.arc(e.x, e.y, e.r, 0, Math.PI * 2);
				if (e.f) {
					ctx.fillStyle = e.f;
					ctx.fill();
				}
				ctx.strokeStyle = e.c;
				ctx.lineWidth = e.w;
				ctx.stroke();
				break;
			case "dot":
				ctx.beginPath();
				ctx.arc(e.x, e.y, Math.max(0.5, e.r), 0, Math.PI * 2);
				ctx.fillStyle = e.c;
				ctx.fill();
				break;
			case "text":
				ctx.save();
				ctx.translate(e.x, e.y);
				ctx.scale(1, -1);
				ctx.fillStyle = e.c;
				ctx.font = `600 ${e.size}px Lexend, ui-sans-serif, system-ui, sans-serif`;
				ctx.textBaseline = "alphabetic";
				ctx.fillText(e.s, 0, 0);
				ctx.restore();
				break;
			case "fill": {
				if (e.pts.length < 6) break;
				ctx.save();
				// Fills slide under the outline that was drawn while filling.
				ctx.globalCompositeOperation = "destination-over";
				ctx.beginPath();
				ctx.moveTo(e.pts[0], e.pts[1]);
				for (let i = 2; i < e.pts.length; i += 2) ctx.lineTo(e.pts[i], e.pts[i + 1]);
				ctx.closePath();
				ctx.fillStyle = e.c;
				ctx.fill();
				ctx.restore();
				break;
			}
			case "bg":
				st.bg = e.c;
				break;
			case "speed":
				st.speed = Math.round(e.v);
				break;
			case "clear":
				ctx.save();
				ctx.setTransform(1, 0, 0, 1, 0, 0);
				ctx.clearRect(0, 0, WORLD * RES, WORLD * RES);
				ctx.restore();
				break;
			case "hide":
				t.visible = false;
				break;
			case "show":
				t.visible = true;
				break;
		}
	}, []);

	// ---- painting the visible canvas ----

	const paint = useCallback(() => {
		const st = s.current;
		const canvas = canvasRef.current;
		if (!canvas || st.size === 0) return;
		const ctx = canvas.getContext("2d")!;
		const px = st.size * st.dpr;
		const k = px / WORLD;

		ctx.setTransform(1, 0, 0, 1, 0, 0);
		ctx.fillStyle = st.bg ?? PAPER;
		ctx.fillRect(0, 0, px, px);

		// Graph paper
		ctx.setTransform(k, 0, 0, -k, px / 2, px / 2);
		const lw = 1 / k;
		for (let v = -300; v <= 300; v += 25) {
			const major = v % 100 === 0;
			ctx.strokeStyle = v === 0 ? "rgba(21,18,15,0.28)" : major ? "rgba(21,18,15,0.13)" : "rgba(21,18,15,0.06)";
			ctx.lineWidth = v === 0 ? 1.5 * lw : lw;
			ctx.beginPath();
			ctx.moveTo(v, -300);
			ctx.lineTo(v, 300);
			ctx.moveTo(-300, v);
			ctx.lineTo(300, v);
			ctx.stroke();
		}

		ctx.setTransform(1, 0, 0, 1, 0, 0);
		if (st.ghostLayer) ctx.drawImage(st.ghostLayer, 0, 0, px, px);
		if (st.layer) ctx.drawImage(st.layer, 0, 0, px, px);

		ctx.setTransform(k, 0, 0, -k, px / 2, px / 2);
		ctx.lineCap = "round";
		const a = st.anim;
		const t = st.turtle;
		let tx = t.x;
		let ty = t.y;
		let th = t.h;
		if (a) {
			const f = a.total === 0 ? 1 : a.done / a.total;
			if (a.e.t === "line") {
				tx = a.e.x1 + (a.e.x2 - a.e.x1) * f;
				ty = a.e.y1 + (a.e.y2 - a.e.y1) * f;
				ctx.strokeStyle = a.e.c;
				ctx.lineWidth = a.e.w;
				ctx.beginPath();
				ctx.moveTo(a.e.x1, a.e.y1);
				ctx.lineTo(tx, ty);
				ctx.stroke();
			} else if (a.e.t === "move") {
				tx = t.x + (a.e.x - t.x) * f;
				ty = t.y + (a.e.y - t.y) * f;
			} else if (a.e.t === "turn") {
				th = (a.from ?? t.h) + shortest(a.from ?? t.h, a.e.h) * f;
			}
		}
		if (t.visible) drawTortoise(ctx, tx, ty, th);

		const ro = readoutRef.current;
		if (ro) ro.textContent = `x ${Math.round(tx)}  y ${Math.round(ty)}  ${Math.round(((th % 360) + 360) % 360)}°`;
	}, []);

	// ---- animation ----

	const tick = useCallback(() => {
		const st = s.current;
		st.raf = 0;
		const backlog = st.queue.length - st.head;
		const boost = 1 + backlog / 400;
		let px = STEP_PX[st.speed] ?? Infinity;
		let deg = STEP_DEG[st.speed] ?? Infinity;
		px *= boost;
		deg *= boost;
		let guard = 0;

		while (guard++ < 20000) {
			if (!st.anim) {
				if (st.head >= st.queue.length) break;
				const e = st.queue[st.head++];
				if (st.speed === 0 || !(e.t === "line" || e.t === "move" || e.t === "turn")) {
					commit(e);
					continue;
				}
				const t = st.turtle;
				const total =
					e.t === "line"
						? Math.hypot(e.x2 - e.x1, e.y2 - e.y1)
						: e.t === "move"
							? Math.hypot(e.x - t.x, e.y - t.y)
							: Math.abs(shortest(t.h, e.h));
				st.anim = { e, done: 0, total, from: t.h };
			}
			const a = st.anim!;
			const budget = a.e.t === "turn" ? deg : px;
			if (budget <= 0) break;
			const left = a.total - a.done;
			if (budget >= left) {
				if (a.e.t === "turn") deg -= left;
				else px -= left;
				commit(a.e);
				st.anim = null;
			} else {
				a.done += budget;
				if (a.e.t === "turn") deg = 0;
				else px = 0;
				break;
			}
		}
		paint();
		if (st.anim || st.head < st.queue.length) st.raf = requestAnimationFrame(tick);
	}, [commit, paint]);

	const schedule = useCallback(() => {
		const st = s.current;
		if (!st.raf) st.raf = requestAnimationFrame(tick);
	}, [tick]);

	const reset = useCallback(() => {
		const st = s.current;
		if (st.raf) cancelAnimationFrame(st.raf);
		st.raf = 0;
		st.queue = [];
		st.head = 0;
		st.anim = null;
		st.bg = null;
		st.speed = DEFAULT_KASI;
		st.turtle = { x: 0, y: 0, h: 0, visible: true };
		const ctx = layerCtx();
		ctx.save();
		ctx.setTransform(1, 0, 0, 1, 0, 0);
		ctx.clearRect(0, 0, WORLD * RES, WORLD * RES);
		ctx.restore();
		paint();
	}, [paint]);

	// Bus subscription. Events already in history (from before this canvas
	// mounted) are drawn instantly.
	useEffect(() => {
		reset();
		const st = s.current;
		for (const e of bus.history) commit(e);
		paint();
		return bus.subscribe({
			reset,
			events: (events) => {
				// Free memory once the queue has been fully drawn.
				if (st.head > 5000 && st.head === st.queue.length && !st.anim) {
					st.queue = [];
					st.head = 0;
				}
				for (const e of events) st.queue.push(e);
				schedule();
			},
		});
	}, [bus, reset, commit, paint, schedule]);

	// Ghost target picture
	useEffect(() => {
		const st = s.current;
		st.ghostLayer = null;
		if (ghost) {
			let cells: string[] = [];
			try {
				cells = JSON.parse(ghost);
			} catch {}
			if (cells.length) {
				const g = document.createElement("canvas");
				g.width = g.height = WORLD * RES;
				const ctx = g.getContext("2d")!;
				ctx.setTransform(RES, 0, 0, -RES, (WORLD * RES) / 2, (WORLD * RES) / 2);
				ctx.fillStyle = GHOST;
				ctx.globalAlpha = 0.6;
				for (const c of cells) {
					const [cx, cy] = c.split(",").map(Number);
					if (!Number.isFinite(cx) || !Number.isFinite(cy)) continue;
					ctx.beginPath();
					ctx.arc(cx * CELL + CELL / 2, cy * CELL + CELL / 2, 2.3, 0, Math.PI * 2);
					ctx.fill();
				}
				st.ghostLayer = g;
			}
		}
		paint();
	}, [ghost, paint]);

	// Fit a square canvas into the box, devicePixelRatio aware.
	useEffect(() => {
		const box = boxRef.current;
		const canvas = canvasRef.current;
		if (!box || !canvas) return;
		const fit = () => {
			const r = box.getBoundingClientRect();
			const size = Math.max(0, Math.floor(Math.min(r.width, r.height)));
			const dpr = Math.min(3, window.devicePixelRatio || 1);
			const st = s.current;
			if (size === st.size && dpr === st.dpr) return;
			st.size = size;
			st.dpr = dpr;
			canvas.style.width = canvas.style.height = `${size}px`;
			canvas.width = canvas.height = Math.max(1, Math.round(size * dpr));
			paint();
		};
		const ro = new ResizeObserver(fit);
		ro.observe(box);
		fit();
		return () => ro.disconnect();
	}, [paint]);

	useEffect(
		() => () => {
			const st = s.current;
			if (st.raf) cancelAnimationFrame(st.raf);
		},
		[],
	);

	const download = () => {
		const st = s.current;
		const out = document.createElement("canvas");
		out.width = out.height = WORLD * RES;
		const ctx = out.getContext("2d")!;
		ctx.fillStyle = st.bg ?? PAPER;
		ctx.fillRect(0, 0, out.width, out.height);
		if (st.layer) ctx.drawImage(st.layer, 0, 0);
		out.toBlob((blob) => {
			if (!blob) return;
			const url = URL.createObjectURL(blob);
			const a = document.createElement("a");
			a.href = url;
			a.download = fileName;
			document.body.appendChild(a);
			a.click();
			a.remove();
			setTimeout(() => URL.revokeObjectURL(url), 1000);
		}, "image/png");
	};

	return (
		<div className={cn("relative flex h-full min-h-0 flex-col bg-karatasi-2", className)}>
			<div ref={boxRef} className="flex min-h-0 flex-1 items-center justify-center p-3">
				<canvas
					ref={canvasRef}
					data-testid="kobe-canvas"
					className="rounded-md border-2 border-mstari shadow-kivuli-sm"
					aria-label="Kobe"
					role="img"
				/>
			</div>
			<div className="flex shrink-0 items-center justify-between gap-2 border-t-2 border-mstari bg-card px-3 py-1.5">
				<div className="flex min-w-0 items-center gap-3">
					<span ref={readoutRef} className="lebo truncate text-muted-foreground tabular-nums" />
					{ghost && (
						<span className="lebo inline-flex items-center gap-1.5 text-bahari">
							<span className="inline-block size-2 rounded-full bg-bahari opacity-60" />
							{labels.ghost}
						</span>
					)}
				</div>
				<button
					type="button"
					onClick={download}
					className="inline-flex h-8 items-center gap-1.5 rounded-md border-2 border-mstari bg-card px-2.5 text-xs font-semibold hover:bg-karatasi-2"
				>
					<Download className="size-3.5" />
					{labels.download}
				</button>
			</div>
		</div>
	);
}

function shortest(from: number, to: number) {
	let d = (((to - from) % 360) + 540) % 360 - 180;
	if (d === -180) d = 180;
	return d;
}

/** A small tortoise seen from above, nose pointing along the heading. */
function drawTortoise(ctx: CanvasRenderingContext2D, x: number, y: number, h: number) {
	ctx.save();
	ctx.translate(x, y);
	ctx.rotate((h * Math.PI) / 180);
	ctx.lineWidth = 1.6;
	ctx.strokeStyle = INK;
	ctx.lineJoin = "round";

	// legs
	ctx.fillStyle = "#7ccf7a";
	for (const [lx, ly] of [
		[6, 8],
		[6, -8],
		[-6, 8],
		[-6, -8],
	]) {
		ctx.beginPath();
		ctx.ellipse(lx, ly, 3.2, 2.4, 0, 0, Math.PI * 2);
		ctx.fill();
		ctx.stroke();
	}
	// tail
	ctx.beginPath();
	ctx.moveTo(-10, 1.6);
	ctx.lineTo(-14.5, 0);
	ctx.lineTo(-10, -1.6);
	ctx.closePath();
	ctx.fill();
	ctx.stroke();
	// head
	ctx.beginPath();
	ctx.ellipse(13, 0, 4.2, 3.4, 0, 0, Math.PI * 2);
	ctx.fill();
	ctx.stroke();
	// shell
	ctx.fillStyle = "#22a565";
	ctx.beginPath();
	ctx.ellipse(0, 0, 10.5, 8.5, 0, 0, Math.PI * 2);
	ctx.fill();
	ctx.stroke();
	// shell plates
	ctx.lineWidth = 1;
	ctx.strokeStyle = "rgba(21,18,15,0.55)";
	ctx.beginPath();
	ctx.moveTo(-4, -3);
	ctx.lineTo(3, -3);
	ctx.lineTo(5, 0);
	ctx.lineTo(3, 3);
	ctx.lineTo(-4, 3);
	ctx.lineTo(-6, 0);
	ctx.closePath();
	ctx.moveTo(-4, -3);
	ctx.lineTo(-6.5, -6.5);
	ctx.moveTo(3, -3);
	ctx.lineTo(5.5, -6.5);
	ctx.moveTo(-4, 3);
	ctx.lineTo(-6.5, 6.5);
	ctx.moveTo(3, 3);
	ctx.lineTo(5.5, 6.5);
	ctx.stroke();
	// eye dot on the nose
	ctx.fillStyle = INK;
	ctx.beginPath();
	ctx.arc(15, 0, 0.9, 0, Math.PI * 2);
	ctx.fill();
	ctx.restore();
}
