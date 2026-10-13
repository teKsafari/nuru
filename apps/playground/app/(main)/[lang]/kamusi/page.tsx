import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArrowUp, Lightbulb, Play } from "lucide-react";

import { getDictionary, hasLocale, type Dictionary } from "@/app/(main)/[lang]/dictionaries";
import { uwanjaHref } from "@/lib/share";
import { cn } from "@nuru/ui/lib/utils";
import { Inline } from "@/components/tovuti/inline";
import { NuruCode } from "@/components/tovuti/nuru-code";
import { SiteFooter } from "@/components/tovuti/footer";
import { KamusiNav } from "./kamusi-nav";
import { sehemu, type Kipande, type L, type Mfano } from "./mifano";

type Lang = "sw" | "en";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
	const { lang } = await params;
	const dict = await getDictionary(hasLocale(lang) ? lang : "sw");
	return {
		title: dict.tovuti.kamusi.metaTitle,
		description: dict.tovuti.kamusi.metaDescription,
		openGraph: { title: dict.tovuti.kamusi.title, description: dict.tovuti.kamusi.metaDescription },
	};
}

export default async function KamusiPage({ params }: { params: Promise<{ lang: string }> }) {
	const { lang } = await params;
	if (!hasLocale(lang)) notFound();
	const dict = await getDictionary(lang);
	const t = dict.tovuti.kamusi;
	const navItems = sehemu.map((s) => ({ id: s.id, title: s.kichwa[lang] }));

	return (
		<main id="juu" className="flex-1 overflow-x-hidden overflow-y-auto scroll-smooth bg-karatasi motion-reduce:scroll-auto">
			<header className="gridi border-b-2 border-mstari">
				<div className="mx-auto max-w-6xl px-5 pt-10 pb-10 sm:px-8 md:pt-14 md:pb-12">
					<p className="lebo inline-block rounded-sm border-2 border-mstari bg-card px-2.5 py-1 shadow-kivuli-sm">{t.lebo}</p>
					<h1 className="mt-5 font-display text-[clamp(2.5rem,7vw,4.5rem)] leading-[0.95] font-extrabold tracking-[-0.04em]">
						Kamusi ya <span className="alama-jua">Nuru</span>
					</h1>
					<p className="mt-5 max-w-2xl text-lg leading-relaxed text-foreground/80">{t.lead}</p>
				</div>
			</header>

			<div className="sticky top-0 z-20 border-b-2 border-mstari bg-karatasi lg:hidden">
				<KamusiNav items={navItems} label={t.contents} variant="chips" />
			</div>

			<div className="mx-auto grid max-w-6xl gap-10 px-5 py-10 sm:px-8 lg:grid-cols-[13rem_minmax(0,1fr)] lg:gap-14 lg:py-14">
				<aside className="hidden lg:block">
					<div className="sticky top-8">
						<KamusiNav items={navItems} label={t.contents} variant="column" />
					</div>
				</aside>

				<article className="min-w-0">
					{sehemu.map((s, i) => (
						<section key={s.id} id={s.id} className="scroll-mt-20 border-b-2 border-dashed border-mstari/30 pb-12 not-first:pt-12 last:border-0 lg:scroll-mt-8">
							<p className="lebo text-muted-foreground">{String(i + 1).padStart(2, "0")}</p>
							<h2 className="mt-1 font-display text-3xl font-extrabold tracking-[-0.03em] sm:text-4xl">{s.kichwa[lang]}</h2>
							{s.utangulizi && (
								<p className="mt-3 max-w-3xl text-[17px] leading-relaxed text-foreground/85">
									<Inline text={s.utangulizi[lang]} />
								</p>
							)}
							<div className="mt-6 space-y-5">
								{s.vipande.map((k, j) => (
									<KipandeView key={j} k={k} lang={lang} t={t} />
								))}
							</div>
						</section>
					))}
					<a href="#juu" className="lebo mt-4 inline-flex items-center gap-1.5 text-muted-foreground hover:text-foreground">
						<ArrowUp className="size-3.5" aria-hidden />
						{t.top}
					</a>
				</article>
			</div>

			<SiteFooter lang={lang} dict={dict} />
		</main>
	);
}

type KamusiLabels = Dictionary["tovuti"]["kamusi"];

function KipandeView({ k, lang, t }: { k: Kipande; lang: Lang; t: KamusiLabels }) {
	switch (k.aina) {
		case "p":
			return (
				<p className="max-w-3xl leading-relaxed text-foreground/85">
					<Inline text={k.maandishi[lang]} />
				</p>
			);
		case "h3":
			return (
				<h3 id={k.id} className="scroll-mt-20 pt-4 font-display text-xl font-bold tracking-[-0.02em] sm:text-2xl lg:scroll-mt-8">
					<Inline text={k.maandishi[lang]} codeClassName="text-[0.85em]" />
				</h3>
			);
		case "dokezo":
			return (
				<div className="flex max-w-3xl gap-3 rounded-lg border-2 border-mstari bg-tint-jua p-3.5 pr-4">
					<Lightbulb className="mt-0.5 size-5 shrink-0" aria-hidden />
					<p className="leading-relaxed">
						<span className="sr-only">{t.tip}: </span>
						<Inline text={k.maandishi[lang]} />
					</p>
				</div>
			);
		case "jedwali":
			return <Jedwali vichwa={k.vichwa} safu={k.safu} lang={lang} />;
		case "mfano":
			return <MfanoView m={k.mfano} kichwa={k.kichwa} lang={lang} t={t} />;
	}
}

function Jedwali({ vichwa, safu, lang }: { vichwa: L[]; safu: (string | L)[][]; lang: Lang }) {
	const text = (c: string | L | undefined) => (c === undefined ? "" : typeof c === "string" ? c : c[lang]);
	return (
		<div className="overflow-x-auto rounded-lg border-2 border-mstari bg-card">
			<table className="w-full min-w-[34rem] border-collapse text-left text-[14.5px]">
				<thead>
					<tr className="border-b-2 border-mstari bg-karatasi-2">
						{vichwa.map((h) => (
							<th key={h.sw} scope="col" className="lebo px-3.5 py-2.5 text-foreground/80">
								{h[lang]}
							</th>
						))}
					</tr>
				</thead>
				<tbody>
					{safu.map((row, i) => (
						<tr key={i} className="border-b border-mstari/15 last:border-0">
							{vichwa.map((_, j) => (
								<td key={j} className={cn("px-3.5 py-2.5 align-top leading-relaxed", j === 0 && "whitespace-nowrap")}>
									<Inline text={text(row[j])} />
								</td>
							))}
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
}

function MfanoView({ m, kichwa, lang, t }: { m: Mfano; kichwa?: L; lang: Lang; t: KamusiLabels }) {
	const output = m.matokeo;
	const isError = (line: string) => line.startsWith("Kosa") || line.startsWith("Kuna makosa") || line.startsWith("\t");
	return (
		<figure className="kadi overflow-hidden shadow-kivuli-sm">
			<div className="flex items-center justify-between gap-3 border-b-2 border-mstari bg-karatasi-2 py-1.5 pr-1.5 pl-3.5">
				<figcaption className="lebo truncate text-foreground/75">{kichwa ? kichwa[lang] : "Mfano"}</figcaption>
				<a
					href={uwanjaHref(lang, m.code, m.mode)}
					aria-label={`${t.try}: ${t.tryLabel}`}
					className="flex h-8 shrink-0 items-center gap-1.5 rounded-md border-2 border-mstari bg-card px-3 text-sm font-bold shadow-kivuli-sm transition-[transform,box-shadow] duration-100 hover:-translate-x-px hover:-translate-y-px hover:shadow-kivuli active:translate-x-0.5 active:translate-y-0.5 active:shadow-none"
				>
					<Play className="size-3.5 fill-current" aria-hidden />
					{t.try}
				</a>
			</div>
			<div className="bg-[var(--editor-bg)] px-4 py-3.5">
				<NuruCode code={m.code} />
			</div>
			<div className="border-t-2 border-mstari bg-[var(--terminal-bg)] px-4 py-3 text-[var(--terminal-fg)]">
				<p className="lebo mb-1 text-[var(--terminal-fg)]/50">
					{m.muundo ? t.sampleOutput : t.output}
					{m.ingizo && (
						<span className="ml-2 normal-case">
							· {t.input}: <span className="text-jua">{m.ingizo.join(", ")}</span>
						</span>
					)}
				</p>
				{output ? (
					<pre className="overflow-x-auto font-mono [font-variant-ligatures:none] text-[13px] leading-6 whitespace-pre sm:text-sm">
						{output.split("\n").map((line, i) => (
							<div key={i} className={cn(isError(line) && "text-[#ff6f63]")}>
								{line.replace(/^\t/, "    ") || " "}
							</div>
						))}
					</pre>
				) : (
					<p className="font-mono text-[13px] text-[var(--terminal-fg)]/60 sm:text-sm">
						{t.noOutput}. {m.mode === "ubao" ? t.drawsOnBoard : t.drawsOnCanvas}.
					</p>
				)}
				{output && m.mode && (
					<p className="mt-1 font-mono text-[12px] text-[var(--terminal-fg)]/50">{m.mode === "ubao" ? t.drawsOnBoard : t.drawsOnCanvas}.</p>
				)}
			</div>
		</figure>
	);
}
