"use client";

import LessonEditor, { type LessonFormInputs } from "@/components/editor/lesson-editor";
import { createModule } from "@/app/actions/modules";
import { createLesson } from "@/app/actions/lessons";
import { useRouter } from "next/navigation";
import { useTransition } from "react";

export default function CreateLessonPage() {
	const router = useRouter();
	const [isPending, startTransition] = useTransition();

	const onSubmit = async (data: LessonFormInputs) => {
		startTransition(async () => {
			try {
				// Map form data to schema
				const localizedTitle = { en: data.title, sw: data.title }; // Simplification for now
				const localizedDescription = { en: data.description, sw: data.description };

				// 1. Create Module
				const moduleResult = await createModule({
					title: localizedTitle,
					difficulty: data.difficulty,
					visibility: data.visibility,
					layoutConfig: data.layoutConfig,
				});

				if (moduleResult.id) {
					// 2. Create Lesson within that module
					await createLesson(moduleResult.id, {
						title: localizedTitle,
						description: localizedDescription,
						task: localizedDescription, // Using description as task for now
						defaultCode: data.defaultCodeTemplate,
						tests: data.testCases,
					});

					router.push("/educator/lessons");
				}
			} catch (error) {
				console.error("Failed to create lesson:", error);
			}
		});
	};

	return (
		<div className="container mx-auto py-10">
			<LessonEditor onSubmit={onSubmit} />
			{isPending && (
				<div className="fixed inset-0 bg-background/50 flex items-center justify-center z-50">
					<p className="text-lg font-semibold">Creating module and lesson...</p>
				</div>
			)}
		</div>
	);
}
