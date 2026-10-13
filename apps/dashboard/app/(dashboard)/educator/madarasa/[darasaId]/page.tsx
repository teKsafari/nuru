import { notFound } from "next/navigation";

import { getDarasaDetail, listAssignableModules } from "@/app/actions/madarasa";
import { DarasaRoom } from "@/components/madarasa/darasa-room";

export const dynamic = "force-dynamic";

export default async function DarasaDetailPage({ params }: { params: Promise<{ darasaId: string }> }) {
	const { darasaId } = await params;
	const [detail, modules] = await Promise.all([getDarasaDetail(darasaId).catch(() => null), listAssignableModules()]);
	if (!detail) notFound();
	return <DarasaRoom initial={detail} modules={modules} />;
}
