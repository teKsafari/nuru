import { notFound } from "next/navigation";
import { db, modules } from "@/lib/db";
import { eq } from "drizzle-orm";
import { getServerDict } from "@/lib/lang";
import { pick } from "@/lib/dict";
import { CreateLessonClient } from "./create-client";

export const dynamic = "force-dynamic";

export default async function CreateLessonPage({ params }: { params: Promise<{ moduleId: string }> }) {
	const { moduleId } = await params;
	const [module, { lang }] = await Promise.all([db.query.modules.findFirst({ where: eq(modules.id, moduleId), columns: { id: true, title: true } }), getServerDict()]);
	if (!module) notFound();
	return <CreateLessonClient moduleId={moduleId} moduleTitle={pick(module.title, lang)} />;
}
