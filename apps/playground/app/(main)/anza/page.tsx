import { getLesson } from "@/lib/lessons.server";
import { AnzaClient } from "@/app/(main)/anza/[lessonId]/anza-client";

export const dynamic = "force-dynamic";

export default async function Home() {
	const lesson = await getLesson("misingi-ya-nuru");

	return <AnzaClient lesson={lesson} />;
}
