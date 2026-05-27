import { getModule, getAllModules } from "@/lib/lessons.server";
import { AnzaClient } from "../../anza-client";
import { notFound } from "next/navigation";
import { getDictionary, Locale } from "@/app/(main)/[lang]/dictionaries";
import { Module, Language } from "@/types/playground";

export const dynamic = "force-dynamic";

interface PageProps {
	params: Promise<{ moduleId: string; lessonId: string; lang: string }>;
}

export default async function LessonPage({ params }: PageProps) {
	const { moduleId, lessonId, lang } = await params;
	const dict = await getDictionary(lang as Locale);
	
	let module: Module;
	try {
		module = await getModule(moduleId);
	} catch (error) {
		console.error(`Error loading module ${moduleId}:`, error);
		return notFound();
	}

	// Verify lesson exists
	const lessonExists = module.lessons.some(s => s.id === lessonId);
	if (!lessonExists) {
		return notFound();
	}

	let allModules: { id: string; title: Record<Language, string> }[];
	try {
		allModules = await getAllModules();
	} catch (error) {
		console.error("Error loading all modules:", error);
		allModules = [];
	}

	const currentIndex = allModules.findIndex(l => l.id === moduleId);
	const nextModuleId = currentIndex >= 0 && currentIndex < allModules.length - 1 
		? allModules[currentIndex + 1].id 
		: undefined;

	return (
		<AnzaClient 
			module={module} 
			lessonId={lessonId}
			nextModuleId={nextModuleId} 
			lang={lang as Locale} 
			dict={dict} 
		/>
	);
}
