/**
 * Lightweight localStorage utility for Playground product data that does not
 * yet exist in the backend (progress dashboard, recent activity, badges,
 * practice sessions, submissions, UI state). SSR-safe: every read returns a
 * default when window/localStorage are unavailable.
 */

export type PlaygroundProgress = {
	completedLessonSlugs: string[];
	currentLessonSlug?: string;
	lastLessonSlug?: string;
	updatedAt: string;
};

export type PlaygroundRun = {
	lessonSlug: string;
	language: "en" | "sw";
	code: string;
	passed: number;
	total: number;
	success: boolean;
	ranAt: string;
};

export type PlaygroundActivity = {
	id: string;
	type:
		| "lesson_completed"
		| "tests_passed"
		| "tests_failed"
		| "project_submitted"
		| "badge_earned"
		| "lesson_opened";
	title: string;
	description?: string;
	lessonSlug?: string;
	createdAt: string;
};

export type PlaygroundSubmission = {
	lessonSlug: string;
	code: string;
	score?: number;
	passed: number;
	total: number;
	submittedAt: string;
};

export type PlaygroundUiState = {
	guideOpen?: boolean;
	selectedGuideTab?: "help" | "explain" | "examples" | "fix";
	focusedMode?: boolean;
	expandedModules?: string[];
};

export type PracticeSession = {
	date: string; // yyyy-mm-dd
	minutes: number;
	lessonSlug?: string;
	runs: number;
};

export type EarnedBadge = {
	id: string;
	title: string;
	description?: string;
	earnedAt: string;
};

export const STORAGE_KEYS = {
	progress: "nuru.playground.progress",
	completedLessons: "nuru.playground.completedLessons",
	lastLesson: "nuru.playground.lastLesson",
	runs: "nuru.playground.lessonRuns",
	submissions: "nuru.playground.submissions",
	activity: "nuru.playground.recentActivity",
	practice: "nuru.playground.practiceSessions",
	badges: "nuru.playground.badges",
	ui: "nuru.playground.uiState",
} as const;

const hasStorage = () =>
	typeof window !== "undefined" && typeof window.localStorage !== "undefined";

export function readJson<T>(key: string, fallback: T): T {
	if (!hasStorage()) return fallback;
	try {
		const raw = window.localStorage.getItem(key);
		if (!raw) return fallback;
		return JSON.parse(raw) as T;
	} catch {
		return fallback;
	}
}

export function writeJson<T>(key: string, value: T): void {
	if (!hasStorage()) return;
	try {
		window.localStorage.setItem(key, JSON.stringify(value));
	} catch {
		/* quota / disabled — ignore */
	}
}

/* ----------------------------- Activity ----------------------------- */

export function recordActivity(a: Omit<PlaygroundActivity, "id" | "createdAt">) {
	const list = readJson<PlaygroundActivity[]>(STORAGE_KEYS.activity, []);
	const item: PlaygroundActivity = {
		...a,
		id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
		createdAt: new Date().toISOString(),
	};
	const next = [item, ...list].slice(0, 100);
	writeJson(STORAGE_KEYS.activity, next);
	return item;
}

export function getActivity(limit = 20): PlaygroundActivity[] {
	return readJson<PlaygroundActivity[]>(STORAGE_KEYS.activity, []).slice(
		0,
		limit,
	);
}

/* ------------------------------ Runs -------------------------------- */

export function recordRun(run: Omit<PlaygroundRun, "ranAt">) {
	const list = readJson<PlaygroundRun[]>(STORAGE_KEYS.runs, []);
	const next = [{ ...run, ranAt: new Date().toISOString() }, ...list].slice(
		0,
		200,
	);
	writeJson(STORAGE_KEYS.runs, next);
}

export function getRuns(): PlaygroundRun[] {
	return readJson<PlaygroundRun[]>(STORAGE_KEYS.runs, []);
}

/* --------------------------- Submissions ---------------------------- */

export function saveSubmission(s: PlaygroundSubmission) {
	const list = readJson<PlaygroundSubmission[]>(STORAGE_KEYS.submissions, []);
	const filtered = list.filter((x) => x.lessonSlug !== s.lessonSlug);
	writeJson(STORAGE_KEYS.submissions, [s, ...filtered]);
}

export function getSubmissions(): PlaygroundSubmission[] {
	return readJson<PlaygroundSubmission[]>(STORAGE_KEYS.submissions, []);
}

/* ------------------------------ UI ---------------------------------- */

export function getUiState(): PlaygroundUiState {
	return readJson<PlaygroundUiState>(STORAGE_KEYS.ui, {});
}

export function setUiState(patch: Partial<PlaygroundUiState>) {
	writeJson(STORAGE_KEYS.ui, { ...getUiState(), ...patch });
}

/* ---------------------------- Practice ------------------------------ */

function today(): string {
	return new Date().toISOString().slice(0, 10);
}

export function recordPractice(lessonSlug?: string, minutes = 1) {
	const list = readJson<PracticeSession[]>(STORAGE_KEYS.practice, []);
	const d = today();
	const existing = list.find((s) => s.date === d);
	if (existing) {
		existing.minutes += minutes;
		existing.runs += 1;
		if (lessonSlug) existing.lessonSlug = lessonSlug;
		writeJson(STORAGE_KEYS.practice, list);
	} else {
		writeJson(STORAGE_KEYS.practice, [
			{ date: d, minutes, lessonSlug, runs: 1 },
			...list,
		]);
	}
}

export function getPracticeWeek(): PracticeSession[] {
	const list = readJson<PracticeSession[]>(STORAGE_KEYS.practice, []);
	const week: PracticeSession[] = [];
	for (let i = 6; i >= 0; i--) {
		const d = new Date();
		d.setDate(d.getDate() - i);
		const key = d.toISOString().slice(0, 10);
		const found = list.find((s) => s.date === key);
		week.push(found ?? { date: key, minutes: 0, runs: 0 });
	}
	return week;
}

export function getStreak(): number {
	const list = readJson<PracticeSession[]>(STORAGE_KEYS.practice, []);
	const days = new Set(list.filter((s) => s.minutes > 0).map((s) => s.date));
	let streak = 0;
	const cursor = new Date();
	while (days.has(cursor.toISOString().slice(0, 10))) {
		streak += 1;
		cursor.setDate(cursor.getDate() - 1);
	}
	return streak;
}

/* ----------------------------- Badges ------------------------------- */

const BADGE_DEFS = [
	{ id: "first-steps", title: "First Steps", description: "Completed your first lesson" },
	{ id: "consistent", title: "Consistent", description: "Practiced 7 days in a row" },
	{ id: "problem-solver", title: "Problem Solver", description: "Passed 10 test suites" },
	{ id: "quick-learner", title: "Quick Learner", description: "Passed 5 lessons with all tests" },
] as const;

export function computeBadges(opts: {
	completedCount: number;
	streak: number;
	passedSuites: number;
}): EarnedBadge[] {
	const list = readJson<EarnedBadge[]>(STORAGE_KEYS.badges, []);
	const have = new Set(list.map((b) => b.id));
	const newly: EarnedBadge[] = [];
	const grant = (id: string) => {
		if (have.has(id)) return;
		const def = BADGE_DEFS.find((b) => b.id === id);
		if (!def) return;
		newly.push({
			id: def.id,
			title: def.title,
			description: def.description,
			earnedAt: new Date().toISOString(),
		});
	};
	if (opts.completedCount >= 1) grant("first-steps");
	if (opts.streak >= 7) grant("consistent");
	if (opts.passedSuites >= 10) grant("problem-solver");
	if (opts.passedSuites >= 5) grant("quick-learner");
	if (newly.length) writeJson(STORAGE_KEYS.badges, [...newly, ...list]);
	return readJson<EarnedBadge[]>(STORAGE_KEYS.badges, []);
}

export function getBadges(): EarnedBadge[] {
	return readJson<EarnedBadge[]>(STORAGE_KEYS.badges, []);
}
