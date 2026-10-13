import type { Metadata } from "next";
import { getDictionary, type Locale } from "@/app/(main)/[lang]/dictionaries";
import { Uwanja } from "@/components/playground/uwanja/uwanja";

export const metadata: Metadata = {
	title: "Uwanja",
	description: "Andika na uendeshe programu za Nuru kwenye kivinjari: terminali, kobe na ubao.",
};

export default async function UwanjaPage({ params }: { params: Promise<{ lang: string }> }) {
	const { lang } = await params;
	const locale: Locale = lang === "en" ? "en" : "sw";
	const dict = await getDictionary(locale);
	return <Uwanja labels={dict.uwanja} lang={locale} />;
}
