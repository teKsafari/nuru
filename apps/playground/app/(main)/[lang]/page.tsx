import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowRight, Check, Feather, Lightbulb, Send, Turtle, UsersRound } from "lucide-react";

import { hasLocale, getDictionary } from "@/app/(main)/[lang]/dictionaries";
import contributors from "@/public/contributors.json";
import { Button } from "@nuru/ui/components/button";
import { cn } from "@nuru/ui/lib/utils";
import { uwanjaHref } from "@/lib/share";
import { CodeCard } from "@/components/tovuti/code-card";
import { heroPrograms } from "@/components/tovuti/hero-programs";
import { Inline } from "@/components/tovuti/inline";
import { NuruCode } from "@/components/tovuti/nuru-code";
import { GITHUB_URL, SiteFooter, TELEGRAM_URL, dashboardUrl } from "@/components/tovuti/footer";

const ANDIKA_CODE = `fanya umri = 15\n\nkama (umri >= 13) {\n    andika("Karibu Nuru!")\n}`;
const KOBE_CODE = `tumia kobe\n\nkobe.rangi("nyekundu")\nkobe.rangi_ya_ndani("njano")\nkobe.nenda(-100, 30)\nkobe.anza_kujaza()\nkwa i ktk mfululizo(5) {\n    kobe.mbele(200)\n    kobe.kulia(144)\n}\nkobe.maliza_kujaza()`;
const UBAO_CODE = `tumia ubao\n\nubao.skrini("Habari Dunia")\nkwa i ktk mfululizo(1, 9) {\n    ubao.washa(i)\n    ubao.subiri(150)\n}\nubao.kengele(880, 300)`;

// Learners on the walimu progress grid: 2 = finished, 1 = trying, 0 = not yet.
const GRID: [string, number[]][] = [
	["Amani", [2, 2, 2, 2, 2, 1, 0, 0]],
	["Neema", [2, 2, 2, 2, 2, 2, 2, 1]],
	["Baraka", [2, 2, 1, 0, 0, 0, 0, 0]],
	["Zawadi", [2, 2, 2, 2, 1, 0, 0, 0]],
	["Juma", [2, 2, 2, 2, 2, 2, 1, 0]],
	["Rehema", [2, 1, 0, 0, 0, 0, 0, 0]],
];

export default async function Home({ params }: { params: Promise<{ lang: string }> }) {
	const { lang } = await params;
	if (!hasLocale(lang)) notFound();

	const dict = await getDictionary(lang);
	const t = dict.tovuti.landing;
	const featureIcons = [Feather, Turtle, Lightbulb];
	const featureHrefs = [`/${lang}/anza`, uwanjaHref(lang, KOBE_CODE, "kobe"), uwanjaHref(lang, UBAO_CODE, "ubao")];
	const featureFills = ["bg-jua text-wino", "bg-mwani text-white", "bg-zambarau text-wino"];

	return (
		<main className="flex-1 overflow-x-hidden overflow-y-auto bg-karatasi">
			{/* Hero */}
			<section className="gridi relative border-b-2 border-mstari">
				<div className="mx-auto grid max-w-6xl items-center gap-12 px-5 pt-12 pb-16 sm:px-8 md:pt-16 grid-cols-[minmax(0,1fr)] lg:grid-cols-[minmax(0,1.08fr)_minmax(0,0.92fr)] lg:gap-14 lg:pt-20 lg:pb-24">
					<div>
						<p className="lebo inline-flex items-center gap-2 rounded-sm border-2 border-mstari bg-card px-2.5 py-1 shadow-kivuli-sm">
							<span className="size-2 rounded-full bg-mwani" aria-hidden />
							{t.eyebrow}
						</p>
						<h1 className="mt-6 font-display text-[clamp(2.6rem,8vw,5.4rem)] leading-[0.95] font-extrabold tracking-[-0.045em] text-balance">
							{t.titleBefore} <span className="alama-jua">{t.titleHighlight}</span>
						</h1>
						<p className="mt-6 max-w-xl text-lg leading-relaxed text-foreground/85 sm:text-xl">
							<Inline text={t.lead} />
						</p>
						<p className="mt-3 font-display text-lg font-bold">{t.reach}</p>
						<div className="mt-8 flex flex-col gap-3 sm:flex-row">
							<Button asChild size="lg" className="text-base">
								<Link href={`/${lang}/anza`}>
									{t.ctaStart}
									<ArrowRight aria-hidden />
								</Link>
							</Button>
							<Button asChild size="lg" variant="outline" className="text-base">
								<Link href={`/${lang}/uwanja`}>{t.ctaUwanja}</Link>
							</Button>
						</div>
						<ul className="mt-8 flex flex-wrap gap-x-5 gap-y-2 text-sm font-medium text-foreground/75">
							{t.facts.map((fact) => (
								<li key={fact} className="flex items-center gap-1.5">
									<Check className="size-4 text-mwani" aria-hidden />
									{fact}
								</li>
							))}
						</ul>
					</div>

					<div className="relative mx-auto w-full max-w-[34rem] lg:mx-0">
						<div className="relative lg:rotate-[1.2deg]">
							<CodeCard programs={heroPrograms} labels={t.card} />
						</div>
					</div>
				</div>
			</section>


			{/* Three features */}
			<section className="relative bg-karatasi-2">
				<div className="mx-auto max-w-6xl px-5 py-16 sm:px-8 md:py-24">
					<p className="lebo text-muted-foreground">{t.vipengele.lebo}</p>
					<h2 className="mt-2 max-w-2xl font-display text-4xl leading-[1.02] font-extrabold sm:text-5xl">{t.vipengele.title}</h2>
					<div className="mt-10 grid grid-cols-[minmax(0,1fr)] gap-6 md:grid-cols-3">
						{t.vipengele.items.map((item, i) => {
							const Icon = featureIcons[i];
							return (
								<Link key={item.title} href={featureHrefs[i]} className="kadi bonyeza group flex flex-col overflow-hidden">
									<div className="flex flex-1 flex-col p-5 pt-4">
										<div className="flex items-center gap-3">
											<span className={cn("flex size-11 items-center justify-center rounded-md border-2 border-mstari", featureFills[i])}>
												<Icon className="size-5" aria-hidden />
											</span>
											<h3 className="font-display text-2xl leading-tight font-extrabold">{item.title}</h3>
										</div>
										<p className="mt-3 text-[15px] leading-relaxed text-foreground/80">
											<Inline text={item.body} />
										</p>
										<div className="mt-5 flex-1">{i === 0 ? <AndikaVisual /> : i === 1 ? <KobeVisual /> : <UbaoVisual />}</div>
										<span className="mt-5 inline-flex items-center gap-1.5 text-sm font-bold underline decoration-2 underline-offset-4 decoration-current/30 group-hover:decoration-current">
											{item.cta}
											<ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
										</span>
									</div>
								</Link>
							);
						})}
					</div>
				</div>
			</section>

			{/* Kwa Walimu */}
			<section className="border-y-2 border-mstari bg-karatasi">
				<div className="mx-auto grid max-w-6xl items-center gap-12 px-5 py-16 sm:px-8 md:py-24 grid-cols-[minmax(0,1fr)] lg:grid-cols-2">
					<div>
						<p className="lebo inline-flex items-center gap-2 text-bahari">
							<UsersRound className="size-4" aria-hidden />
							{t.walimu.lebo}
						</p>
						<h2 className="mt-2 font-display text-4xl leading-[1.02] font-extrabold sm:text-5xl">{t.walimu.title}</h2>
						<p className="mt-4 max-w-lg text-lg leading-relaxed text-foreground/80">{t.walimu.body}</p>
						<ol className="mt-8 space-y-4">
							{t.walimu.steps.map((step, i) => (
								<li key={step.title} className="flex gap-4">
									<span className="flex size-10 shrink-0 items-center justify-center rounded-full border-2 border-mstari bg-bahari font-display text-lg font-extrabold text-white">
										{i + 1}
									</span>
									<div>
										<p className="font-display text-lg font-bold">{step.title}</p>
										<p className="text-foreground/75">{step.body}</p>
									</div>
								</li>
							))}
						</ol>
						<div className="mt-8 flex flex-col gap-3 sm:flex-row">
							<Button asChild size="lg" variant="ink">
								<a href={`${dashboardUrl()}/educator/madarasa`}>
									{t.walimu.cta}
									<ArrowRight aria-hidden />
								</a>
							</Button>
							<Button asChild size="lg" variant="outline">
								<Link href={`/${lang}/darasa`}>{t.walimu.learner}</Link>
							</Button>
						</div>
					</div>
					<ProgressGrid t={t.walimu} />
				</div>
			</section>

			{/* Closing call to action */}
			<section className="bg-jua text-wino">
				<div className="mx-auto max-w-4xl px-5 py-14 text-center sm:px-8 md:py-20">
					<p className="lebo">{t.mwisho.lebo}</p>
					<blockquote className="mt-4 font-display text-[clamp(2rem,5.5vw,3.75rem)] leading-[1.02] font-extrabold tracking-[-0.03em] text-balance">
						<p>{t.mwisho.text}</p>
					</blockquote>
					<p className="mx-auto mt-5 max-w-xl text-lg font-medium text-wino/80">{t.mwisho.meaning}</p>
					<Button asChild size="lg" variant="ink" className="mt-8">
						<Link href={`/${lang}/anza`}>
							{t.ctaStart}
							<ArrowRight aria-hidden />
						</Link>
					</Button>
				</div>
			</section>

			{/* Contributors */}
			<section id="wachangiaji" className="scroll-mt-4 bg-karatasi">
				<div className="mx-auto max-w-6xl px-5 py-16 sm:px-8 md:py-24">
					<div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
						<div>
							<p className="lebo text-muted-foreground">{t.contributors.lebo}</p>
							<h2 className="mt-2 font-display text-4xl leading-[1.02] font-extrabold sm:text-5xl">{t.contributors.title}</h2>
							<p className="mt-3 max-w-xl text-lg text-foreground/80">{t.contributors.body}</p>
						</div>
						<div className="flex flex-wrap gap-3">
							<Button asChild variant="outline">
								<a href={TELEGRAM_URL} target="_blank" rel="noopener noreferrer">
									<Send aria-hidden />
									{t.contributors.join}
								</a>
							</Button>
							<Button asChild variant="ghost">
								<a href={`${GITHUB_URL}/graphs/contributors`} target="_blank" rel="noopener noreferrer">
									{t.contributors.all}
									<ArrowRight aria-hidden />
								</a>
							</Button>
						</div>
					</div>
					<ul className="mt-10 flex flex-wrap gap-2.5">
						{contributors.map((c) => (
							<li key={c.username}>
								<a
									href={c.profile_url}
									target="_blank"
									rel="noopener noreferrer"
									title={c.username}
									className="block size-12 overflow-hidden rounded-md border-2 border-mstari bg-karatasi-2 shadow-kivuli-sm transition-transform duration-100 hover:-translate-x-px hover:-translate-y-px"
								>
									{/* eslint-disable-next-line @next/next/no-img-element */}
									<img src={`${c.profile_picture}${c.profile_picture.includes("?") ? "&" : "?"}s=96`} alt={c.username} width={48} height={48} loading="lazy" decoding="async" className="size-full object-cover" />
								</a>
							</li>
						))}
					</ul>
				</div>
			</section>

			<SiteFooter lang={lang} dict={dict} />
		</main>
	);
}

function AndikaVisual() {
	return (
		<div className="rounded-md border-2 border-mstari bg-[var(--editor-bg)] px-3 py-2.5">
			<NuruCode code={ANDIKA_CODE} className="text-[12.5px] leading-5 sm:text-[13px]" />
			<p className="mt-2 border-t-2 border-dashed border-mstari/25 pt-1.5 font-mono text-[12.5px] text-mwani">› Karibu Nuru!</p>
		</div>
	);
}

function KobeVisual() {
	// The filled star from the kobe example: forward 200, right 144, five times.
	const pts = "-100,-30 100,-30 -61.8,87.6 0,-102.6 61.8,87.6";
	return (
		<div className="gridi relative aspect-[4/3] overflow-hidden rounded-md border-2 border-mstari bg-[#fffdf6]">
			<svg viewBox="-130 -120 260 230" className="size-full" aria-hidden>
				<polygon points={pts} fill="#ffd43b" stroke="#e63b2e" strokeWidth="3" strokeLinejoin="round" fillRule="nonzero" />
				<g transform="translate(-100 -30) rotate(0)">
					<path d="M0 -9 L16 0 L0 9 Z" fill="#22a565" stroke="#15120f" strokeWidth="2" strokeLinejoin="round" />
				</g>
			</svg>
			<span className="lebo absolute right-2 bottom-1.5 text-[#6b6257]">600 × 600</span>
		</div>
	);
}

function UbaoVisual() {
	const leds = ["#e63b2e", "#fd7e14", "#ffd43b", "#2f9e44", "#1c6dd0", "#7048e8", null, null];
	return (
		<div className="rounded-md border-2 border-mstari bg-[#1f3b2d] p-3">
			<div className="rounded-sm border-2 border-[#15120f] bg-[#9bc53d] px-2 py-1.5 font-mono text-[13px] leading-5 font-bold tracking-wider text-[#15120f]">
				<div>Habari Dunia</div>
				<div className="opacity-40">________________</div>
			</div>
			<div className="mt-3 grid grid-cols-8 gap-1.5">
				{leds.map((c, i) => (
					<div key={i} className="flex flex-col items-center gap-1">
						<span
							className="aspect-square w-full max-w-6 rounded-full border-2 border-[#15120f]"
							style={{ background: c ?? "#2d4a3b", boxShadow: c ? `0 0 0 3px ${c}40` : undefined }}
						/>
						<span className="font-mono text-[10px] text-[#fff3d6]/70">{i + 1}</span>
					</div>
				))}
			</div>
		</div>
	);
}

function ProgressGrid({ t }: { t: { gridTitle: string; gridCode: string; gridLessons: string; legendDone: string; legendTrying: string; legendNotYet: string } }) {
	const fill = ["bg-transparent", "bg-jua", "bg-mwani"];
	return (
		<div className="kadi p-4 sm:p-6 lg:rotate-[-0.8deg]" aria-hidden>
			<div className="flex flex-wrap items-center justify-between gap-2">
				<p className="font-display text-xl font-extrabold">{t.gridTitle}</p>
				<span className="lebo rounded-sm border-2 border-mstari bg-karatasi-2 px-2 py-0.5">
					{t.gridCode}: KJM-7Q4
				</span>
			</div>
			<div className="mt-5 overflow-x-auto">
				<table className="w-full border-separate border-spacing-1.5 text-sm">
					<thead>
						<tr>
							<th className="lebo pr-2 text-left font-bold text-muted-foreground">{t.gridLessons}</th>
							{GRID[0][1].map((_, i) => (
								<th key={i} className="lebo w-7 text-center text-muted-foreground">
									{i + 1}
								</th>
							))}
						</tr>
					</thead>
					<tbody>
						{GRID.map(([name, cells]) => (
							<tr key={name}>
								<td className="pr-2 font-semibold whitespace-nowrap">{name}</td>
								{cells.map((c, i) => (
									<td key={i}>
										<span className={cn("block size-6 rounded-[5px] border-2 sm:size-7", c === 0 ? "border-dashed border-mstari/35" : "border-mstari", fill[c])} />
									</td>
								))}
							</tr>
						))}
					</tbody>
				</table>
			</div>
			<div className="mt-4 flex flex-wrap gap-4 text-xs font-medium text-foreground/75">
				<span className="flex items-center gap-1.5">
					<span className="size-3.5 rounded-[3px] border-2 border-mstari bg-mwani" />
					{t.legendDone}
				</span>
				<span className="flex items-center gap-1.5">
					<span className="size-3.5 rounded-[3px] border-2 border-mstari bg-jua" />
					{t.legendTrying}
				</span>
				<span className="flex items-center gap-1.5">
					<span className="size-3.5 rounded-[3px] border-2 border-dashed border-mstari/35" />
					{t.legendNotYet}
				</span>
			</div>
		</div>
	);
}
