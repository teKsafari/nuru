import { notFound, redirect } from "next/navigation";
import { getModuleWithLessons, updateModule } from "@/app/actions/modules";
import ModuleForm, { type ModuleFormInputs } from "@/components/editor/module-form";
import { getServerDict } from "@/lib/lang";

export const dynamic = "force-dynamic";

export default async function EditModulePage({ params }: { params: Promise<{ moduleId: string }> }) {
	const { moduleId } = await params;
	const [module, { t }] = await Promise.all([getModuleWithLessons(moduleId), getServerDict()]);

	if (!module) notFound();

	const title = typeof module.title === "string" ? { sw: module.title, en: module.title } : module.title;
	const initialData: ModuleFormInputs = {
		title: { sw: title.sw ?? "", en: title.en ?? "" },
		difficulty: module.difficulty || "mwanzilishi",
		visibility: module.visibility || "private",
	};
	const { executorType, layoutConfig } = module;

	async function updateAction(data: ModuleFormInputs) {
		"use server";
		await updateModule(moduleId, {
			title: data.title,
			difficulty: data.difficulty,
			visibility: data.visibility,
			executorType,
			layoutConfig,
		});
		redirect(`/educator/modules/${moduleId}`);
	}

	return <ModuleForm onSubmit={updateAction} initialData={initialData} isUpdate backHref={`/educator/modules/${moduleId}`} backLabel={t.editor.back} />;
}
