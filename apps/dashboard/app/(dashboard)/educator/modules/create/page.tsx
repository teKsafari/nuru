"use client";

import ModuleForm, { type ModuleFormInputs } from "@/components/editor/module-form";
import { createModule } from "@/app/actions/modules";
import { useRouter } from "next/navigation";
import { useTransition } from "react";

export default function CreateModulePage() {
	const router = useRouter();
	const [isPending, startTransition] = useTransition();

	const onSubmit = async (data: ModuleFormInputs) => {
		startTransition(async () => {
			try {
				const localizedTitle = { en: data.title, sw: data.title }; // Simplification for now

				const moduleResult = await createModule({
					title: localizedTitle,
					difficulty: data.difficulty,
					visibility: data.visibility,
					layoutConfig: { terminal: true }, // Default minimal layout config
				});

				if (moduleResult.id) {
					router.push(`/educator/modules/${moduleResult.id}`);
				}
			} catch (error) {
				console.error("Failed to create module:", error);
			}
		});
	};

	return (
		<div className="container mx-auto py-10">
			<ModuleForm onSubmit={onSubmit} />
			{isPending && (
				<div className="fixed inset-0 bg-background/50 flex items-center justify-center z-50">
					<p className="text-lg font-semibold">Creating module...</p>
				</div>
			)}
		</div>
	);
}
