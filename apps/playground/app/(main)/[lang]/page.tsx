import { notFound } from "next/navigation";
import Link from "next/link";

import { ArrowRight } from "lucide-react";

import { hasLocale, getDictionary } from "@/app/(main)/[lang]/dictionaries";

export default async function Home({ params }: PageProps<"/[lang]">) {
	const { lang } = await params;

	if (!hasLocale(lang)) notFound();

	const dict=await getDictionary(lang);

	return (
		<main className="bg-background relative flex min-h-[calc(100svh-4rem)] items-start justify-center overflow-hidden py-12 font-mono sm:py-16 lg:items-center">
			<div className="pointer-events-none absolute inset-0">
				<div className="absolute -top-32 right-[-10%] h-72 w-72 rounded-full bg-yellow-500/20 blur-3xl" />
				<div className="absolute bottom-[-10%] left-[-10%] h-72 w-72 rounded-full bg-sky-500/10 blur-3xl" />
			</div>

			<div className="relative z-10 mx-auto w-full max-w-6xl px-4">
				<div className="grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]">
					<div className="text-center lg:text-left">
						<span className="inline-flex items-center gap-2 rounded-full border border-yellow-500/30 bg-yellow-500/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-yellow-600">
							{dict.landing.badge}
						</span>
						<h1 className="text-foreground mt-4 font-serif text-4xl font-bold leading-tight text-yellow-500 sm:text-5xl lg:text-6xl">
							Nuru
						</h1>
						<h2 className="text-foreground text-balance mt-3 text-2xl font-bold leading-tight sm:text-3xl lg:text-4xl">
							{dict.landing.title}
						</h2>
						<p className="text-foreground/80 text-balance mt-3 text-base sm:text-lg">
							{dict.landing.subtitle}
						</p>
						<p className="text-muted-foreground text-balance mt-3 text-sm sm:text-base">
							{dict.landing.description}
						</p>

						<div className="mt-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-center lg:justify-start">
							<Link
								href={`/${lang}/anza`}
								className="group relative inline-flex w-full items-center justify-center gap-3 overflow-hidden rounded-xl border-2 border-yellow-500 bg-yellow-500 px-6 py-3 text-base font-bold text-black shadow-md transition-all hover:scale-[1.02] hover:shadow-lg active:scale-95 sm:w-auto"
							>
								<span>{dict.landing.cta}</span>
								<ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
							</Link>
							<Link
								href={`/${lang}/masomo`}
								className="inline-flex w-full items-center justify-center rounded-xl border border-border bg-background/80 px-6 py-3 text-base font-semibold text-foreground transition-all hover:bg-muted/50 sm:w-auto"
							>
								{dict.landing.secondaryCta}
							</Link>
						</div>
					</div>

					<div className="space-y-4">
						{dict.landing.features.map((feature, index) => (
							<div
								key={feature.title}
								className="rounded-2xl border border-border/60 bg-background/80 p-5 shadow-sm backdrop-blur"
							>
								<div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-yellow-500/15 text-sm font-bold text-yellow-600">
									{String(index + 1).padStart(2, "0")}
								</div>
								<h3 className="text-base font-semibold">{feature.title}</h3>
								<p className="text-muted-foreground mt-1 text-sm leading-relaxed">
									{feature.description}
								</p>
							</div>
						))}
					</div>
				</div>
			</div>
		</main>
	);
}
