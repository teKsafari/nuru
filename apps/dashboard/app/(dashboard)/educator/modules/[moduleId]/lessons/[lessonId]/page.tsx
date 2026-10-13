import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { db, lessons, modules } from "@/lib/db";
import LessonEditor, { type LessonFormValues } from "@/components/editor/lesson-editor";
import { updateLesson } from "@/app/actions/lessons";
import { getServerDict } from "@/lib/lang";
import { pick } from "@/lib/dict";

export const dynamic = "force-dynamic";

function both(v: unknown) {
	if (typeof v === "string") return { sw: v, en: v };
	const o = (v ?? {}) as { sw?: string; en?: string };
	return { sw: o.sw ?? "", en: o.en ?? "" };
}

export default async function EditLessonPage({ params }: { params: Promise<{ moduleId: string; lessonId: string }> }) {
	const { moduleId, lessonId } = await params;

	const [lesson, module, { lang }] = await Promise.all([
		db.query.lessons.findFirst({ where: eq(lessons.id, lessonId) }),
		db.query.modules.findFirst({ where: eq(modules.id, moduleId), columns: { title: true } }),
		getServerDict(),
	]);

	if (!lesson || !module || lesson.moduleId !== moduleId) notFound();

	const initialData: LessonFormValues = {
		title: both(lesson.title),
		description: both(lesson.description),
		task: both(lesson.task),
		defaultCode: lesson.defaultCode ?? "",
		solution: lesson.solution ?? "",
		tests: (lesson.tests as LessonFormValues["tests"]) ?? [],
	};

	async function updateAction(data: LessonFormValues) {
		"use server";
		await updateLesson(lessonId, moduleId, data);
	}

	return <LessonEditor onSubmit={updateAction} initialData={initialData} isUpdate backHref={`/educator/modules/${moduleId}`} moduleTitle={pick(module.title, lang)} />;
}
