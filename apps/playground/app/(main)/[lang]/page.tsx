import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

import { hasLocale, getDictionary } from "@/app/(main)/[lang]/dictionaries";
import contributors from "@/public/contributors.json";
import { Button } from "@/components/ui/button";

import { cn } from "@/lib/utils";
export default async function Home({
	params,
}: {
	params: Promise<{ lang: string }>;
}) {
	const { lang } = await params;

	if (!hasLocale(lang)) notFound();

	const dict = await getDictionary(lang);

	return (
		<main className="bg-background relative overflow-x-hidden">
			{/* Hero Section */}
			<section className="text-center/ relative z-10 mx-auto flex min-h-[70vh] max-w-6xl flex-col justify-center px-4 py-20">
				<h1 className="text-foreground mb-2 font-serif text-6xl leading-tight font-bold text-yellow-500 md:text-6xl">
					Nuru
				</h1>
				<h2 className="text-foreground mb-4 text-3xl leading-tight font-bold md:text-4xl lg:text-5xl max-w-xl">
					{dict.landing.title}
				</h2>
				<p className="text-muted-foreground mb-8 text-xl md:text-2xl">
					{dict.landing.tagline}
				</p>

				{/* CTA Buttons */}
				<div className="flex flex-col items-center gap-4 sm:flex-row">
					<Button
						asChild
						size={"lg"}
					>
						<Link href={`/${lang}/anza`}>{dict.landing.actions.anza}</Link>
					</Button>
					<Button
						asChild
						size={"lg"}
						variant="outline"
					>
						<Link href={`/${lang}/anza`}>{dict.landing.actions.mifano}</Link>
					</Button>
				</div>
			</section>

			{/* Features Section */}
			<section className="mx-auto max-w-6xl px-4 py-20">
				<div className="grid gap-8 md:grid-cols-3">
					{dict.landing.features.map((feature, index) => (
						<div
							key={index}
							className="flex flex-col rounded-2xl border bg-slate-900 p-8 shadow-sm transition-all hover:shadow-md"
						>
							<h3 className="mb-4 text-2xl font-bold">{feature.title}</h3>
							<p className="text-muted-foreground leading-relaxed">
								{/* Simple Markdown-like link handling for the community feature */}
								{feature.details.includes("[Telegram]") ? (
									<>
										{feature.details.split("[Telegram]")[0]}
										<a
											href="https://t.me/NuruProgrammingChat"
											target="_blank"
											rel="noopener noreferrer"
											className="text-yellow-500 hover:underline"
										>
											Telegram
										</a>
										{feature.details.split("]")[1]}
									</>
								) : (
									feature.details
								)}
							</p>
						</div>
					))}
				</div>
			</section>

			{/* Contributors Section */}
			<section className="mx-auto max-w-5xl px-4 py-20 text-center">
				<h2 className="mb-12 text-4xl font-bold md:text-5xl">
					{dict.landing.contributors}
				</h2>
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
							<div className="relative h-16 w-16 overflow-hidden rounded-full border-2 border-transparent transition-all group-hover:scale-110 group-hover:border-yellow-500">
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
			</section>
		</main>
	);
}
