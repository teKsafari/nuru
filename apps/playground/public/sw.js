// Nuru service worker: keeps the runtime and the pages a learner has visited
// available without a connection. Hand-written, no build step.
//
//   /nuru/* (wasm, worker, wasm_exec)  cache first, refreshed in the background
//   /_next/static/**, /icons/**, fonts cache first (file names are hashed)
//   pages (navigations)                network first, cached copy when offline,
//                                      then a Swahili offline page
//   /api/**, /callback, other origins  never touched
//
// Responses are stored and served as the original Response objects, so the
// COOP/COEP headers that cross-origin isolation (and jaza()) depend on survive.

const VERSION = "nuru-v1";
const RUNTIME = `${VERSION}-runtime`;
const STATIC = `${VERSION}-static`;
const PAGES = `${VERSION}-pages`;

const PRECACHE = ["/nuru/nuru.wasm", "/nuru/wasm_exec.js", "/nuru/nuru-worker.js", "/manifest.json", "/favicon.svg", "/icons/icon-192.png"];
const PRECACHE_PAGES = ["/sw", "/sw/uwanja"];

self.addEventListener("install", (event) => {
	event.waitUntil(
		(async () => {
			const runtime = await caches.open(RUNTIME);
			await Promise.all(PRECACHE.map((url) => runtime.add(url).catch(() => {})));
			const pages = await caches.open(PAGES);
			await Promise.all(
				PRECACHE_PAGES.map(async (url) => {
					try {
						const res = await fetch(url, { credentials: "same-origin" });
						if (cacheable(res)) await pages.put(url, res);
					} catch {}
				}),
			);
			await self.skipWaiting();
		})(),
	);
});

self.addEventListener("activate", (event) => {
	event.waitUntil(
		(async () => {
			const keys = await caches.keys();
			await Promise.all(keys.filter((k) => k.startsWith("nuru-") && !k.startsWith(VERSION)).map((k) => caches.delete(k)));
			await self.clients.claim();
		})(),
	);
});

function cacheable(res) {
	return res && res.ok && res.type === "basic" && !res.redirected;
}

self.addEventListener("fetch", (event) => {
	const req = event.request;
	if (req.method !== "GET") return;
	const url = new URL(req.url);
	if (url.origin !== self.location.origin) return;
	const path = url.pathname;
	if (path.startsWith("/api/") || path === "/callback" || path.startsWith("/callback/") || path === "/sw.js") return;
	// Next.js data requests for client navigation: let them hit the network; the
	// router falls back to a full navigation (handled below) when they fail.
	if (url.searchParams.has("_rsc") || req.headers.get("RSC")) return;

	if (path.startsWith("/nuru/")) {
		event.respondWith(staleWhileRevalidate(event, req, RUNTIME));
		return;
	}
	if (path.startsWith("/_next/static/") || path.startsWith("/icons/") || /\.(?:woff2?|ttf|otf)$/.test(path)) {
		event.respondWith(cacheFirst(req, STATIC));
		return;
	}
	if (req.mode === "navigate") {
		event.respondWith(networkFirstPage(req));
	}
});

async function cacheFirst(req, cacheName) {
	const cache = await caches.open(cacheName);
	const hit = await cache.match(req);
	if (hit) return hit;
	const res = await fetch(req);
	if (cacheable(res)) cache.put(req, res.clone());
	return res;
}

// Serve the cached runtime at once; fetch a fresh copy for next time.
async function staleWhileRevalidate(event, req, cacheName) {
	const cache = await caches.open(cacheName);
	const hit = await cache.match(req, { ignoreSearch: true });
	const refresh = fetch(req)
		.then((res) => {
			if (cacheable(res)) cache.put(req, res.clone());
			return res;
		})
		.catch(() => null);
	if (hit) {
		event.waitUntil(refresh);
		return hit;
	}
	return (await refresh) || Response.error();
}

async function networkFirstPage(req) {
	const cache = await caches.open(PAGES);
	try {
		const res = await fetch(req);
		if (cacheable(res)) cache.put(req, res.clone());
		return res;
	} catch {
		const url = new URL(req.url);
		const hit = (await cache.match(req, { ignoreSearch: true })) || (await cache.match(url.pathname));
		if (hit) return hit;
		// A page never visited: fall back to the cached playground or home page.
		const lang = url.pathname.startsWith("/en") ? "en" : "sw";
		const fallback = (await cache.match(`/${lang}/uwanja`)) || (await cache.match("/sw/uwanja"));
		if (fallback && url.pathname.includes("/uwanja")) return fallback;
		return offlinePage(lang);
	}
}

function offlinePage(lang) {
	const sw = lang !== "en";
	const html = `<!doctype html>
<html lang="${sw ? "sw" : "en"}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${sw ? "Hakuna mtandao" : "You are offline"} · Nuru</title>
<style>
body{margin:0;min-height:100dvh;display:grid;place-items:center;background:#fff8e7;color:#15120f;font:16px/1.5 system-ui,sans-serif;padding:24px;box-sizing:border-box}
main{max-width:28rem;border:2px solid #15120f;border-radius:14px;box-shadow:4px 4px 0 #15120f;background:#fffdf6;padding:28px}
h1{font-size:28px;line-height:1.1;margin:12px 0}
mark{background:#ffc93c;padding:0 .15em}
a{display:inline-block;margin-top:16px;margin-right:8px;padding:10px 16px;border:2px solid #15120f;border-radius:10px;background:#ffc93c;color:#15120f;font-weight:700;text-decoration:none;box-shadow:2px 2px 0 #15120f}
a.pili{background:#fffdf6}
small{display:block;margin-top:20px;color:#6b6257;font-style:italic}
</style></head><body><main>
<svg width="40" height="40" viewBox="0 0 32 32" aria-hidden="true"><g stroke="#15120f" stroke-width="1.4" stroke-linejoin="round" fill="#ffc93c"><circle cx="16" cy="16" r="7.2"/></g></svg>
<h1>${sw ? "Hakuna <mark>mtandao</mark> kwa sasa" : "You are <mark>offline</mark>"}</h1>
<p>${
		sw
			? "Ukurasa huu haujahifadhiwa kwenye kifaa chako bado. Uwanja na kurasa ulizowahi kufungua bado zinafanya kazi bila intaneti."
			: "This page is not saved on your device yet. Uwanja and the pages you opened before still work without internet."
	}</p>
<a href="/${lang}/uwanja">${sw ? "Fungua Uwanja" : "Open Uwanja"}</a><a class="pili" href="javascript:location.reload()">${sw ? "Jaribu tena" : "Try again"}</a>
<small>Kuteleza si kuanguka.</small>
</main></body></html>`;
	return new Response(html, {
		status: 503,
		headers: {
			"Content-Type": "text/html; charset=utf-8",
			"Cross-Origin-Opener-Policy": "same-origin",
			"Cross-Origin-Embedder-Policy": "credentialless",
		},
	});
}
