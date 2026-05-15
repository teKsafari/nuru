import { getModule } from "@/lib/lessons.server";
import { notFound, redirect } from "next/navigation";

interface PageProps {
	params: Promise<{ moduleId: string; lang: string }>;
}

export default async function ModulePage({ params }: PageProps) {
	const { moduleId, lang } = await params;
	
	let module;
	try {
		module = await getModule(moduleId);
	} catch (error) {
		console.error(`Error loading module ${moduleId}:`, error);
		return notFound();
	}

	if (module.lessons.length > 0) {
		redirect(`/${lang}/anza/${moduleId}/${module.lessons[0].id}`);
	}
	
	return notFound();
}
