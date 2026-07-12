import { getModuleBySlug } from "@/lib/lessons.server";
import { notFound } from "next/navigation";

interface PageProps {
	params: Promise<{ moduleSlug: string; lessonSlug: string; lang: string }>;
}

/**
 * Thin, cheap route marker. The UI is rendered by the module layout; this page
 * only validates that the lesson slug exists (the module fetch is deduped with
 * the layout via React.cache) and 404s otherwise. No `force-dynamic`, so
 * in-module navigation stays a soft segment change with no skeleton flash.
 */
export default async function LessonPage({ params }: PageProps) {
	const { moduleSlug, lessonSlug } = await params;

	let module;
	try {
		module = await getModuleBySlug(moduleSlug);
	} catch {
		return notFound();
	}

	if (!module.lessons.some((l) => l.slug === lessonSlug)) {
		return notFound();
	}

	return null;
}
