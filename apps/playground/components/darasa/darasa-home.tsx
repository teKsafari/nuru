"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, Check, RotateCcw, School, Smartphone } from "lucide-react";

import { cn } from "@nuru/ui/lib/utils";
import type { Dictionary } from "@/app/(main)/[lang]/dictionaries";
import type { MimiResponse } from "@/lib/darasa/shared";
import { adoptServerProgress, readLocalProgress } from "@/lib/progress";
import { fmt } from "./fmt";
import { TokaButton } from "./toka-button";

type Lang = "sw" | "en";

export function DarasaHome({ data, dict, lang }: { data: MimiResponse; dict: Dictionary["darasa"]; lang: Lang }) {
	const t = dict.nyumbani;
	const me = data.mwanafunzi!;
	const darasa = data.darasa!;

	const serverPassed = useMemo(() => new Set(data.maendeleo.filter((m) => m.passed).map((m) => m.lessonId)), [data.maendeleo]);
	const attempted = useMemo(() => new Set(data.maendeleo.map((m) => m.lessonId)), [data.maendeleo]);
	const [passed, setPassed] = useState(serverPassed);

	// Bring this device's localStorage in line with the learner, then show the union.
	useEffect(() => {
		if (!me.viaLogto) adoptServerProgress(me.id, data.maendeleo);
		const read = () => {
			const s = new Set(serverPassed);
			for (const m of data.moduli) for (const id of readLocalProgress(m.id).completedLessonIds) s.add(id);
			setPassed(s);
		};
		read();
		window.addEventListener("nuru:progress", read);
		return () => window.removeEventListener("nuru:progress", read);
	}, [me.id, me.viaLogto, data.maendeleo, data.moduli, serverPassed]);

	const total = data.moduli.reduce((n, m) => n + m.lessons.length, 0);
	const done = data.moduli.reduce((n, m) => n + m.lessons.filter((l) => passed.has(l.id)).length, 0);
	const pct = total ? Math.round((done / total) * 100) : 0;

	return (
		<main className="flex-1 overflow-x-hidden overflow-y-auto bg-karatasi">
			<header className="gridi border-b-2 border-mstari">
				<div className="mx-auto flex max-w-5xl flex-col gap-5 px-4 pt-7 pb-8 sm:px-8 md:flex-row md:items-end md:justify-between md:pt-12 md:pb-10">
					<div className="min-w-0">
						<p className="flex flex-wrap items-center gap-2">
							<span className="lebo inline-flex items-center gap-1.5 rounded-sm border-2 border-mstari bg-card px-2.5 py-1 shadow-kivuli-sm">
								<School className="size-3.5" aria-hidden /> {dict.lebo}
							</span>
							<span className="lebo rounded-sm border-2 border-mstari bg-card px-2.5 py-1">
								{t.msimbo} {darasa.code}
							</span>
						</p>
						<h1 className="mt-4 font-display text-[clamp(2.2rem,8vw,4rem)] leading-[0.95] font-extrabold tracking-[-0.04em] break-words">
							<span className="alama-jua">{darasa.name}</span>
						</h1>
						{darasa.teacherName && (
							<p className="mt-3 text-lg text-foreground/80">
								{t.mwalimu}: <strong className="font-semibold text-foreground">{darasa.teacherName}</strong>
							</p>
						)}
					</div>

					<div className="mji flex items-center gap-3 p-3 md:min-w-72">
						<span className="flex size-12 shrink-0 items-center justify-center rounded-full border-2 border-mstari bg-jua font-display text-xl font-extrabold text-wino">
							{me.displayName.slice(0, 1).toUpperCase()}
						</span>
						<div className="min-w-0 flex-1">
							<p className="truncate font-display text-lg leading-tight font-bold">{me.displayName}</p>
							<p className="lebo text-muted-foreground">{fmt(t.kamilika, { n: done, jumla: total })}</p>
						</div>
						{!me.viaLogto && <TokaButton label={t.toka} makosa={{ mtandao: t.tokaMtandao, foleni: t.tokaFoleni }} className="h-11 shrink-0" />}
					</div>
				</div>
			</header>
			<div className="pindo text-jua" aria-hidden />

			<div className="mx-auto max-w-5xl px-4 py-8 sm:px-8 md:py-12">
				<section aria-labelledby="jumla-yako" className="mji mb-8 p-5 sm:p-6">
					<div className="flex flex-wrap items-end justify-between gap-3">
						<h2 id="jumla-yako" className="lebo">
							{t.jumlaYako}
						</h2>
						<p className="font-display text-4xl leading-none font-extrabold tracking-tight">
							{pct}
							<span className="text-xl">%</span>
						</p>
					</div>
					<ProgressBar value={done} max={total} className="mt-3 h-5" />
					<p className="mt-3 text-sm text-foreground/75">
						{fmt(t.kamilika, { n: done, jumla: total })}
						{done > 0 ? <span className="mt-1 block italic">{t.hongera}</span> : null}
					</p>
				</section>

				<h2 className="mb-4 font-display text-2xl font-extrabold tracking-tight">{t.moduli}</h2>
				{data.moduli.length === 0 ? (
					<p className="gridi rounded-lg border-2 border-dashed border-mstari p-8 text-center text-foreground/75">{t.hakuna}</p>
				) : (
					<ol className="grid gap-5 md:grid-cols-2">
						{data.moduli.map((m, i) => {
							const n = m.lessons.filter((l) => passed.has(l.id)).length;
							const next = m.lessons.find((l) => !passed.has(l.id));
							const complete = m.lessons.length > 0 && !next;
							const target = next ?? m.lessons[0];
							const href = target ? `/${lang}/anza/${m.slug}/${target.slug}` : `/${lang}/anza/${m.slug}`;
							return (
								<li key={m.id} className="mji flex min-w-0 flex-col p-5">
									<div className="flex items-start gap-3">
										<span
											className={cn(
												"flex size-10 shrink-0 items-center justify-center rounded-md border-2 border-mstari font-display text-lg font-extrabold",
												complete ? "bg-mwani text-white" : "bg-karatasi-2",
											)}
										>
											{complete ? <Check className="size-5" aria-hidden /> : i + 1}
										</span>
										<div className="min-w-0 flex-1">
											<h3 className="font-display text-xl leading-tight font-bold">{m.title[lang] || m.title.sw}</h3>
											<p className="lebo mt-1 text-muted-foreground">{fmt(t.kamilika, { n, jumla: m.lessons.length })}</p>
										</div>
									</div>
									<ProgressBar value={n} max={m.lessons.length} className="mt-4 h-3" />
									<ol className="mt-4 flex flex-wrap gap-1.5" aria-label={m.title[lang] || m.title.sw}>
										{m.lessons.map((l, j) => (
											<li key={l.id}>
												<Link
													href={`/${lang}/anza/${m.slug}/${l.slug}`}
													title={l.title[lang] || l.title.sw}
													aria-label={`${j + 1}. ${l.title[lang] || l.title.sw}${passed.has(l.id) ? ` (${t.imekamilika})` : ""}`}
													className={cn(
														"flex size-9 items-center justify-center rounded-full border-2 border-mstari font-mono text-xs font-bold transition-transform hover:-translate-y-px",
														passed.has(l.id)
															? "bg-mwani text-white"
															: attempted.has(l.id)
																? "bg-chungwa/60 text-wino"
																: "bg-card text-foreground/70",
														l.id === next?.id && "ring-3 ring-jua ring-offset-1 ring-offset-card",
													)}
												>
													{passed.has(l.id) ? <Check className="size-4" aria-hidden /> : j + 1}
												</Link>
											</li>
										))}
									</ol>
									<div className="mt-5 flex flex-1 items-end">
										<Link
											href={href}
											className={cn(
												"inline-flex h-12 w-full min-w-0 items-center justify-center gap-2 rounded-md border-2 border-mstari px-5 font-semibold shadow-kivuli-sm transition-[transform,box-shadow] duration-100 hover:-translate-x-px hover:-translate-y-px hover:shadow-kivuli active:translate-x-0.5 active:translate-y-0.5 active:shadow-none",
												complete ? "bg-card" : "bg-jua text-wino",
											)}
										>
											{complete ? <RotateCcw className="size-4" aria-hidden /> : null}
											{complete ? t.rudia : n > 0 ? t.endelea : t.anza}
											{!complete && next ? <span className="min-w-0 truncate font-normal">· {next.title[lang] || next.title.sw}</span> : null}
											{!complete ? <ArrowRight className="size-4 shrink-0" aria-hidden /> : null}
										</Link>
									</div>
								</li>
							);
						})}
					</ol>
				)}

				{!me.viaLogto && (
					<aside className="mt-10 flex flex-col items-start gap-4 rounded-lg border-2 border-dashed border-mstari p-5 sm:flex-row sm:items-center">
						<Smartphone className="size-8 shrink-0" aria-hidden />
						<p className="flex-1 text-foreground/80">{t.tokaMaelezo}</p>
						<TokaButton label={t.toka} makosa={{ mtandao: t.tokaMtandao, foleni: t.tokaFoleni }} className="h-12 px-6" />
					</aside>
				)}
			</div>
		</main>
	);
}

function ProgressBar({ value, max, className }: { value: number; max: number; className?: string }) {
	const pct = max ? (value / max) * 100 : 0;
	return (
		<div
			role="progressbar"
			aria-valuemin={0}
			aria-valuemax={max}
			aria-valuenow={value}
			className={cn("w-full overflow-hidden rounded-full border-2 border-mstari bg-karatasi-2", className)}
		>
			<div className="h-full border-r-2 border-mstari bg-mwani transition-[width] duration-300" style={{ width: `${pct}%`, borderRightWidth: pct > 0 && pct < 100 ? 2 : 0 }} />
		</div>
	);
}
