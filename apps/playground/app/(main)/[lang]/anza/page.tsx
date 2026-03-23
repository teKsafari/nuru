import { getLesson, getAllLessons } from "@/lib/lessons.server";
import { AnzaClient } from "@/app/(main)/[lang]/anza/[lessonId]/anza-client";

export const dynamic = "force-dynamic";

export default async function Home() {
	const lesson = await getLesson("misingi-ya-nuru");
	const allLessons = await getAllLessons();
	const nextLessonId = allLessons.length > 1 ? allLessons[1].id : undefined;

	return <AnzaClient lesson={lesson} nextLessonId={nextLessonId} />;
}
