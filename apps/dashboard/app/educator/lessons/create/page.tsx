"use client";

import LessonEditor, { type LessonFormInputs } from "@/components/editor/lesson-editor";

export default function CreateLessonPage() {
	const onSubmit = (data: LessonFormInputs) => {
		console.log("Lesson data submitted:", data);
		// TODO: Save to API or database
	};

	return (
		<div className="container mx-auto py-10">
			<LessonEditor onSubmit={onSubmit} />
		</div>
	);
}
