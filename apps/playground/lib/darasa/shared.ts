// Darasa constants and helpers safe for both client and server.

/** The nine picture-password pictures, in grid order. Labels live in components/darasa/picha.tsx. */
export const PICHA_IDS = ["simba", "tembo", "twiga", "pundamilia", "kuku", "samaki", "embe", "nazi", "ndizi"] as const;
export type PichaId = (typeof PICHA_IDS)[number];
export const PICHA_UREFU = 3;

/** Join-code alphabet: no 0/O, no 1/I, so codes read cleanly off a classroom wall. */
export const CODE_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

/** "kij 7q4" -> "KIJ-7Q4". Returns null when it cannot be a valid code. */
export function normalizeCode(input: string): string | null {
	const raw = input.toUpperCase().replace(/[^A-Z0-9]/g, "");
	if (raw.length !== 6) return null;
	for (const ch of raw) if (!CODE_ALPHABET.includes(ch)) return null;
	return `${raw.slice(0, 3)}-${raw.slice(3)}`;
}

/** Collapse whitespace and trim a learner's display name. */
export function normalizeName(input: string) {
	return input.normalize("NFC").replace(/\s+/g, " ").trim();
}

/** Readable (non-httpOnly) hint cookie: who is signed in on this device, for the badge and progress sync. */
export const HINT_COOKIE = "nuru-darasa";
export type DarasaHint = { id: string; jina: string; darasa: string };

export function readHint(): DarasaHint | null {
	if (typeof document === "undefined") return null;
	const m = document.cookie.match(new RegExp(`(?:^|; )${HINT_COOKIE}=([^;]*)`));
	if (!m) return null;
	try {
		let raw = m[1];
		for (let i = 0; i < 2 && !raw.startsWith("{"); i++) raw = decodeURIComponent(raw);
		const v = JSON.parse(raw);
		return v && typeof v.id === "string" ? v : null;
	} catch {
		return null;
	}
}

/** Shape returned by GET /api/darasa/mimi. */
export interface MimiResponse {
	mwanafunzi: { id: string; displayName: string; viaLogto: boolean } | null;
	darasa: { id: string; name: string; code: string; teacherName: string | null } | null;
	moduli: {
		id: string;
		slug: string;
		title: { sw: string; en: string };
		lessons: { id: string; slug: string; title: { sw: string; en: string } }[];
	}[];
	maendeleo: { lessonId: string; moduleId: string; passed: boolean; attempts: number }[];
}
