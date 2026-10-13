// Single entry point for learner progress. The lesson UI calls reportProgress()
// whenever a lesson is submitted; this module decides where it goes:
//   - localStorage, always (works offline and for anonymous visitors);
//   - POST /api/maendeleo, fire and forget. The server records it for a darasa
//     learner or a signed-in user and ignores anonymous visitors. Failed sends wait
//     in a localStorage queue and flush on the next success or "online" event.
// The device has one owner at a time: a darasa learner (their id), a Logto user
// (`logto:<sub>`), or nobody. On each page load GET /api/darasa/mimi says who the
// server sees; when that differs from the stored owner, the previous owner's
// local progress is set aside and the server's progress is merged in. An
// anonymous visitor's progress is stashed and restored when the owner leaves.
// Queued attempts carry their owner and a client id, so they are only ever sent
// as the person who made them, and removed by id once sent.
//
// OWNER: darasa feature. The lesson UI must only depend on the exported API below.

import { readHint } from "@/lib/darasa/shared";
import { bodyFor, clampCode, MAX_BODY_BYTES, nextBatch, parseQueue, utf8Bytes, withoutSent, type QueuedReport } from "./progress-queue";

export interface ProgressReport {
	moduleId: string;
	lessonId: string;
	passed: boolean;
	code: string;
}

export interface LessonProgress {
	completedLessonIds: string[];
}

const PREFIX = "nuru-progress-";
const key = (moduleId: string) => `${PREFIX}${moduleId}`;
const QUEUE_KEY = "nuru-maendeleo-foleni";
const OWNER_KEY = "nuru-darasa-mmiliki";
const STASH_KEY = "nuru-darasa-hifadhi";
const MAX_QUEUE = 200;
const LOGTO = "logto:";

export function readLocalProgress(moduleId: string): LessonProgress {
	try {
		const raw = localStorage.getItem(key(moduleId));
		if (raw) return JSON.parse(raw);
	} catch {}
	return { completedLessonIds: [] };
}

function markPassed(moduleId: string, lessonId: string) {
	const p = readLocalProgress(moduleId);
	if (p.completedLessonIds.includes(lessonId)) return false;
	p.completedLessonIds.push(lessonId);
	try {
		localStorage.setItem(key(moduleId), JSON.stringify(p));
	} catch {}
	return true;
}

export async function reportProgress(report: ProgressReport): Promise<void> {
	if (report.passed) markPassed(report.moduleId, report.lessonId);
	window.dispatchEvent(new CustomEvent("nuru:progress", { detail: report }));
	void send(report);
}

// --- owner -----------------------------------------------------------------

function storedOwner() {
	try {
		return localStorage.getItem(OWNER_KEY) || "";
	} catch {
		return "";
	}
}

/** Who the server will record an attempt for right now, as far as this tab knows. */
function currentOwner() {
	return readHint()?.id || storedOwner();
}

function newId() {
	try {
		return crypto.randomUUID();
	} catch {
		return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;
	}
}

/**
 * Drop the pages the service worker saved for offline use. They can hold the
 * previous person's darasa page, so they go whenever the device changes hands.
 */
function purgeOfflinePages() {
	try {
		navigator.serviceWorker?.controller?.postMessage({ type: "nuru:futa-kurasa" });
	} catch {}
	try {
		if (typeof caches === "undefined") return;
		void caches
			.keys()
			.then((keys) => Promise.all(keys.filter((k) => k.startsWith("nuru-") && k.endsWith("-pages")).map((k) => caches.delete(k))))
			.catch(() => {});
	} catch {}
}

// --- queue -----------------------------------------------------------------

function readQueue(): QueuedReport[] {
	try {
		const raw = JSON.parse(localStorage.getItem(QUEUE_KEY) || "[]");
		const q = parseQueue(raw, newId, storedOwner());
		// Items from before client ids existed get one now, and keep it.
		if (Array.isArray(raw) && raw.some((r) => !r || typeof r.cid !== "string" || typeof r.owner !== "string")) writeQueue(q);
		return q;
	} catch {
		return [];
	}
}

function writeQueue(q: QueuedReport[]) {
	try {
		if (q.length) localStorage.setItem(QUEUE_KEY, JSON.stringify(q.slice(-MAX_QUEUE)));
		else localStorage.removeItem(QUEUE_KEY);
	} catch {}
}

type PostResult = "ok" | "drop" | "retry";

async function post(items: QueuedReport[], keepalive: boolean): Promise<PostResult> {
	const body = bodyFor(items);
	const res = await fetch("/api/maendeleo", {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body,
		// Browsers refuse keepalive bodies over 64 KiB, so only small sends use it.
		keepalive: keepalive && utf8Bytes(body) < MAX_BODY_BYTES,
		credentials: "same-origin",
	});
	if (res.ok) return "ok";
	// The server will never accept this body: retrying it would block the queue.
	if (res.status === 400 || res.status === 413) return "drop";
	return "retry";
}

async function send(report: ProgressReport) {
	const item: QueuedReport = {
		cid: newId(),
		owner: currentOwner(),
		moduleId: report.moduleId,
		lessonId: report.lessonId,
		passed: report.passed,
		code: clampCode(report.code),
	};
	try {
		const r = await post([item], true);
		if (r !== "retry") {
			if (r === "ok") void flushQueue();
			return;
		}
	} catch {}
	// The server ignores anonymous visitors, so there is nothing to retry for them.
	if (item.owner) writeQueue([...readQueue(), item]);
}

let flushing = false;

async function flushFor(owner: string) {
	for (let i = 0; i < 20; i++) {
		const batch = nextBatch(readQueue(), owner);
		if (!batch.length) return;
		let r: PostResult;
		try {
			r = await post(batch, false);
		} catch {
			return;
		}
		if (r === "retry") return;
		writeQueue(withoutSent(readQueue(), batch));
	}
}

/**
 * Send this owner's queued attempts. Runs after any successful send, after the
 * page-load sync and on the "online" event. Only one tab flushes at a time.
 * Resolves with how many of the current owner's attempts are still waiting.
 */
export async function flushQueue(): Promise<number> {
	const owner = currentOwner();
	if (!owner) return 0;
	try {
		const locks = (navigator as Navigator & { locks?: LockManager }).locks;
		if (locks) await locks.request("nuru-maendeleo-foleni", () => flushFor(owner));
		else if (!flushing) {
			flushing = true;
			try {
				await flushFor(owner);
			} finally {
				flushing = false;
			}
		}
	} catch {}
	return readQueue().filter((i) => i.owner === owner).length;
}

// --- server sync -----------------------------------------------------------

type ServerEntry = { lessonId: string; moduleId: string; passed: boolean };

function progressKeys() {
	const keys: string[] = [];
	for (let i = 0; i < localStorage.length; i++) {
		const k = localStorage.key(i);
		if (k?.startsWith(PREFIX)) keys.push(k);
	}
	return keys;
}

/**
 * Make localStorage hold this owner's progress (`owner` is a darasa learner id or
 * `logto:<sub>`). When the device's previous owner was someone else, their
 * progress is cleared (an anonymous visitor's is stashed and comes back when the
 * owner leaves). Then the server's passed lessons are merged in. Queued attempts
 * stay: each carries its own owner and is only sent as them.
 */
export function adoptServerProgress(owner: string, entries: ServerEntry[]) {
	try {
		const previous = localStorage.getItem(OWNER_KEY) || "";
		if (previous !== owner) {
			const keys = progressKeys();
			if (!previous && keys.length && !localStorage.getItem(STASH_KEY)) {
				const stash: Record<string, string> = {};
				for (const k of keys) stash[k] = localStorage.getItem(k) ?? "";
				localStorage.setItem(STASH_KEY, JSON.stringify(stash));
			}
			for (const k of keys) localStorage.removeItem(k);
			localStorage.setItem(OWNER_KEY, owner);
			purgeOfflinePages();
		}
	} catch {
		return;
	}
	let changed = false;
	for (const e of entries) if (e.passed && markPassed(e.moduleId, e.lessonId)) changed = true;
	if (changed) window.dispatchEvent(new CustomEvent("nuru:progress"));
}

/** The owner left this device: forget their local progress and bring back the stashed one. */
export function releaseLearnerProgress() {
	try {
		for (const k of progressKeys()) localStorage.removeItem(k);
		const stash = localStorage.getItem(STASH_KEY);
		if (stash) {
			for (const [k, v] of Object.entries(JSON.parse(stash) as Record<string, string>)) localStorage.setItem(k, v);
			localStorage.removeItem(STASH_KEY);
		}
		localStorage.removeItem(OWNER_KEY);
	} catch {}
	purgeOfflinePages();
	window.dispatchEvent(new CustomEvent("nuru:progress"));
}

type MimiSync = { mmiliki?: string | null; maendeleo?: ServerEntry[] };

let syncing: Promise<boolean> | null = null;

/** Ask the server who owns progress on this device and adopt them. Resolves false when offline. */
export function syncFromServer(): Promise<boolean> {
	if (!syncing) {
		syncing = (async () => {
			// The darasa session ended elsewhere (cookie expired or cleared): release this device.
			const stored = storedOwner();
			if (stored && !stored.startsWith(LOGTO) && !readHint()) releaseLearnerProgress();
			try {
				const res = await fetch("/api/darasa/mimi", { credentials: "same-origin", cache: "no-store" });
				if (!res.ok) return false;
				const data = (await res.json()) as MimiSync;
				const owner = typeof data?.mmiliki === "string" && data.mmiliki ? data.mmiliki : null;
				if (owner) adoptServerProgress(owner, data.maendeleo ?? []);
				else if (storedOwner()) releaseLearnerProgress();
				return true;
			} catch {
				return false;
			} finally {
				syncing = null;
			}
		})();
	}
	return syncing;
}

if (typeof window !== "undefined") {
	const syncThenFlush = async () => {
		if (await syncFromServer()) await flushQueue();
	};
	window.addEventListener("online", () => void syncThenFlush());
	setTimeout(() => void syncThenFlush(), 0);
}

/**
 * Who this device's per-lesson editor state belongs to, for namespacing the
 * lesson UI's saved code and attempt counts: the darasa learner in the hint
 * cookie (known synchronously, before the server sync), else a Logto owner
 * this device already adopted (`logto:<sub>`), else "" for an anonymous
 * visitor. The next learner on a shared device then starts clean.
 */
export function currentOwnerKey(): string {
	const hint = readHint()?.id;
	if (hint) return hint;
	const stored = storedOwner();
	return stored.startsWith(LOGTO) ? stored : "";
}
