import { getModuleBySlug } from "@/lib/lessons.server";
import { notFound, redirect } from "next/navigation";

interface PageProps {
	params: Promise<{ moduleSlug: string; lang: string }>;
}

export default async function ModulePage({ params }: PageProps) {
	const { moduleSlug, lang } = await params;
	
	let module;
	try {
		module = await getModuleBySlug(moduleSlug);
	} catch (error) {
		console.error(`Error loading module ${moduleSlug}:`, error);
		return notFound();
	}

	if (module.lessons.length > 0) {
		redirect(`/${lang}/anza/${moduleSlug}/${module.lessons[0].slug}`);
	}
	
	return notFound();
}
