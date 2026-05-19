import { getLesson } from "@/lib/lessons.server";
import { notFound, redirect } from "next/navigation";

interface PageProps {
	params: Promise<{ lessonId: string; lang: string }>;
}

export default async function LessonPage({ params }: PageProps) {
	const { lessonId, lang } = await params;
	
	let lesson;
	try {
		lesson = await getLesson(lessonId);
	} catch (error) {
		console.error(`Error loading lesson ${lessonId}:`, error);
		return notFound();
	}

	if (lesson.steps.length > 0) {
		redirect(`/${lang}/anza/${lessonId}/${lesson.steps[0].id}`);
	}
	
	return notFound();
}
