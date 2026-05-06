import { redirect } from "next/navigation";

export default async function AnzaPage({ params }: { params: Promise<{ lang: string }> }) {
	const { lang } = await params;
	// Redirect to the first lesson
	redirect(`/${lang}/anza/misingi-ya-nuru`);
}
