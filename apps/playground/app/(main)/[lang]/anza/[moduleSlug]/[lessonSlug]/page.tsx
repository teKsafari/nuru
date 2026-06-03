import { getModuleBySlug, getAllModules } from "@/lib/lessons.server";
import { AnzaClient } from "../../anza-client";
import { notFound } from "next/navigation";
import { getDictionary, Locale } from "@/app/(main)/[lang]/dictionaries";
import { Module, Language } from "@/types/playground";

export const dynamic = "force-dynamic";

interface PageProps {
	params: Promise<{ moduleSlug: string; lessonSlug: string; lang: string }>;
}

export default async function LessonPage({ params }: PageProps) {
	const { moduleSlug, lessonSlug, lang } = await params;
	const dict = await getDictionary(lang as Locale);
	
	let module: Module;
	try {
		module = await getModuleBySlug(moduleSlug);
	} catch (error) {
		console.error(`Error loading module ${moduleSlug}:`, error);
		return notFound();
	}

	// Verify lesson exists
	const lessonExists = module.lessons.some(s => s.slug === lessonSlug);
	if (!lessonExists) {
		return notFound();
	}

	let allModules: { id: string; slug: string; title: Record<Language, string> }[];
	try {
		allModules = await getAllModules();
	} catch (error) {
		console.error("Error loading all modules:", error);
		allModules = [];
	}

	const currentIndex = allModules.findIndex(l => l.slug === moduleSlug);
	const nextModuleSlug = currentIndex >= 0 && currentIndex < allModules.length - 1 
		? allModules[currentIndex + 1].slug 
		: undefined;

	return (
		<AnzaClient 
			module={module} 
			lessonSlug={lessonSlug}
			nextModuleSlug={nextModuleSlug} 
			lang={lang as Locale} 
			dict={dict} 
		/>
	);
}
