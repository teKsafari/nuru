import { getLesson, getAllLessons } from "@/lib/lessons.server";
import { AnzaClient } from "../../anza-client";
import { notFound } from "next/navigation";
import { getDictionary, Locale } from "@/app/(main)/[lang]/dictionaries";

export const dynamic = "force-dynamic";

interface PageProps {
	params: Promise<{ lessonId: string; stepId: string; lang: string }>;
}

export default async function StepPage({ params }: PageProps) {
	const { lessonId, stepId, lang } = await params;
	const dict = await getDictionary(lang as Locale);
	
	let lesson;
	try {
		lesson = await getLesson(lessonId);
	} catch (error) {
		console.error(`Error loading lesson ${lessonId}:`, error);
		return notFound();
	}

	// Verify step exists
	const stepExists = lesson.steps.some(s => s.id === stepId);
	if (!stepExists) {
		return notFound();
	}

	let allLessons;
	try {
		allLessons = await getAllLessons();
	} catch (error) {
		console.error("Error loading all lessons:", error);
		allLessons = [];
	}

	const currentIndex = allLessons.findIndex(l => l.id === lessonId);
	const nextLessonId = currentIndex >= 0 && currentIndex < allLessons.length - 1 
		? allLessons[currentIndex + 1].id 
		: undefined;

	return (
		<AnzaClient 
			lesson={lesson} 
			stepId={stepId}
			nextLessonId={nextLessonId} 
			lang={lang as Locale} 
			dict={dict} 
		/>
	);
}
