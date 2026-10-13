"use client";

import { useRouter } from "next/navigation";
import LessonEditor, { type LessonFormValues } from "@/components/editor/lesson-editor";
import { createLesson } from "@/app/actions/lessons";

export function CreateLessonClient({ moduleId, moduleTitle }: { moduleId: string; moduleTitle: string }) {
	const router = useRouter();

	const onSubmit = async (data: LessonFormValues) => {
		const { id } = await createLesson(moduleId, data);
		// Keep editing the saved lesson at its own address.
		router.replace(`/educator/modules/${moduleId}/lessons/${id}`);
	};

	return <LessonEditor onSubmit={onSubmit} backHref={`/educator/modules/${moduleId}`} moduleTitle={moduleTitle} />;
}
