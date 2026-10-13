"use client";

import { useEffect, useState } from "react";
import { readLocalProgress } from "@/lib/progress";

/**
 * Completed lesson ids per module, read from localStorage and kept fresh on the
 * "nuru:progress" event (this tab) and the storage event (other tabs).
 * Returns null until mounted so server and first client render match.
 */
export function useLocalProgress(moduleIds: string[]): Record<string, Set<string>> | null {
	const [progress, setProgress] = useState<Record<string, Set<string>> | null>(null);
	const key = moduleIds.join(",");

	useEffect(() => {
		const read = () => {
			const next: Record<string, Set<string>> = {};
			for (const id of key ? key.split(",") : []) next[id] = new Set(readLocalProgress(id).completedLessonIds);
			setProgress(next);
		};
		read();
		const onStorage = (e: StorageEvent) => {
			if (!e.key || e.key.startsWith("nuru-progress-")) read();
		};
		window.addEventListener("nuru:progress", read);
		window.addEventListener("storage", onStorage);
		return () => {
			window.removeEventListener("nuru:progress", read);
			window.removeEventListener("storage", onStorage);
		};
	}, [key]);

	return progress;
}
