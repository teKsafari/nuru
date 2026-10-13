"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useTheme } from "@wrksz/themes/client";
import { cn } from "@nuru/ui/lib/utils";

/** Editor theme that follows Mchana / Usiku. */
export function useEditorTheme(): "light" | "dark" {
	const { resolvedTheme } = useTheme();
	return resolvedTheme === "dark" ? "dark" : "light";
}

/**
 * Ctrl+Enter / Cmd+Enter runs the program from anywhere on the page. Caught in
 * the capture phase so CodeMirror never inserts a blank line for it.
 */
export function useModEnter(handler: () => void) {
	const ref = useRef(handler);
	ref.current = handler;
	useEffect(() => {
		const onKey = (e: KeyboardEvent) => {
			if (e.key === "Enter" && (e.ctrlKey || e.metaKey) && !e.altKey) {
				e.preventDefault();
				e.stopPropagation();
				ref.current();
			}
		};
		window.addEventListener("keydown", onKey, true);
		return () => window.removeEventListener("keydown", onKey, true);
	}, []);
}

/** Saves text as a file through a temporary link. */
export function downloadText(name: string, text: string) {
	const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
	const url = URL.createObjectURL(blob);
	const a = document.createElement("a");
	a.href = url;
	a.download = name;
	document.body.appendChild(a);
	a.click();
	a.remove();
	setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export function useFlash() {
	const [msg, setMsg] = useState<{ text: string; tone: "ok" | "err" } | null>(null);
	const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
	const flash = useCallback((text: string, tone: "ok" | "err" = "ok") => {
		setMsg({ text, tone });
		if (timer.current) clearTimeout(timer.current);
		timer.current = setTimeout(() => setMsg(null), 2600);
	}, []);
	useEffect(() => () => void (timer.current && clearTimeout(timer.current)), []);
	return { msg, flash };
}

/** A short-lived sticker at the bottom of the screen. */
export function Flash({ msg, className }: { msg: { text: string; tone: "ok" | "err" } | null; className?: string }) {
	if (!msg) return null;
	return (
		<div
			role="status"
			className={cn(
				"pointer-events-none fixed inset-x-0 z-50 flex justify-center px-4 bottom-[calc(5.5rem+env(safe-area-inset-bottom))] md:bottom-6",
				className,
			)}
		>
			<div
				className={cn(
					"animate-in fade-in slide-in-from-bottom-2 rounded-lg border-2 border-mstari px-4 py-2.5 text-sm font-semibold shadow-kivuli",
					msg.tone === "ok" ? "bg-card text-foreground" : "bg-pilipili text-wino",
				)}
			>
				{msg.text}
			</div>
		</div>
	);
}

export function fill(template: string, values: Record<string, string | number>) {
	return template.replace(/\{(\w+)\}/g, (_, k) => String(values[k] ?? ""));
}

/** Shown for the instant before the page knows whether it is on a phone. */
export function LayoutPending() {
	return (
		<div className="h-full min-h-0 bg-karatasi p-3 md:p-4" aria-busy="true">
			<div className="kadi gridi h-full" />
		</div>
	);
}
