"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, Loader2, LockKeyhole, RotateCcw, UserPlus, UserRound } from "lucide-react";

import { Button } from "@nuru/ui/components/button";
import { cn } from "@nuru/ui/lib/utils";
import type { Dictionary } from "@/app/(main)/[lang]/dictionaries";
import { normalizeCode, PICHA_UREFU, type PichaId } from "@/lib/darasa/shared";
import { fmt } from "./fmt";
import { PictureGrid, PichaSlots } from "./picture-grid";

type D = Dictionary["darasa"];
type DarasaInfo = { name: string; code: string; teacherName: string | null };
type Learner = { id: string; displayName: string; needsPictures: boolean };

type Step =
	| { s: "msimbo" }
	| { s: "jina"; darasa: DarasaInfo; wanafunzi: Learner[] }
	| { s: "mpya"; darasa: DarasaInfo; wanafunzi: Learner[] }
	| { s: "chagua"; darasa: DarasaInfo; wanafunzi: Learner[]; name: string; first?: PichaId[] }
	| { s: "ingia"; darasa: DarasaInfo; wanafunzi: Learner[]; learner: Learner };

async function api(path: string, body: unknown) {
	try {
		const res = await fetch(path, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(body),
			credentials: "same-origin",
		});
		const data = await res.json().catch(() => ({}));
		return { ok: res.ok, data };
	} catch {
		return { ok: false, data: { error: "mtandao" } };
	}
}

/** "kjm7" -> "KJM-7" as the learner types. */
function formatTyping(v: string) {
	const raw = v.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 6);
	return raw.length > 3 ? `${raw.slice(0, 3)}-${raw.slice(3)}` : raw;
}

export function JoinFlow({
	dict,
	logtoName,
	initialCode,
}: {
	dict: D;
	/** Display name of a signed-in Logto user; they can join with the code alone. */
	logtoName: string | null;
	initialCode?: string;
}) {
	const t = dict;
	const router = useRouter();
	const [step, setStep] = useState<Step>({ s: "msimbo" });
	const [code, setCode] = useState(formatTyping(initialCode ?? ""));
	const [name, setName] = useState("");
	const [picha, setPicha] = useState<PichaId[]>([]);
	const [busy, setBusy] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [shake, setShake] = useState(0);
	const [lockSec, setLockSec] = useState(0);
	const headingRef = useRef<HTMLHeadingElement>(null);
	const [ready, setReady] = useState(false);
	useEffect(() => setReady(true), []);

	const signedIn = () => {
		window.dispatchEvent(new CustomEvent("nuru:darasa"));
		router.refresh();
	};

	const err = (key: string) => (t.makosa as Record<string, string>)[key] ?? t.makosa.jumla;

	// Move focus to the new heading on every step so screen readers follow along.
	useEffect(() => {
		headingRef.current?.focus();
	}, [step.s]);

	// Lock countdown.
	useEffect(() => {
		if (lockSec <= 0) return;
		const id = setTimeout(() => setLockSec((n) => n - 1), 1000);
		return () => clearTimeout(id);
	}, [lockSec]);

	async function lookUp(e?: React.FormEvent) {
		e?.preventDefault();
		const c = normalizeCode(code);
		if (!c) return setError(err("msimbo_si_sahihi"));
		setBusy(true);
		setError(null);
		const { ok, data } = await api("/api/darasa/tafuta", { code: c });
		setBusy(false);
		if (!ok) return setError(err(data.error));
		setStep({ s: "jina", darasa: data.darasa, wanafunzi: data.wanafunzi });
	}

	// A code in the URL (?msimbo=KJM-7Q4, e.g. from the projector screen) skips typing.
	useEffect(() => {
		if (initialCode && normalizeCode(initialCode)) void lookUp();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	async function joinWithLogto() {
		const c = normalizeCode(code);
		if (!c) return;
		setBusy(true);
		setError(null);
		const { ok, data } = await api("/api/darasa/jiunge", { code: c });
		setBusy(false);
		if (!ok) return setError(err(data.error));
		signedIn();
	}

	function go(next: Step) {
		setError(null);
		setPicha([]);
		setStep(next);
	}

	function wrong(message: string) {
		setError(message);
		setShake((n) => n + 1);
		setPicha([]);
	}

	async function onPicha(next: PichaId[]) {
		setPicha(next);
		if (next.length < PICHA_UREFU) return;

		if (step.s === "chagua") {
			if (!step.first) {
				// First pass: remember them and ask again.
				setTimeout(() => go({ ...step, first: next }), 250);
				return;
			}
			if (step.first.join() !== next.join()) {
				wrong(t.picha.hazilingani);
				setTimeout(() => setStep({ ...step, first: undefined }), 900);
				return;
			}
			setBusy(true);
			const { ok, data } = await api("/api/darasa/jiunge", { code: step.darasa.code, displayName: step.name, picha: next });
			setBusy(false);
			if (!ok) {
				if (data.error === "jina_limechukuliwa") {
					go({ s: "mpya", darasa: step.darasa, wanafunzi: step.wanafunzi });
				}
				return wrong(err(data.error));
			}
			signedIn();
			return;
		}

		if (step.s === "ingia") {
			setBusy(true);
			const { ok, data } = await api("/api/darasa/ingia", { mwanafunziId: step.learner.id, picha: next });
			setBusy(false);
			if (ok) return signedIn();
			if (data.error === "imefungwa") {
				setLockSec(data.sekunde ?? 60);
				const sec = data.sekunde ?? 60;
				const muda = sec < 120 ? fmt(t.picha.mudaSekunde, { n: sec }) : fmt(t.picha.mudaDakika, { n: Math.ceil(sec / 60) });
				return wrong(fmt(t.picha.imefungwa, { muda }));
			}
			if (data.error === "picha_si_sahihi") return wrong(fmt(t.picha.siSahihi, { n: data.zimebaki ?? 0 }));
			return wrong(err(data.error));
		}
	}

	function submitName(e: React.FormEvent) {
		e.preventDefault();
		if (step.s !== "mpya") return;
		const n = name.replace(/\s+/g, " ").trim();
		if (n.length < 2 || n.length > 40) return setError(err("jina_si_sahihi"));
		const clash = step.wanafunzi.some((w) => w.displayName.toLowerCase() === n.toLowerCase());
		if (clash) return setError(err("jina_limechukuliwa"));
		go({ s: "chagua", darasa: step.darasa, wanafunzi: step.wanafunzi, name: n });
	}

	const back = () => {
		if (step.s === "jina") go({ s: "msimbo" });
		else if (step.s !== "msimbo") go({ s: "jina", darasa: step.darasa, wanafunzi: step.wanafunzi });
	};

	const heading = "text-balance font-display text-[1.9rem] leading-[1.05] font-extrabold tracking-[-0.03em] outline-none sm:text-4xl";

	return (
		<div className="mx-auto w-full max-w-md" data-ready={ready || undefined}>
			{step.s !== "msimbo" && (
				<div className="mb-4 flex items-center justify-between gap-3">
					<Button variant="ghost" size="sm" onClick={back} className="-ml-2 h-11 px-3 text-sm">
						<ArrowLeft /> {t.jiunge.nyuma}
					</Button>
					<span className="lebo truncate rounded-sm border-2 border-mstari bg-card px-2 py-1 shadow-kivuli-sm">
						{step.darasa.name} · {step.darasa.code}
					</span>
				</div>
			)}

			<div className="mji p-5 sm:p-7">
				{step.s === "msimbo" && (
					<form onSubmit={lookUp} noValidate>
						<h1 ref={headingRef} tabIndex={-1} className={heading}>
							<span className="alama-jua">{t.jiunge.title}</span>
						</h1>
						<p className="mt-3 text-foreground/80">{t.jiunge.lead}</p>
						<label htmlFor="msimbo" className="lebo mt-6 block">
							{t.jiunge.msimboLabel}
						</label>
						<input
							id="msimbo"
							value={code}
							onChange={(e) => {
								setCode(formatTyping(e.target.value));
								setError(null);
							}}
							autoComplete="off"
							autoCapitalize="characters"
							autoCorrect="off"
							spellCheck={false}
							inputMode="text"
							placeholder="KJM-7Q4"
							aria-invalid={!!error}
							aria-describedby={error ? "darasa-kosa" : undefined}
							className="mt-2 h-16 w-full rounded-md border-2 border-mstari bg-card px-4 text-center font-mono text-3xl font-bold tracking-[0.2em] uppercase shadow-kivuli-sm placeholder:text-foreground/25 focus-visible:ring-3 focus-visible:ring-ring focus-visible:outline-none"
						/>
						<Button type="submit" size="lg" className="mt-5 h-14 w-full text-lg" disabled={busy}>
							{busy ? <Loader2 className="animate-spin" /> : null}
							{t.jiunge.endelea}
							<ArrowRight />
						</Button>
					</form>
				)}

				{step.s === "jina" && (
					<div>
						<h1 ref={headingRef} tabIndex={-1} className={heading}>
							{t.jina.title}
						</h1>
						{step.darasa.teacherName && (
							<p className="mt-2 text-sm text-foreground/70">
								{t.nyumbani.mwalimu}: <strong>{step.darasa.teacherName}</strong>
							</p>
						)}

						{logtoName && (
							<div className="mt-5 rounded-lg border-2 border-mstari bg-karatasi-2 p-4">
								<Button size="lg" className="h-13 w-full text-base" onClick={joinWithLogto} disabled={busy}>
									<UserRound /> {fmt(t.jiunge.kamaLogto, { jina: logtoName })}
								</Button>
								<p className="mt-2 text-sm text-foreground/70">{t.jiunge.kamaLogtoMaelezo}</p>
							</div>
						)}

						<p className="mt-5 text-foreground/80">{step.wanafunzi.length ? t.jina.lead : t.jina.hakunaBado}</p>
						{step.wanafunzi.length > 0 && (
							<ul className="mt-3 grid max-h-[46dvh] grid-cols-2 gap-2.5 overflow-y-auto p-1">
								{step.wanafunzi.map((w) => (
									<li key={w.id}>
										<button
											type="button"
											onClick={() => go({ s: "ingia", darasa: step.darasa, wanafunzi: step.wanafunzi, learner: w })}
											className="bonyeza flex min-h-14 w-full items-center gap-2 rounded-md border-2 border-mstari bg-card px-3 py-2 text-left font-semibold shadow-kivuli-sm"
										>
											<span className="flex size-8 shrink-0 items-center justify-center rounded-full border-2 border-mstari bg-jua font-display text-sm font-extrabold text-wino">
												{w.displayName.slice(0, 1).toUpperCase()}
											</span>
											<span className="min-w-0 break-words">{w.displayName}</span>
										</button>
									</li>
								))}
							</ul>
						)}
						<Button
							variant={step.wanafunzi.length ? "outline" : "default"}
							size="lg"
							className="mt-5 h-14 w-full text-base"
							onClick={() => go({ s: "mpya", darasa: step.darasa, wanafunzi: step.wanafunzi })}
						>
							<UserPlus /> {t.jina.mpya}
						</Button>
					</div>
				)}

				{step.s === "mpya" && (
					<form onSubmit={submitName} noValidate>
						<h1 ref={headingRef} tabIndex={-1} className={heading}>
							{t.jina.mpyaTitle}
						</h1>
						<p className="mt-3 text-foreground/80">{t.jina.mpyaLead}</p>
						<label htmlFor="jina" className="lebo mt-6 block">
							{t.jina.label}
						</label>
						<input
							id="jina"
							value={name}
							onChange={(e) => {
								setName(e.target.value);
								setError(null);
							}}
							maxLength={40}
							autoComplete="off"
							autoCapitalize="words"
							placeholder={t.jina.placeholder}
							aria-invalid={!!error}
							aria-describedby={error ? "darasa-kosa" : undefined}
							className="mt-2 h-14 w-full rounded-md border-2 border-mstari bg-card px-4 text-xl font-semibold shadow-kivuli-sm placeholder:font-normal placeholder:text-foreground/35 focus-visible:ring-3 focus-visible:ring-ring focus-visible:outline-none"
						/>
						<Button type="submit" size="lg" className="mt-5 h-14 w-full text-lg">
							{t.jiunge.endelea} <ArrowRight />
						</Button>
					</form>
				)}

				{(step.s === "chagua" || step.s === "ingia") && (
					<div>
						<h1 ref={headingRef} tabIndex={-1} className={heading}>
							{step.s === "chagua"
								? step.first
									? t.picha.thibitishaTitle
									: t.picha.chaguaTitle
								: step.learner.needsPictures
									? fmt(t.picha.wekaUpyaTitle, { jina: step.learner.displayName })
									: fmt(t.picha.ingiaTitle, { jina: step.learner.displayName })}
						</h1>
						<p className="mt-2 text-foreground/80">
							{step.s === "chagua"
								? step.first
									? t.picha.thibitishaLead
									: t.picha.chaguaLead
								: step.learner.needsPictures
									? t.picha.wekaUpyaLead
									: t.picha.ingiaLead}
						</p>
						<div className="mt-4 flex items-center justify-between gap-3">
							<PichaSlots value={picha} />
							<Button variant="ghost" size="sm" className="h-11" onClick={() => setPicha([])} disabled={!picha.length || busy}>
								<RotateCcw /> {t.picha.futa}
							</Button>
						</div>
						<div className="mt-4">
							<PictureGrid
								value={picha}
								onChange={onPicha}
								label={t.picha.gridLabel}
								disabled={busy || lockSec > 0}
								shakeKey={shake}
							/>
						</div>
						{lockSec > 0 && (
							<p className="lebo mt-4 flex items-center justify-center gap-2 text-pilipili" aria-live="polite">
								<LockKeyhole className="size-4" /> {fmt(t.picha.imefungwa, { n: lockSec })}
							</p>
						)}
					</div>
				)}

				<p
					id="darasa-kosa"
					role="alert"
					className={cn(
						"mt-4 rounded-md border-2 border-mstari bg-pilipili/15 px-3 py-2 text-sm font-semibold",
						(!error || lockSec > 0) && "hidden",
					)}
				>
					{error}
				</p>
			</div>
		</div>
	);
}
