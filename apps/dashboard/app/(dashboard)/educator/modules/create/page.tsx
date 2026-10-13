"use client";

import { useRouter } from "next/navigation";
import ModuleForm, { type ModuleFormInputs } from "@/components/editor/module-form";
import { createModule } from "@/app/actions/modules";

export default function CreateModulePage() {
	const router = useRouter();

	const onSubmit = async (data: ModuleFormInputs) => {
		const result = await createModule({
			title: data.title,
			difficulty: data.difficulty,
			visibility: data.visibility,
			layoutConfig: { terminal: true },
		});
		if (result.id) router.push(`/educator/modules/${result.id}`);
	};

	return <ModuleForm onSubmit={onSubmit} backHref="/educator/modules" />;
}
