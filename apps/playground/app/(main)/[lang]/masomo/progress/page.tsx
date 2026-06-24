import { getAllModulesWithLessons } from "@/lib/lessons.server";
import { getDictionary, Locale } from "@/app/(main)/[lang]/dictionaries";
import { ProgressDashboardClient } from "./progress-client";

export const dynamic = "force-dynamic";

export default async function ProgressPage({
	params,
}: {
	params: Promise<{ lang: string }>;
}) {
	const { lang } = await params;
	const modules = await getAllModulesWithLessons();
	const dict = await getDictionary(lang as Locale);
	return (
		<ProgressDashboardClient
			modules={modules}
			lang={lang as "en" | "sw"}
			dict={dict}
		/>
	);
}
