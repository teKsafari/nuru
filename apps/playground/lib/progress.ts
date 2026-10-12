// Single entry point for learner progress. The lesson UI calls reportProgress()
// whenever a lesson is submitted; this module decides where it goes
// (localStorage always; the server when the learner is signed in or in a darasa).
//
// OWNER: darasa feature. The lesson UI must only depend on the exported API below.

export interface ProgressReport {
	moduleId: string;
	lessonId: string;
	passed: boolean;
	code: string;
}

export interface LessonProgress {
	completedLessonIds: string[];
}

const key = (moduleId: string) => `nuru-progress-${moduleId}`;

export function readLocalProgress(moduleId: string): LessonProgress {
	try {
		const raw = localStorage.getItem(key(moduleId));
		if (raw) return JSON.parse(raw);
	} catch {}
	return { completedLessonIds: [] };
}

export async function reportProgress(report: ProgressReport): Promise<void> {
	if (report.passed) {
		const p = readLocalProgress(report.moduleId);
		if (!p.completedLessonIds.includes(report.lessonId)) {
			p.completedLessonIds.push(report.lessonId);
			try {
				localStorage.setItem(key(report.moduleId), JSON.stringify(p));
			} catch {}
		}
	}
	window.dispatchEvent(new CustomEvent("nuru:progress", { detail: report }));
}
