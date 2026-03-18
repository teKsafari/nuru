import { getLesson } from "@/lib/lessons.server";
import { AnzaClient } from "./anza-client";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

interface PageProps {
	params: Promise<{ lessonId: string }>;
}

export default async function LessonPage({ params }: PageProps) {
	const { lessonId } = await params;
	
	try {
		const lesson = await getLesson(lessonId);
		return <AnzaClient lesson={lesson} />;
	} catch (error) {
		console.error(`Error loading lesson ${lessonId}:`, error);
		return notFound();
	}
}
