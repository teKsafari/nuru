import { getLesson, getAllLessons } from "@/lib/lessons.server";
import { AnzaClient } from "./anza-client";
import { notFound } from "next/navigation";
import { getDictionary, Locale } from "@/app/(main)/[lang]/dictionaries";

export const dynamic = "force-dynamic";

interface PageProps {
	params: Promise<{ lessonId: string; lang: string }>;
}

export default async function LessonPage({ params }: PageProps) {
	const { lessonId, lang } = await params;
	const dict = await getDictionary(lang as Locale);
	
	try {
		const lesson = await getLesson(lessonId);
		const allLessons = await getAllLessons();
		const currentIndex = allLessons.findIndex(l => l.id === lessonId);
		const nextLessonId = currentIndex >= 0 && currentIndex < allLessons.length - 1 
			? allLessons[currentIndex + 1].id 
			: undefined;

		return <AnzaClient lesson={lesson} nextLessonId={nextLessonId} lang={lang as Locale} dict={dict} />;
	} catch (error) {
		console.error(`Error loading lesson ${lessonId}:`, error);
		return notFound();
	}
}
