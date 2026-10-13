// Pure rate and lock policy for picture-password sign-in. No imports, so
// `node --test lib/darasa/limits.test.mjs` runs it without a bundler.

/** Wrong attempts allowed before a lock. */
export const MAX_ATTEMPTS = 5;

/** Lock lengths by lock level: 1 minute, 5 minutes, 30 minutes. */
export const LOCK_STEPS_MS = [60_000, 5 * 60_000, 30 * 60_000] as const;

/** At this lock level the learner stays locked until a teacher resets their pictures. */
export const LOCK_LEVEL_TEACHER = LOCK_STEPS_MS.length + 1;

/** How long the lock at `level` (1-based) lasts, or null when only a teacher can lift it. */
export function lockDurationMs(level: number): number | null {
	if (level < 1) return 0;
	return level <= LOCK_STEPS_MS.length ? LOCK_STEPS_MS[level - 1] : null;
}

/**
 * Token bucket keyed by string. In-memory and per server instance: with several
 * instances an attacker gets one bucket per instance. The per-learner lock in the
 * database is the hard limit; this only slows bulk guessing and enumeration.
 */
export class TokenBuckets {
	private buckets = new Map<string, { tokens: number; at: number }>();
	private capacity: number;
	private refillPerSec: number;
	private maxKeys: number;

	constructor(capacity: number, refillPerSec: number, maxKeys = 10_000) {
		this.capacity = capacity;
		this.refillPerSec = refillPerSec;
		this.maxKeys = maxKeys;
	}

	/** Take one token. Returns 0 when allowed, otherwise the seconds to wait. */
	take(key: string, now = Date.now()): number {
		let b = this.buckets.get(key);
		if (b) {
			b.tokens = Math.min(this.capacity, b.tokens + ((now - b.at) / 1000) * this.refillPerSec);
			b.at = now;
		} else {
			if (this.buckets.size >= this.maxKeys) this.prune(now);
			b = { tokens: this.capacity, at: now };
			this.buckets.set(key, b);
		}
		if (b.tokens >= 1) {
			b.tokens -= 1;
			return 0;
		}
		return Math.max(1, Math.ceil((1 - b.tokens) / this.refillPerSec));
	}

	/** Drop buckets that have refilled completely; if that frees nothing, drop the oldest half. */
	private prune(now: number) {
		const full = this.capacity / this.refillPerSec;
		for (const [k, b] of this.buckets) if ((now - b.at) / 1000 >= full) this.buckets.delete(k);
		if (this.buckets.size >= this.maxKeys) {
			let n = Math.floor(this.buckets.size / 2);
			for (const k of this.buckets.keys()) {
				if (n-- <= 0) break;
				this.buckets.delete(k);
			}
		}
	}
}

/** Best-effort client IP from proxy headers. */
export function clientIp(headers: Headers): string {
	const fwd = headers.get("x-forwarded-for");
	if (fwd) return fwd.split(",")[0]!.trim();
	return headers.get("x-real-ip")?.trim() || "unknown";
}
