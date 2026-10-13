"use client";

import { useEffect, useMemo, useRef } from "react";
import { cn } from "@nuru/ui/lib/utils";

// Static kobe renderers for the editor. The kobe world is 600 x 600 units,
// origin at the centre, y up. Signatures are lists of "cx,cy" 8-unit cells.
const WORLD = 600;
const CELL = 8;

/** Draws a finished run's kobe events, optionally over a reference signature's cells. */
export function KobeStill({ events, ghost, className }: { events: Array<Record<string, any>>; ghost?: string; className?: string }) {
	const ref = useRef<HTMLCanvasElement>(null);

	useEffect(() => {
		const canvas = ref.current;
		if (!canvas) return;
		const px = 600;
		canvas.width = canvas.height = px;
		const ctx = canvas.getContext("2d")!;
		let bg = "#fffdf6";
		for (const e of events) if (e.ch === "kobe" && e.t === "bg") bg = e.c;
		ctx.setTransform(1, 0, 0, 1, 0, 0);
		ctx.fillStyle = bg;
		ctx.fillRect(0, 0, px, px);
		ctx.setTransform(px / WORLD, 0, 0, -px / WORLD, px / 2, px / 2);
		for (let v = -300; v <= 300; v += 50) {
			ctx.strokeStyle = v === 0 ? "rgba(21,18,15,0.25)" : "rgba(21,18,15,0.08)";
			ctx.lineWidth = 1;
			ctx.beginPath();
			ctx.moveTo(v, -300);
			ctx.lineTo(v, 300);
			ctx.moveTo(-300, v);
			ctx.lineTo(300, v);
			ctx.stroke();
		}
		if (ghost) {
			try {
				ctx.fillStyle = "rgba(59,123,255,0.28)";
				for (const c of JSON.parse(ghost) as string[]) {
					const [x, y] = c.split(",").map(Number);
					ctx.fillRect(x * CELL, y * CELL, CELL, CELL);
				}
			} catch {}
		}
		ctx.lineCap = "round";
		ctx.lineJoin = "round";
		for (const e of events) {
			if (e.ch !== "kobe") continue;
			switch (e.t) {
				case "line":
					ctx.strokeStyle = e.c;
					ctx.lineWidth = e.w;
					ctx.beginPath();
					ctx.moveTo(e.x1, e.y1);
					ctx.lineTo(e.x2, e.y2);
					ctx.stroke();
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
				case "fill":
					if (!e.pts || e.pts.length < 6) break;
					ctx.save();
					ctx.globalCompositeOperation = "destination-over";
					ctx.beginPath();
					ctx.moveTo(e.pts[0], e.pts[1]);
					for (let i = 2; i < e.pts.length; i += 2) ctx.lineTo(e.pts[i], e.pts[i + 1]);
					ctx.closePath();
					ctx.fillStyle = e.c;
					ctx.fill();
					ctx.restore();
					break;
				case "text":
					ctx.save();
					ctx.translate(e.x, e.y);
					ctx.scale(1, -1);
					ctx.fillStyle = e.c;
					ctx.font = `600 ${e.size}px Lexend, ui-sans-serif, system-ui, sans-serif`;
					ctx.fillText(e.s, 0, 0);
					ctx.restore();
					break;
				case "clear":
					ctx.save();
					ctx.setTransform(1, 0, 0, 1, 0, 0);
					ctx.fillStyle = bg;
					ctx.fillRect(0, 0, px, px);
					ctx.restore();
					break;
			}
		}
	}, [events, ghost]);

	return <canvas ref={ref} className={cn("aspect-square w-full rounded-md border-2 border-mstari", className)} />;
}

/** A kobe_picha signature drawn as filled cells on graph paper. */
export function SignatureCells({ signature, className }: { signature?: string; className?: string }) {
	const cells = useMemo(() => {
		try {
			const list = JSON.parse(signature || "[]");
			return Array.isArray(list) ? (list as string[]).map((c) => c.split(",").map(Number) as [number, number]) : [];
		} catch {
			return [];
		}
	}, [signature]);
	// Frame the drawing: its bounding box plus a margin, never smaller than 24 cells.
	const box = useMemo(() => {
		if (cells.length === 0) return { x: -12, y: -12, s: 24 };
		const xs = cells.map((c) => c[0]);
		const ys = cells.map((c) => -c[1] - 1);
		const minX = Math.min(...xs), maxX = Math.max(...xs) + 1, minY = Math.min(...ys), maxY = Math.max(...ys) + 1;
		const s = Math.max(24, maxX - minX + 6, maxY - minY + 6);
		return { x: (minX + maxX) / 2 - s / 2, y: (minY + maxY) / 2 - s / 2, s };
	}, [cells]);
	const half = WORLD / CELL / 2;
	return (
		<svg viewBox={`${box.x} ${box.y} ${box.s} ${box.s}`} className={cn("aspect-square w-full rounded-md border-2 border-mstari bg-[#fffdf6]", className)} role="img" aria-label={`${cells.length}`}>
			<defs>
				<pattern id="sig-grid" width="4" height="4" patternUnits="userSpaceOnUse">
					<path d="M4 0H0V4" fill="none" stroke="rgba(21,18,15,0.1)" strokeWidth={0.1} />
				</pattern>
			</defs>
			<rect x={-half} y={-half} width={half * 2} height={half * 2} fill="url(#sig-grid)" />
			<line x1={-half} x2={half} y1={0} y2={0} stroke="rgba(21,18,15,0.3)" strokeWidth={0.15} />
			<line y1={-half} y2={half} x1={0} x2={0} stroke="rgba(21,18,15,0.3)" strokeWidth={0.15} />
			{cells.map(([x, y]) => (
				<rect key={`${x},${y}`} x={x} y={-y - 1} width={1} height={1} fill="#15120f" />
			))}
		</svg>
	);
}

export function signatureSize(signature?: string) {
	try {
		const list = JSON.parse(signature || "[]");
		return Array.isArray(list) ? list.length : 0;
	} catch {
		return 0;
	}
}
