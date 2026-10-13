"use client";

import { useEffect, useState, useTransition } from "react";
import { KeyRound, Lock, UserRound, UserX } from "lucide-react";

import { Button } from "@nuru/ui/components/button";
import { cn } from "@nuru/ui/lib/utils";
import { removeMwanafunzi, resetMwanafunziPicha, type GridLearner } from "@/app/actions/madarasa";
import type { Lang } from "@/lib/dict";
import type { MadarasaStrings } from "./strings";

/** Two-step button: first press arms, second within 4s runs. */
function ArmedButton({
	icon,
	label,
	confirmLabel,
	action,
	danger,
}: {
	icon: React.ReactNode;
	label: string;
	confirmLabel: string;
	action: () => Promise<unknown>;
	danger?: boolean;
}) {
	const [armed, setArmed] = useState(false);
	const [pending, start] = useTransition();
	useEffect(() => {
		if (!armed) return;
		const id = setTimeout(() => setArmed(false), 4000);
		return () => clearTimeout(id);
	}, [armed]);
	return (
		<Button
			type="button"
			size="sm"
			variant={armed ? (danger ? "destructive" : "default") : "outline"}
			disabled={pending}
			className="h-10 px-3"
			onClick={() => {
				if (!armed) return setArmed(true);
				start(async () => {
					await action();
					setArmed(false);
				});
			}}
		>
			{icon}
			{armed ? confirmLabel : label}
		</Button>
	);
}

function ago(iso: string | null, lang: Lang, never: string) {
	if (!iso) return never;
	const sec = Math.round((Date.now() - new Date(iso).getTime()) / 1000);
	const rtf = new Intl.RelativeTimeFormat(lang === "en" ? "en" : "sw", { numeric: "auto" });
	if (sec < 60) return rtf.format(-sec, "second");
	if (sec < 3600) return rtf.format(-Math.round(sec / 60), "minute");
	if (sec < 86400) return rtf.format(-Math.round(sec / 3600), "hour");
	return rtf.format(-Math.round(sec / 86400), "day");
}

export function LearnersList({
	learners,
	s,
	lang,
	onChanged,
}: {
	learners: GridLearner[];
	s: MadarasaStrings;
	lang: Lang;
	onChanged: () => void;
}) {
	return (
		<ul className="divide-y-2 divide-mstari/15 overflow-hidden rounded-lg border-2 border-mstari bg-card">
			{learners.map((w) => (
				<li key={w.id} className="flex flex-wrap items-center gap-3 px-4 py-3">
					<span className="flex size-10 shrink-0 items-center justify-center rounded-full border-2 border-mstari bg-jua font-display font-extrabold text-[#15120f]">
						{w.displayName.slice(0, 1).toUpperCase()}
					</span>
					<div className="min-w-0 flex-1">
						<p className="truncate font-semibold">{w.displayName}</p>
						<p className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted-foreground">
							<span suppressHydrationWarning>
								{s.lastSeen}: {ago(w.lastSeenAt, lang, s.never)}
							</span>
							{w.viaLogto && (
								<span className="lebo inline-flex items-center gap-1 rounded-sm border-2 border-mstari bg-bahari px-1 text-white">
									<UserRound className="size-3" aria-hidden /> {s.viaAccount}
								</span>
							)}
							{w.needsPictures && (
								<span className="lebo rounded-sm border-2 border-mstari bg-chungwa px-1 text-[#15120f]">{s.resetDone}</span>
							)}
							{w.lockedUntil && (
								<span className="lebo inline-flex items-center gap-1 rounded-sm border-2 border-mstari bg-pilipili px-1 text-[#15120f]">
									<Lock className="size-3" aria-hidden /> {s.locked}
								</span>
							)}
						</p>
					</div>
					<div className={cn("flex shrink-0 gap-2", "max-sm:w-full max-sm:justify-end")}>
						{!w.viaLogto && (
							<ArmedButton
								icon={<KeyRound />}
								label={s.resetPicha}
								confirmLabel={s.resetPichaConfirm}
								action={async () => {
									await resetMwanafunziPicha(w.id);
									onChanged();
								}}
							/>
						)}
						<ArmedButton
							danger
							icon={<UserX />}
							label={s.remove}
							confirmLabel={s.removeConfirm}
							action={async () => {
								await removeMwanafunzi(w.id);
								onChanged();
							}}
						/>
					</div>
				</li>
			))}
		</ul>
	);
}

export { ArmedButton };
