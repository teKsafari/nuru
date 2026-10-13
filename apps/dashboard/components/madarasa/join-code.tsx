"use client";

import { useEffect, useRef, useState } from "react";
import { Check, Copy, Maximize2, RefreshCw, X } from "lucide-react";

import { Button } from "@nuru/ui/components/button";
import { newDarasaCode } from "@/app/actions/madarasa";
import { playgroundUrl, type MadarasaStrings } from "./strings";

/**
 * The join code, big enough to read from the back row, and a projector mode that
 * fills the screen with it (Esc or the close button exits).
 */
export function JoinCode({ darasaId, code, name, s, archived }: { darasaId: string; code: string; name: string; s: MadarasaStrings; archived: boolean }) {
	const [projector, setProjector] = useState(false);
	const [copied, setCopied] = useState(false);
	const [confirmNew, setConfirmNew] = useState(false);
	const [busy, setBusy] = useState(false);
	const overlayRef = useRef<HTMLDivElement>(null);
	const base = playgroundUrl();
	const host = base.replace(/^https?:\/\//, "");
	const joinUrl = `${base}/sw/darasa?msimbo=${code}`;

	useEffect(() => {
		if (!projector) return;
		const el = overlayRef.current;
		el?.requestFullscreen?.().catch(() => {});
		const onKey = (e: KeyboardEvent) => e.key === "Escape" && setProjector(false);
		const onFs = () => !document.fullscreenElement && setProjector(false);
		window.addEventListener("keydown", onKey);
		document.addEventListener("fullscreenchange", onFs);
		return () => {
			window.removeEventListener("keydown", onKey);
			document.removeEventListener("fullscreenchange", onFs);
			if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
		};
	}, [projector]);

	return (
		<section aria-label={s.code} className="mji flex flex-col overflow-hidden">
			<div className="flex items-center justify-between gap-3 border-b-2 border-mstari bg-jua px-5 py-2.5 text-[#15120f]">
				<h2 className="lebo">{s.code}</h2>
				<span className="lebo hidden truncate sm:inline">
					{s.codeHint} {host}/sw/darasa
				</span>
			</div>
			<div className="flex flex-1 flex-col items-center justify-center gap-5 px-5 py-8">
				<p
					className="font-mono text-[clamp(3rem,9vw,6.5rem)] leading-none font-extrabold tracking-[0.12em] select-all"
					aria-label={code.split("").join(" ")}
				>
					{code}
				</p>
				<p className="lebo -mt-2 text-center text-muted-foreground sm:hidden">
					{s.codeHint} {host}/sw/darasa
				</p>
				<div className="flex flex-wrap items-center justify-center gap-2">
					<Button size="lg" onClick={() => setProjector(true)} disabled={archived}>
						<Maximize2 /> {s.projector}
					</Button>
					<Button
						variant="outline"
						size="lg"
						onClick={async () => {
							try {
								await navigator.clipboard.writeText(joinUrl);
								setCopied(true);
								setTimeout(() => setCopied(false), 1800);
							} catch {}
						}}
					>
						{copied ? <Check /> : <Copy />} {copied ? s.copied : s.copy}
					</Button>
					{confirmNew ? (
						<Button
							variant="destructive"
							size="lg"
							disabled={busy}
							onClick={async () => {
								setBusy(true);
								await newDarasaCode(darasaId).catch(() => {});
								setBusy(false);
								setConfirmNew(false);
							}}
							title={s.newCodeConfirm}
						>
							<RefreshCw className={busy ? "animate-spin" : undefined} /> {s.newCodeConfirm}
						</Button>
					) : (
						<Button variant="ghost" size="lg" onClick={() => setConfirmNew(true)}>
							<RefreshCw /> {s.newCode}
						</Button>
					)}
				</div>
			</div>

			{projector && (
				<div
					ref={overlayRef}
					role="dialog"
					aria-modal="true"
					aria-label={s.projector}
					className="fixed inset-0 z-[100] flex flex-col bg-jua text-[#15120f]"
				>
					<div className="pindo text-[#15120f]" aria-hidden />
					<div className="flex items-center justify-between gap-4 px-8 pt-6">
						<p className="font-display text-[clamp(1.5rem,3vw,2.75rem)] font-extrabold tracking-tight">{name}</p>
						<button
							type="button"
							onClick={() => setProjector(false)}
							className="inline-flex h-12 items-center gap-2 rounded-md border-2 border-[#15120f] bg-[#fffdf6] px-4 font-semibold shadow-[3px_3px_0_0_#15120f]"
						>
							<X className="size-5" /> {s.projectorClose}
						</button>
					</div>
					<div className="flex flex-1 flex-col items-center justify-center gap-[4vh] px-8 text-center">
						<p className="text-[clamp(1.25rem,2.6vw,2.5rem)] font-semibold">
							<span className="mr-3 inline-flex size-[1.6em] items-center justify-center rounded-full border-[3px] border-[#15120f] bg-[#fffdf6] font-display font-extrabold">
								1
							</span>
							{s.projectorStep1} <strong className="font-mono">{host}/sw/darasa</strong>
						</p>
						<p className="text-[clamp(1.25rem,2.6vw,2.5rem)] font-semibold">
							<span className="mr-3 inline-flex size-[1.6em] items-center justify-center rounded-full border-[3px] border-[#15120f] bg-[#fffdf6] font-display font-extrabold">
								2
							</span>
							{s.projectorStep2}
						</p>
						<p className="rounded-2xl border-[5px] border-[#15120f] bg-[#fffdf6] px-[5vw] py-[3vh] font-mono text-[clamp(4rem,17vw,16rem)] leading-none font-extrabold tracking-[0.1em] shadow-[12px_12px_0_0_#15120f]">
							{code}
						</p>
						<p className="text-[clamp(1.25rem,2.6vw,2.5rem)] font-semibold">
							<span className="mr-3 inline-flex size-[1.6em] items-center justify-center rounded-full border-[3px] border-[#15120f] bg-[#fffdf6] font-display font-extrabold">
								3
							</span>
							{s.projectorStep3}
						</p>
					</div>
					<div className="pindo text-[#15120f]" aria-hidden />
				</div>
			)}
		</section>
	);
}
