// Single entry point for learner progress. The lesson UI calls reportProgress()
// whenever a lesson is submitted; this module decides where it goes:
//   - localStorage, always (works offline and for anonymous visitors);
//   - POST /api/maendeleo, fire and forget. The server records it for a darasa
//     learner or a signed-in user and ignores anonymous visitors. Failed sends wait
//     in a localStorage queue and flush on the next success or "online" event.
// In a darasa session the server's progress is merged into localStorage on first
// load, so a learner who switches devices sees their own progress. On a shared
// device the previous visitor's local progress is set aside while a learner is
// signed in and restored when they press "Toka".
//
// OWNER: darasa feature. The lesson UI must only depend on the exported API below.

import { readHint } from "@/lib/darasa/shared";

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
	void send([report]);
}

// --- server sync -----------------------------------------------------------

function readQueue(): ProgressReport[] {
	try {
		const q = JSON.parse(localStorage.getItem(QUEUE_KEY) || "[]");
		return Array.isArray(q) ? q : [];
	} catch {
		return [];
	}
}

function writeQueue(q: ProgressReport[]) {
	try {
		if (q.length) localStorage.setItem(QUEUE_KEY, JSON.stringify(q.slice(-MAX_QUEUE)));
		else localStorage.removeItem(QUEUE_KEY);
	} catch {}
}

let flushing = false;

async function post(items: ProgressReport[]) {
	const res = await fetch("/api/maendeleo", {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(items.length === 1 ? items[0] : { items }),
		keepalive: true,
		credentials: "same-origin",
	});
	return res.ok;
}

async function send(items: ProgressReport[]) {
	try {
		if (await post(items)) {
			void flushQueue();
			return;
		}
	} catch {}
	writeQueue([...readQueue(), ...items]);
}

/** Send queued attempts. Runs after any successful send and on the "online" event. */
export async function flushQueue() {
	if (flushing) return;
	const q = readQueue();
	if (!q.length) return;
	flushing = true;
	try {
		const batch = q.slice(0, 100);
		if (await post(batch)) writeQueue(readQueue().slice(batch.length));
	} catch {
	} finally {
		flushing = false;
	}
}

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
 * Make localStorage hold this learner's progress. When the device's previous owner
 * was someone else, their progress is cleared (an anonymous visitor's is stashed
 * and comes back on Toka). Then the server's passed lessons are merged in.
 */
export function adoptServerProgress(learnerId: string, entries: ServerEntry[]) {
	try {
		const owner = localStorage.getItem(OWNER_KEY) || "";
		if (owner !== learnerId) {
			const keys = progressKeys();
			if (!owner && keys.length && !localStorage.getItem(STASH_KEY)) {
				const stash: Record<string, string> = {};
				for (const k of keys) stash[k] = localStorage.getItem(k) ?? "";
				localStorage.setItem(STASH_KEY, JSON.stringify(stash));
			}
			for (const k of keys) localStorage.removeItem(k);
			localStorage.removeItem(QUEUE_KEY);
			localStorage.setItem(OWNER_KEY, learnerId);
		}
	} catch {
		return;
	}
	let changed = false;
	for (const e of entries) if (e.passed && markPassed(e.moduleId, e.lessonId)) changed = true;
	if (changed) window.dispatchEvent(new CustomEvent("nuru:progress"));
}

/** Called on "Toka": forget the learner's local progress and bring back the stashed one. */
export function releaseLearnerProgress() {
	try {
		for (const k of progressKeys()) localStorage.removeItem(k);
		localStorage.removeItem(QUEUE_KEY);
		const stash = localStorage.getItem(STASH_KEY);
		if (stash) {
			for (const [k, v] of Object.entries(JSON.parse(stash) as Record<string, string>)) localStorage.setItem(k, v);
			localStorage.removeItem(STASH_KEY);
		}
		localStorage.removeItem(OWNER_KEY);
	} catch {}
	window.dispatchEvent(new CustomEvent("nuru:progress"));
}

let synced = false;

async function syncFromServer() {
	const hint = readHint();
	if (!hint) {
		// The session ended elsewhere (cookie expired or cleared): release this device.
		try {
			if (localStorage.getItem(OWNER_KEY)) releaseLearnerProgress();
		} catch {}
		return;
	}
	if (synced) return;
	synced = true;
	try {
		const res = await fetch("/api/darasa/mimi", { credentials: "same-origin", cache: "no-store" });
		if (!res.ok) return;
		const data = await res.json();
		if (data?.mwanafunzi?.id && !data.mwanafunzi.viaLogto) adoptServerProgress(data.mwanafunzi.id, data.maendeleo ?? []);
	} catch {
		synced = false;
	}
}

if (typeof window !== "undefined") {
	window.addEventListener("online", () => void flushQueue());
	setTimeout(() => {
		void syncFromServer();
		void flushQueue();
	}, 0);
}
