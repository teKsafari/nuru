import { getModuleBySlug, getCurriculumTree } from "@/lib/lessons.server";
import { getDictionary, Locale } from "@/app/(main)/[lang]/dictionaries";
import { AnzaClient } from "../anza-client";
import { notFound } from "next/navigation";
import { CurriculumModule } from "@/types/playground";

interface LayoutProps {
	children: React.ReactNode;
	params: Promise<{ moduleSlug: string; lang: string }>;
}

/**
 * Module-scoped shell. Rendering AnzaClient here (rather than in the lesson page)
 * keeps the sidebar, editor, and WASM runtime mounted while only the [lessonSlug]
 * child segment changes, so in-module lesson navigation no longer remounts the
 * subtree. The current lesson is derived from the URL inside AnzaClient.
 */
export default async function ModuleLayout({ children, params }: LayoutProps) {
	const { moduleSlug, lang } = await params;

	// Fetch in parallel. A curriculum-tree failure must not empty the whole shell,
	// so it degrades to []; a missing module is a real 404.
	const [moduleResult, tree, dict] = await Promise.all([
		getModuleBySlug(moduleSlug)
			.then((m) => ({ ok: true as const, module: m }))
			.catch((e) => ({ ok: false as const, error: e })),
		getCurriculumTree().catch((e) => {
			console.error("getCurriculumTree failed:", e);
			return [] as CurriculumModule[];
		}),
		getDictionary(lang as Locale),
	]);

	if (!moduleResult.ok) {
		console.error(`Error loading module ${moduleSlug}:`, moduleResult.error);
		return notFound();
	}
	const module = moduleResult.module;

	const currentIndex = tree.findIndex((m) => m.slug === moduleSlug);
	const nextModuleSlug =
		currentIndex >= 0 && currentIndex < tree.length - 1
			? tree[currentIndex + 1].slug
			: undefined;

	return (
		<>
			<AnzaClient
				module={module}
				allModules={tree}
				nextModuleSlug={nextModuleSlug}
				lang={lang as Locale}
				dict={dict}
			/>
			{/* The lesson page renders nothing; it exists to validate the lessonSlug
			    (404 on bad slugs) on hard loads / cross-module navigation. */}
			{children}
		</>
	);
}
