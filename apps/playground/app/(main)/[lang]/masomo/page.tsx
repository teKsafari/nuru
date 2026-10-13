import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAllModulesWithLessons } from "@/lib/lessons.server";
import { getDictionary, hasLocale } from "@/app/(main)/[lang]/dictionaries";
import { LessonsMap, type RamaniModule } from "@/components/lessons-map/lessons-map";
import { SiteFooter } from "@/components/tovuti/footer";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
	const { lang } = await params;
	const dict = await getDictionary(hasLocale(lang) ? lang : "sw");
	return { title: dict.tovuti.ramani.metaTitle, description: dict.tovuti.ramani.lead };
}

export default async function MasomoPage({ params }: { params: Promise<{ lang: string }> }) {
	const { lang } = await params;
	if (!hasLocale(lang)) notFound();
	const dict = await getDictionary(lang);
	const t = dict.tovuti.ramani;

	// Only what the map needs travels to the client: no lesson bodies or tests.
	const modules: RamaniModule[] = (await getAllModulesWithLessons()).map((m) => ({
		id: m.id,
		slug: m.slug,
		title: m.title,
		difficulty: m.difficulty,
		lessons: m.lessons.map((l) => ({ id: l.id, slug: l.slug, title: l.title })),
	}));

	return (
		<main className="flex-1 overflow-x-hidden overflow-y-auto bg-karatasi">
			<header className="gridi border-b-2 border-mstari">
				<div className="mx-auto max-w-5xl px-5 pt-10 pb-10 sm:px-8 md:pt-14">
					<p className="lebo inline-block rounded-sm border-2 border-mstari bg-card px-2.5 py-1 shadow-kivuli-sm">{t.lebo}</p>
					<h1 className="mt-5 font-display text-[clamp(2.6rem,7vw,4.5rem)] leading-[0.95] font-extrabold tracking-[-0.04em]">
						<span className="alama-jua">{t.title}</span>
					</h1>
					<p className="mt-4 max-w-xl text-lg text-foreground/80">{t.lead}</p>
				</div>
			</header>
			<div className="mx-auto max-w-5xl px-5 py-10 sm:px-8 md:py-14">
				<LessonsMap modules={modules} lang={lang} dict={dict} />
			</div>
			<SiteFooter lang={lang} dict={dict} />
		</main>
	);
}
