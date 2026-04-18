import { getLesson, getAllLessons } from "@/lib/lessons.server";
import { AnzaClient } from "@/app/(main)/[lang]/anza/[lessonId]/anza-client";
import { getDictionary, Locale } from "@/app/(main)/[lang]/dictionaries";

export const dynamic = "force-dynamic";

export default async function Home({ params }: { params: Promise<{ lang: string }> }) {
	const lesson = await getLesson("misingi-ya-nuru");
	const allLessons = await getAllLessons();
	const nextLessonId = allLessons.length > 1 ? allLessons[1].id : undefined;

	const { lang } = await params;
	const dict = await getDictionary(lang as Locale);

	return <AnzaClient lesson={lesson} nextLessonId={nextLessonId} lang={lang as Locale} dict={dict} />;
}
