import { getAllModulesWithLessons } from "@/lib/lessons.server";
import { getDictionary, Locale } from "@/app/(main)/[lang]/dictionaries";
import { LessonsMap } from "@/components/lessons-map/lessons-map";

export const dynamic = "force-dynamic";

export default async function MasomoPage({
	params,
}: {
	params: Promise<{ lang: string }>;
}) {
	const { lang } = await params;
	const modules = await getAllModulesWithLessons();
	const dict = await getDictionary(lang as Locale);

	return (
		<main className="flex-1 overflow-auto bg-background p-6 md:p-10">
			<div className="mx-auto max-w-6xl">
				<header className="mb-10 text-center">
					<h1 className="mb-2 text-3xl font-bold tracking-tight text-foreground md:text-4xl">
						{dict.map.title}
					</h1>
					<p className="text-muted-foreground">
						{dict.map.description}
					</p>
				</header>

				<LessonsMap modules={modules} lang={lang as "en" | "sw"} dict={dict} />
			</div>
		</main>
	);
}
