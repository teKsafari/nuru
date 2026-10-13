"use client";

import { useEffect } from "react";

// Registers public/sw.js, which keeps the Nuru runtime and visited pages
// available offline. Production only: in development Next serves unhashed
// chunks that a cache-first worker would pin to stale versions.
export function ServiceWorkerRegister() {
	useEffect(() => {
		if (process.env.NODE_ENV !== "production" || !("serviceWorker" in navigator)) return;
		const register = () => navigator.serviceWorker.register("/sw.js", { scope: "/" }).catch(() => {});
		if (document.readyState === "complete") register();
		else window.addEventListener("load", register, { once: true });
	}, []);
	return null;
}
