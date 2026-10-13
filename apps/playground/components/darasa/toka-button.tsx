"use client";

import { useState } from "react";
import { Loader2, LogOut } from "lucide-react";

import { Button, type ButtonProps } from "@nuru/ui/components/button";
import { flushQueue, releaseLearnerProgress, syncFromServer } from "@/lib/progress";

export type TokaResult = { ok: true } | { ok: false; sababu: "mtandao" | "foleni" };

/**
 * Sign the darasa learner out of this device: send pending progress, clear the
 * cookie, restore local state. Local state is released only once the server has
 * cleared the session, so a failed sign-out leaves the learner (and their queued
 * attempts) exactly as they were, and the next child cannot record as them.
 */
export async function tokaDarasa(): Promise<TokaResult> {
	// Unsent attempts can only be sent while this learner's cookie exists.
	if ((await flushQueue().catch(() => 1)) > 0) return { ok: false, sababu: "foleni" };
	try {
		const res = await fetch("/api/darasa/toka", { method: "POST", credentials: "same-origin" });
		if (!res.ok) return { ok: false, sababu: "mtandao" };
	} catch {
		return { ok: false, sababu: "mtandao" };
	}
	releaseLearnerProgress();
	window.dispatchEvent(new CustomEvent("nuru:darasa"));
	// A Logto session may still be on this device: adopt its progress.
	void syncFromServer();
	return { ok: true };
}

export function TokaButton({
	label,
	makosa,
	redirectTo,
	...props
}: ButtonProps & { label: string; makosa: { mtandao: string; foleni: string }; redirectTo?: string }) {
	const [busy, setBusy] = useState(false);
	const [kosa, setKosa] = useState<string | null>(null);
	return (
		<span className="inline-flex flex-col items-start gap-2">
			<Button
				variant="outline"
				{...props}
				disabled={busy}
				onClick={async () => {
					setBusy(true);
					setKosa(null);
					const r = await tokaDarasa();
					if (r.ok) {
						// A full page load, not router.refresh(): on a shared device nothing of
						// the previous learner may survive in memory, and a soft refresh was
						// seen to keep rendering the old class home.
						window.location.assign(redirectTo ?? window.location.pathname);
						return;
					}
					setKosa(makosa[r.sababu]);
					setBusy(false);
				}}
			>
				{busy ? <Loader2 className="animate-spin" /> : <LogOut />}
				{label}
			</Button>
			{kosa && (
				<span role="alert" className="max-w-72 text-sm text-destructive">
					{kosa}
				</span>
			)}
		</span>
	);
}
