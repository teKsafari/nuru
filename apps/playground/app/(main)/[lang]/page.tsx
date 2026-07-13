import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Feather, Languages, Zap, Send, Code2, Sparkles } from "lucide-react";

import { hasLocale, getDictionary } from "@/app/(main)/[lang]/dictionaries";
import contributors from "@/public/contributors.json";
import { Button } from "@nuru/ui/components/button";
import { Badge } from "@nuru/ui/components/badge";
import { Card, CardHeader, CardTitle, CardContent } from "@nuru/ui/components/card";
import { AppLogo } from "@nuru/ui/components/app-logo";
import { HeroRunner } from "@/components/landing/hero-runner";

const TELEGRAM_URL = "https://t.me/NuruProgrammingChat";
const GITHUB_URL = "https://github.com/NuruProgramming";

const WHY_ICONS = [Feather, Languages, Zap];

export default async function Home({
	params,
}: {
	params: Promise<{ lang: string }>;
}) {
	const { lang } = await params;

	if (!hasLocale(lang)) notFound();

	const dict = await getDictionary(lang);
	const l = dict.landing;

	return (
		// The app shell sets `overflow: hidden` on body, so the landing page owns
		// its own scroll container instead of relying on the document to scroll.
		<main className="bg-background h-full overflow-x-hidden overflow-y-auto">
			{/* Hero */}
			<section className="relative">
				{/* Signature brand glow behind the hero */}
				<div
					aria-hidden
					className="bg-gradient-brand pointer-events-none absolute -top-24 left-1/2 h-72 w-[36rem] -translate-x-1/2 rounded-full opacity-20 blur-3xl"
				/>
				<div className="relative mx-auto grid max-w-6xl items-center gap-10 px-5 py-16 sm:px-6 md:py-24 lg:grid-cols-2 lg:gap-14">
					<div className="text-center lg:text-left">
						<Badge
							variant="secondary"
							className="mb-5 gap-1.5 rounded-full px-3 py-1 font-normal"
						>
							<Sparkles className="text-muted-foreground size-3.5" />
							{l.hero.badge}
						</Badge>
						<h1 className="text-gradient-brand mb-4 text-5xl font-extrabold tracking-tight md:text-6xl">
							Nuru
						</h1>
						<h2 className="text-foreground mb-4 text-3xl leading-tight font-bold text-balance md:text-4xl">
							{l.title}
						</h2>
						<p className="text-muted-foreground mx-auto mb-8 max-w-md text-lg text-balance lg:mx-0 md:text-xl">
							{l.tagline}
						</p>
						<div className="flex flex-col items-center gap-3 sm:flex-row lg:justify-start justify-center">
							<Button asChild size="lg">
								<Link href={`/${lang}/anza`}>
									{l.hero.ctaStart}
									<ArrowRight className="size-4" />
								</Link>
							</Button>
							<Button asChild size="lg" variant="outline">
								<Link href={`/${lang}/masomo`}>{l.hero.ctaLessons}</Link>
							</Button>
						</div>
					</div>

					{/* Live, runnable Nuru right in the hero */}
					<div className="w-full">
						<HeroRunner
							initialCode={l.hero.demoCode}
							runLabel={l.hero.runLabel}
							runningLabel={l.hero.runningLabel}
							outputLabel={l.hero.outputLabel}
							readyLabel={l.hero.readyLabel}
							loadingLabel={l.hero.loadingLabel}
							placeholder={l.hero.outputPlaceholder}
						/>
					</div>
				</div>
			</section>

			{/* Why Nuru */}
			<section className="mx-auto w-full max-w-6xl px-5 py-16 sm:px-6 md:py-20">
				<div className="mx-auto mb-10 max-w-2xl text-center md:mb-14">
					<h2 className="mb-3 text-3xl font-bold tracking-tight md:text-4xl">{l.why.title}</h2>
					<p className="text-muted-foreground text-lg">{l.why.subtitle}</p>
				</div>
				<div className="grid gap-5 sm:gap-6 md:grid-cols-3">
					{l.why.features.map((feature, index) => {
						const Icon = WHY_ICONS[index % WHY_ICONS.length];
						return (
							<Card key={index} className="transition-shadow hover:shadow-md">
								<CardHeader>
									<span className="bg-secondary text-foreground mb-2 inline-flex size-11 items-center justify-center rounded-xl">
										<Icon className="size-5" />
									</span>
									<CardTitle className="text-xl">{feature.title}</CardTitle>
								</CardHeader>
								<CardContent>
									<p className="text-muted-foreground leading-relaxed">{feature.details}</p>
								</CardContent>
							</Card>
						);
					})}
				</div>
			</section>

			{/* Plain words / keyword glossary */}
			<section className="border-border/60 border-y bg-card/40">
				<div className="mx-auto w-full max-w-6xl px-5 py-16 sm:px-6 md:py-20">
					<div className="mx-auto mb-10 max-w-2xl text-center">
						<h2 className="mb-3 text-3xl font-bold tracking-tight md:text-4xl">{l.keywords.title}</h2>
						<p className="text-muted-foreground text-lg">{l.keywords.subtitle}</p>
					</div>
					<div className="mx-auto grid max-w-3xl grid-cols-2 gap-3 sm:grid-cols-4">
						{l.keywords.items.map((kw) => (
							<div
								key={kw.nuru}
								className="border-border bg-background flex flex-col items-center gap-1 rounded-xl border px-3 py-4 text-center"
							>
								<code className="text-foreground font-mono text-base font-semibold">{kw.nuru}</code>
								<span className="text-muted-foreground text-xs">= {kw.english}</span>
							</div>
						))}
					</div>
				</div>
			</section>

			{/* Learning path */}
			<section className="mx-auto w-full max-w-6xl px-5 py-16 sm:px-6 md:py-20">
				<div className="mx-auto mb-10 max-w-2xl text-center md:mb-14">
					<h2 className="mb-3 text-3xl font-bold tracking-tight md:text-4xl">{l.learn.title}</h2>
					<p className="text-muted-foreground text-lg">{l.learn.subtitle}</p>
				</div>
				<div className="mb-10 grid gap-5 sm:gap-6 md:grid-cols-3">
					{l.learn.tiers.map((tier, index) => (
						<Card key={index}>
							<CardHeader>
								<Badge variant="outline" className="mb-1 w-fit">
									{tier.level}
								</Badge>
								<CardTitle className="text-xl">{tier.name}</CardTitle>
							</CardHeader>
							<CardContent>
								<p className="text-muted-foreground leading-relaxed">{tier.blurb}</p>
							</CardContent>
						</Card>
					))}
				</div>
				<div className="text-center">
					<Button asChild size="lg">
						<Link href={`/${lang}/anza`}>
							{l.learn.cta}
							<ArrowRight className="size-4" />
						</Link>
					</Button>
				</div>
			</section>

			{/* Community */}
			<section className="border-border/60 border-t bg-card/40">
				<div className="mx-auto w-full max-w-5xl px-5 py-16 text-center sm:px-6 md:py-20">
					<h2 className="mb-3 text-3xl font-bold tracking-tight md:text-4xl">{l.community.title}</h2>
					<p className="text-muted-foreground mx-auto mb-8 max-w-2xl text-lg">{l.community.subtitle}</p>
					<Button asChild size="lg" variant="outline" className="mb-12">
						<a href={TELEGRAM_URL} target="_blank" rel="noopener noreferrer">
							<Send className="size-4" />
							{l.community.telegram}
						</a>
					</Button>

					<h3 className="text-muted-foreground mb-6 text-sm font-semibold tracking-wide uppercase">
						{l.community.contributors}
					</h3>
					<div className="flex flex-wrap justify-center gap-4">
						{contributors.map((contributor) => (
							<a
								key={contributor.username}
								href={contributor.profile_url}
								target="_blank"
								rel="noopener noreferrer"
								className="group relative"
								title={contributor.username}
							>
								<div className="border-border group-hover:border-primary relative h-14 w-14 overflow-hidden rounded-full border-2 transition-all group-hover:scale-110">
									<Image
										src={contributor.profile_picture}
										alt={contributor.username}
										fill
										className="object-cover"
									/>
								</div>
							</a>
						))}
					</div>
				</div>
			</section>

			{/* Footer */}
			<footer className="border-border border-t">
				<div className="mx-auto grid w-full max-w-6xl gap-8 px-5 py-12 sm:px-6 md:grid-cols-[1.5fr_1fr_1fr]">
					<div>
						<Link href={`/${lang}`} className="mb-3 flex items-center gap-2.5">
							<AppLogo size={24} className="rounded-md" />
							<span className="text-gradient-brand text-lg font-bold">Nuru</span>
						</Link>
						<p className="text-muted-foreground max-w-xs text-sm">{l.footer.tagline}</p>
					</div>
					<div>
						<h4 className="mb-3 text-sm font-semibold">{l.footer.product}</h4>
						<ul className="space-y-2 text-sm">
							<li>
								<Link href={`/${lang}/anza`} className="text-muted-foreground hover:text-foreground transition-colors">
									{l.footer.playground}
								</Link>
							</li>
							<li>
								<Link href={`/${lang}/masomo`} className="text-muted-foreground hover:text-foreground transition-colors">
									{l.footer.lessons}
								</Link>
							</li>
						</ul>
					</div>
					<div>
						<h4 className="mb-3 text-sm font-semibold">{l.footer.communityHeading}</h4>
						<ul className="space-y-2 text-sm">
							<li>
								<a href={GITHUB_URL} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground inline-flex items-center gap-1.5 transition-colors">
									<Code2 className="size-3.5" />
									{l.footer.github}
								</a>
							</li>
							<li>
								<a href={TELEGRAM_URL} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground inline-flex items-center gap-1.5 transition-colors">
									<Send className="size-3.5" />
									{l.footer.telegram}
								</a>
							</li>
						</ul>
					</div>
				</div>
				<div className="border-border/60 border-t py-5">
					<p className="text-muted-foreground text-center text-sm">{l.footer.builtWith}</p>
				</div>
			</footer>
		</main>
	);
}
