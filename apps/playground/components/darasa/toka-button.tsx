"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, LogOut } from "lucide-react";

import { Button, type ButtonProps } from "@nuru/ui/components/button";
import { flushQueue, releaseLearnerProgress } from "@/lib/progress";

/** Sign the darasa learner out of this device: send pending progress, clear the cookie, restore local state. */
export async function tokaDarasa() {
	await flushQueue().catch(() => {});
	await fetch("/api/darasa/toka", { method: "POST", credentials: "same-origin" }).catch(() => {});
	releaseLearnerProgress();
	window.dispatchEvent(new CustomEvent("nuru:darasa"));
}

export function TokaButton({ label, redirectTo, ...props }: ButtonProps & { label: string; redirectTo?: string }) {
	const router = useRouter();
	const [busy, setBusy] = useState(false);
	return (
		<Button
			variant="outline"
			{...props}
			disabled={busy}
			onClick={async () => {
				setBusy(true);
				await tokaDarasa();
				if (redirectTo) router.push(redirectTo);
				router.refresh();
				setBusy(false);
			}}
		>
			{busy ? <Loader2 className="animate-spin" /> : <LogOut />}
			{label}
		</Button>
	);
}
