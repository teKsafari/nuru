// Nuru service worker: keeps the runtime and the public pages a learner has
// visited available without a connection. Hand-written, no build step.
//
// components/tovuti/sw-register.tsx registers it as /sw.js?b=<build>&r=<runtime>
// (both stamped by scripts/copy-runtime.mjs). A new deploy is a new script URL,
// so the browser installs this worker again and activate drops the previous
// deploy's caches; the runtime cache is kept while the runtime hash is unchanged.
//
//   /nuru/*?v=<runtime>  cache first, exact URL (precached as one set in install)
//   /_next/static/**, /icons/**, fonts  cache first (file names are hashed)
//   public pages         network first, cached copy when offline, then a
//                        Swahili offline page. Only the allowlist in PUBLIC_PAGE is
//                        stored: /darasa and anything per-learner never is.
//   /api/**, /callback, other origins  never touched
//
// Responses are stored and served as the original Response objects, so the
// COOP/COEP headers that cross-origin isolation (and jaza()) depend on survive.
//
// Pages carry the signed-in Logto user in the header, so lib/progress.ts asks
// for them to be dropped (message "nuru:futa-kurasa") whenever the device's
// owner changes or a learner signs out.

const params = new URL(self.location.href).searchParams;
const clean = (v) => (v || "").replace(/[^A-Za-z0-9_-]/g, "");
const BUILD = clean(params.get("b")) || "0";
const RUNTIME_VERSION = clean(params.get("r"));

const RUNTIME = `nuru-runtime-${RUNTIME_VERSION || "0"}`;
const STATIC = `nuru-${BUILD}-static`;
const PAGES = `nuru-${BUILD}-pages`;
const MAX_PAGES = 40;
const MAX_STATIC = 400;

const v = RUNTIME_VERSION ? `?v=${RUNTIME_VERSION}` : "";
const PRECACHE_RUNTIME = [`/nuru/nuru.wasm${v}`, `/nuru/wasm_exec.js${v}`, `/nuru/nuru-worker.js${v}`];
const PRECACHE_STATIC = ["/manifest.json", "/favicon.svg", "/icons/icon-192.png"];
const PRECACHE_PAGES = ["/sw", "/sw/uwanja"];

// Pages that render the same for every visitor (apart from the header). Never
// /darasa, which shows the signed-in learner's class and progress.
const PUBLIC_PAGE = /^\/(?:sw|en)(?:\/(?:uwanja|anza(?:\/[^/]+){0,2}|kamusi(?:\/[^/]+)?|masomo(?:\/[^/]+)?))?\/?$/;

// /_next/static URLs referenced by a page's HTML, including the escaped ones in
// the RSC payload (\"/_next/static/...\").
function staticUrls(html) {
	const out = new Set();
	for (const m of html.matchAll(/\/_next\/static\/[^"'\s\\<>]+/g)) out.add(m[0]);
	return [...out];
}

async function cacheStatic(urls) {
	const cache = await caches.open(STATIC);
	await Promise.all(
		urls.map(async (url) => {
			try {
				if (await cache.match(url)) return;
				const res = await fetch(url, { credentials: "same-origin" });
				if (cacheable(res)) await cache.put(url, res);
			} catch {}
		}),
	);
}

self.addEventListener("install", (event) => {
	event.waitUntil(
		(async () => {
			// The runtime goes in as one set or not at all, so a cut-off download can
			// never pair a new wasm_exec.js with an old wasm.
			const runtime = await caches.open(RUNTIME);
			const have = await Promise.all(PRECACHE_RUNTIME.map((url) => runtime.match(url)));
			if (have.some((r) => !r)) {
				try {
					const fresh = await Promise.all(
						PRECACHE_RUNTIME.map(async (url) => {
							const res = await fetch(url, { credentials: "same-origin", cache: "reload" });
							if (!cacheable(res)) throw new Error(url);
							return res;
						}),
					);
					await Promise.all(fresh.map((res, i) => runtime.put(PRECACHE_RUNTIME[i], res)));
				} catch {}
			}
			await cacheStatic(PRECACHE_STATIC);
			// The offline shell, fetched without cookies so no one's name is stored,
			// plus every chunk it loads: without them the cached HTML never hydrates.
			const pages = await caches.open(PAGES);
			const chunks = [];
			await Promise.all(
				PRECACHE_PAGES.map(async (url) => {
					try {
						const res = await fetch(url, { credentials: "omit" });
						if (!cacheable(res)) return;
						chunks.push(...staticUrls(await res.clone().text()));
						await pages.put(url, res);
					} catch {}
				}),
			);
			await cacheStatic([...new Set(chunks)]);
			await self.skipWaiting();
		})(),
	);
});

self.addEventListener("activate", (event) => {
	event.waitUntil(
		(async () => {
			const keep = new Set([RUNTIME, STATIC, PAGES]);
			const keys = await caches.keys();
			await Promise.all(keys.filter((k) => k.startsWith("nuru-") && !keep.has(k)).map((k) => caches.delete(k)));
			await self.clients.claim();
		})(),
	);
});

self.addEventListener("message", (event) => {
	const data = event.data || {};
	if (data.type === "nuru:futa-kurasa") {
		event.waitUntil(caches.delete(PAGES));
	} else if (data.type === "nuru:hifadhi" && Array.isArray(data.urls)) {
		// Chunks the page loaded before this worker controlled it (sw-register.tsx).
		const urls = data.urls
			.filter((u) => typeof u === "string")
			.map((u) => {
				try {
					const url = new URL(u, self.location.origin);
					return url.origin === self.location.origin && url.pathname.startsWith("/_next/static/") ? url.pathname + url.search : null;
				} catch {
					return null;
				}
			})
			.filter(Boolean)
			.slice(0, 200);
		event.waitUntil(cacheStatic(urls));
	}
});

function cacheable(res) {
	return res && res.ok && res.type === "basic" && !res.redirected;
}

async function put(cacheName, req, res, max) {
	try {
		const cache = await caches.open(cacheName);
		await cache.delete(req, { ignoreSearch: false });
		await cache.put(req, res);
		// Oldest first: keys() lists entries in insertion order, and a re-put moves to the end.
		const keys = await cache.keys();
		for (const k of keys.slice(0, Math.max(0, keys.length - max))) await cache.delete(k);
	} catch {
		// Quota reached or storage unavailable: serving the response matters more.
	}
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
		event.respondWith(cacheFirst(event, req, RUNTIME, 10));
		return;
	}
	if (path.startsWith("/_next/static/") || path.startsWith("/icons/") || /\.(?:woff2?|ttf|otf)$/.test(path)) {
		event.respondWith(cacheFirst(event, req, STATIC, MAX_STATIC));
		return;
	}
	if (req.mode === "navigate") {
		event.respondWith(networkFirstPage(event, req));
	}
});

async function cacheFirst(event, req, cacheName, max) {
	const cache = await caches.open(cacheName);
	const hit = await cache.match(req);
	if (hit) return hit;
	const res = await fetch(req);
	if (cacheable(res)) event.waitUntil(put(cacheName, req, res.clone(), max));
	return res;
}

async function networkFirstPage(event, req) {
	const url = new URL(req.url);
	// "/" redirects to the learner's language; offline, the Swahili home stands in.
	const path = url.pathname === "/" ? "/sw" : url.pathname;
	try {
		const res = await fetch(req);
		if (cacheable(res) && PUBLIC_PAGE.test(path)) event.waitUntil(put(PAGES, path, res.clone(), MAX_PAGES));
		return res;
	} catch {
		const cache = await caches.open(PAGES);
		const hit = PUBLIC_PAGE.test(path) ? await cache.match(path) : null;
		if (hit) return hit;
		// A page never visited: fall back to the cached playground.
		const lang = path.startsWith("/en") ? "en" : "sw";
		if (path.includes("/uwanja")) {
			const fallback = (await cache.match(`/${lang}/uwanja`)) || (await cache.match("/sw/uwanja"));
			if (fallback) return fallback;
		}
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
