import { notFound } from "next/navigation";
import Link from "next/link";

import { ArrowRight } from "lucide-react";

import { hasLocale, getDictionary } from "@/app/(main)/[lang]/dictionaries";

export default async function Home({ params }: PageProps<"/[lang]">) {
	const { lang } = await params;

	if (!hasLocale(lang)) notFound();

	const dict=await getDictionary(lang);

	return (
		<main className="bg-background relative flex items-center justify-center overflow-hidden font-mono">
			{/* Hero Content */}
			<div className="relative z-10 mx-auto flex min-h-[calc(100svh-4rem)] max-w-4xl flex-col justify-center px-4 text-center">
				{/* Main Headline */}
				<h1 className="text-foreground mb-2 font-serif text-5xl leading-tight font-bold text-yellow-500 md:text-6xl lg:text-7xl">
					Nuru
				</h1>
				<h2 className="text-foreground mb-4 text-2xl leading-tight font-bold md:text-3xl lg:text-3xl">
					{dict.landing.title}
				</h2>

				{/* CTA Button */}
				<div className="flex flex-col items-center gap-4">
					<Link
						href="/anza"
						className="group relative inline-flex items-center gap-3 overflow-hidden rounded-xl border-2 border-yellow-500 bg-yellow-500 px-8 py-4 text-lg font-bold text-black shadow-md transition-all hover:scale-[1.02] hover:shadow-lg active:scale-95"
					>
						<span>Anza Kujifunza</span>
						<ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
					</Link>
				</div>
			</div>
		</main>
	);
}
