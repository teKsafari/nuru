"use client";

import { useEffect, useRef, useState } from "react";
import { NuruRuntime } from "@nuru/wasm/runtime";

import { RUNTIME_URLS } from "@/lib/runtime-version";

export type RuntimeState = "loading" | "ready" | "error";

// Versioned by content hash, see lib/runtime-version.ts.
const CONFIG = RUNTIME_URLS;

/**
 * Owns one NuruRuntime (one Web Worker) for the lifetime of the page.
 * The worker is warmed up on mount so the first Endesha is instant.
 */
export function useNuruRuntime() {
	const ref = useRef<NuruRuntime | null>(null);
	const [state, setState] = useState<RuntimeState>("loading");

	if (ref.current === null && typeof window !== "undefined") {
		ref.current = new NuruRuntime(CONFIG);
	}

	useEffect(() => {
		const runtime = ref.current ?? new NuruRuntime(CONFIG);
		ref.current = runtime;
		let alive = true;
		runtime
			.warmUp()
			.then(() => alive && setState("ready"))
			.catch(() => alive && setState("error"));
		return () => {
			alive = false;
			runtime.dispose();
			// The next mount (React strict mode, fast refresh) gets a fresh worker.
			ref.current = null;
		};
	}, []);

	return { runtime: ref, state };
}
