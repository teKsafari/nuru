import { notFound } from "next/navigation";
import { getOwnedModule } from "@/lib/modules.server";
import { getServerDict } from "@/lib/lang";
import { pick } from "@/lib/dict";
import { CreateLessonClient } from "./create-client";

export const dynamic = "force-dynamic";

export default async function CreateLessonPage({ params }: { params: Promise<{ moduleId: string }> }) {
	const { moduleId } = await params;
	const [module, { lang }] = await Promise.all([getOwnedModule(moduleId), getServerDict()]);
	if (!module) notFound();
	return <CreateLessonClient moduleId={moduleId} moduleTitle={pick(module.title, lang)} />;
}
