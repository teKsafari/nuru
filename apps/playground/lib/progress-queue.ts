// Pure helpers for the offline progress queue in lib/progress.ts. No DOM, no
// imports, so `node --test lib/progress-queue.test.mjs` can load them directly.

/** Matches MAX_CODE in app/api/maendeleo/route.ts: the server keeps no more than this. */
export const MAX_CODE = 20_000;

/**
 * Browsers reject a keepalive fetch whose body passes 64 KiB, and a batch is
 * cheaper to retry when it stays small, so each POST body stays under this.
 */
export const MAX_BODY_BYTES = 60_000;

/** The server accepts at most 100 items per batch. */
export const MAX_BATCH_ITEMS = 100;

export interface QueuedReport {
	/** Client id: sent items are removed by id, never by position. */
	cid: string;
	/** Whose attempt this is: a darasa learner id, `logto:<sub>`, or "" for an anonymous visitor. */
	owner: string;
	moduleId: string;
	lessonId: string;
	passed: boolean;
	code: string;
}

export function clampCode(code: string) {
	return typeof code === "string" ? code.slice(0, MAX_CODE) : "";
}

/** Bytes of a string once encoded as UTF-8 (what fetch sends). */
export function utf8Bytes(s: string) {
	let n = 0;
	for (let i = 0; i < s.length; i++) {
		const c = s.charCodeAt(i);
		if (c < 0x80) n += 1;
		else if (c < 0x800) n += 2;
		else if (c >= 0xd800 && c <= 0xdbff && (s.charCodeAt(i + 1) & 0xfc00) === 0xdc00) {
			n += 4;
			i++;
		} else n += 3; // includes a lone surrogate, sent as U+FFFD
	}
	return n;
}

/** The JSON the server expects for these items (one item, or { items }). */
export function bodyFor(items: Pick<QueuedReport, "moduleId" | "lessonId" | "passed" | "code">[]) {
	const strip = ({ moduleId, lessonId, passed, code }: (typeof items)[number]) => ({ moduleId, lessonId, passed, code });
	return JSON.stringify(items.length === 1 ? strip(items[0]) : { items: items.map(strip) });
}

/**
 * The first batch to send: the oldest items of `owner`, at most MAX_BATCH_ITEMS
 * and MAX_BODY_BYTES. Always takes at least one item (its code is clamped, so
 * a single item fits).
 */
export function nextBatch(queue: QueuedReport[], owner: string, maxBytes = MAX_BODY_BYTES): QueuedReport[] {
	const batch: QueuedReport[] = [];
	let bytes = 12; // {"items":[]}
	for (const item of queue) {
		if (item.owner !== owner) continue;
		const size = utf8Bytes(bodyFor([item])) + 1;
		if (batch.length && (batch.length >= MAX_BATCH_ITEMS || bytes + size > maxBytes)) break;
		batch.push(item);
		bytes += size;
	}
	return batch;
}

/** The queue without the items that were sent. */
export function withoutSent(queue: QueuedReport[], sent: QueuedReport[]) {
	const ids = new Set(sent.map((i) => i.cid));
	return queue.filter((i) => !ids.has(i.cid));
}

/**
 * Parse a stored queue, keeping only well-formed items. Items saved before ids and
 * owners existed get a fresh id and `legacyOwner` (the device owner at the time,
 * since the old code emptied the queue whenever the owner changed).
 */
export function parseQueue(raw: unknown, makeId: () => string, legacyOwner: string): QueuedReport[] {
	if (!Array.isArray(raw)) return [];
	const out: QueuedReport[] = [];
	for (const v of raw) {
		if (!v || typeof v !== "object") continue;
		const r = v as Record<string, unknown>;
		if (typeof r.moduleId !== "string" || typeof r.lessonId !== "string" || typeof r.passed !== "boolean") continue;
		out.push({
			cid: typeof r.cid === "string" && r.cid ? r.cid : makeId(),
			owner: typeof r.owner === "string" ? r.owner : legacyOwner,
			moduleId: r.moduleId,
			lessonId: r.lessonId,
			passed: r.passed,
			code: clampCode(typeof r.code === "string" ? r.code : ""),
		});
	}
	return out;
}
