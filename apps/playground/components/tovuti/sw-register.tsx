"use client";

import { useEffect } from "react";

// Registers public/sw.js, which keeps the Nuru runtime and visited pages
// available offline. Production only: in development Next serves unhashed
// chunks that a cache-first worker would pin to stale versions.
//
// The script URL carries the build id and the runtime hash (stamped by
// scripts/copy-runtime.mjs, inlined by next.config.mjs), so every deploy
// installs the worker afresh and its caches are versioned with the build.
export function ServiceWorkerRegister() {
	useEffect(() => {
		if (process.env.NODE_ENV !== "production" || !("serviceWorker" in navigator)) return;
		const q = new URLSearchParams({ b: process.env.NURU_BUILD_ID || "0", r: process.env.NURU_RUNTIME_VERSION || "" });
		const register = async () => {
			try {
				await navigator.serviceWorker.register(`/sw.js?${q}`, { scope: "/" });
				const reg = await navigator.serviceWorker.ready;
				// The chunks this page loaded before the worker was in control are not
				// in its cache yet; hand it the list so the page also works offline.
				const urls = performance
					.getEntriesByType("resource")
					.map((e) => e.name)
					.filter((u) => u.startsWith(`${location.origin}/_next/static/`));
				reg.active?.postMessage({ type: "nuru:hifadhi", urls });
			} catch {}
		};
		if (document.readyState === "complete") void register();
		else window.addEventListener("load", () => void register(), { once: true });
	}, []);
	return null;
}
