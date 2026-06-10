"use client";

import LessonEditor, { type LessonFormInputs } from "@/components/editor/lesson-editor";
import { createLesson } from "@/app/actions/lessons";
import { useRouter } from "next/navigation";
import { useTransition, use } from "react";
import { Button } from "@nuru/ui/components/button";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function CreateLessonPage({ params }: { params: Promise<{ moduleId: string }> }) {
	const { moduleId } = use(params);
	const router = useRouter();
	const [isPending, startTransition] = useTransition();

	const onSubmit = async (data: LessonFormInputs) => {
		startTransition(async () => {
			try {
				const localizedTitle = { en: data.title, sw: data.title };
				const localizedDescription = { en: data.description, sw: data.description };
				const localizedTask = { en: data.task, sw: data.task };

				await createLesson(moduleId, {
					title: localizedTitle,
					description: localizedDescription,
					task: localizedTask,
					defaultCode: data.defaultCodeTemplate,
					tests: data.testCases,
				});

				router.push(`/educator/modules/${moduleId}`);
			} catch (error) {
				console.error("Failed to create lesson:", error);
			}
		});
	};

	return (
		<div className="container mx-auto py-10 space-y-6">
			<div className="flex items-center gap-4">
				<Link href={`/educator/modules/${moduleId}`}>
					<Button variant="outline" size="icon">
						<ArrowLeft className="h-4 w-4" />
					</Button>
				</Link>
				<div>
					<h1 className="text-3xl font-bold">Add New Lesson</h1>
					<p className="text-muted-foreground">Create content, tasks, and test cases for your module.</p>
				</div>
			</div>

			<LessonEditor onSubmit={onSubmit} />
			
			{isPending && (
				<div className="fixed inset-0 bg-background/50 flex items-center justify-center z-50">
					<p className="text-lg font-semibold">Creating lesson...</p>
				</div>
			)}
		</div>
	);
}
