import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { getDictionary, hasLocale } from "@/app/(main)/[lang]/dictionaries";
import { getMimi } from "@/lib/darasa/queries.server";
import { DarasaHome } from "@/components/darasa/darasa-home";
import { JoinFlow } from "@/components/darasa/join-flow";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
	const { lang } = await params;
	const dict = await getDictionary(hasLocale(lang) ? lang : "sw");
	return { title: dict.darasa.metaTitle, description: dict.darasa.metaDescription, robots: { index: false } };
}

export default async function DarasaPage({
	params,
	searchParams,
}: {
	params: Promise<{ lang: string }>;
	searchParams: Promise<{ msimbo?: string }>;
}) {
	const { lang } = await params;
	if (!hasLocale(lang)) notFound();
	const [dict, { msimbo }, mimi] = await Promise.all([getDictionary(lang), searchParams, getMimi()]);
	const { owner, ...data } = mimi;

	if (data.mwanafunzi && data.darasa) {
		return <DarasaHome data={data} dict={dict.darasa} lang={lang} />;
	}

	const logtoName =
		owner?.kind === "logto" ? String(owner.claims.name || owner.claims.username || "") || null : null;

	return (
		<main className="gridi flex-1 overflow-x-hidden overflow-y-auto bg-karatasi">
			<div className="px-4 py-8 sm:px-8 sm:py-14">
				<JoinFlow dict={dict.darasa} logtoName={logtoName} initialCode={msimbo} />
			</div>
		</main>
	);
}
