import { db, lessons, modules } from "@/lib/db";
import { eq, and } from "drizzle-orm";
import { notFound, redirect } from "next/navigation";
import LessonEditor, { type LessonFormInputs } from "@/components/editor/lesson-editor";
import { updateLesson } from "@/app/actions/lessons";
import { Button } from "@nuru/ui";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function EditLessonPage({ 
    params 
}: { 
    params: Promise<{ moduleId: string, lessonId: string }> 
}) {
    const { moduleId, lessonId } = await params;

    const lesson = await db.query.lessons.findFirst({
        where: eq(lessons.id, lessonId),
    });

    if (!lesson || lesson.moduleId !== moduleId) {
        notFound();
    }

    const initialData: LessonFormInputs = {
        title: typeof lesson.title === 'string' ? lesson.title : (lesson.title as any).en,
        description: typeof lesson.description === 'string' ? lesson.description : (lesson.description as any).en,
        task: typeof lesson.task === 'string' ? lesson.task : (lesson.task as any).en,
        defaultCodeTemplate: lesson.defaultCode || "",
        testCases: lesson.tests as any || [],
    };

    async function updateAction(data: LessonFormInputs) {
        "use server";
        
        await updateLesson(lessonId, moduleId, {
            title: { en: data.title, sw: data.title },
            description: { en: data.description, sw: data.description },
            task: { en: data.task, sw: data.task },
            defaultCode: data.defaultCodeTemplate,
            tests: data.testCases,
        });

        redirect(`/educator/modules/${moduleId}`);
    }

    return (
        <div className="container mx-auto py-10 space-y-6">
            <div className="flex items-center gap-4">
                <Link href={`/educator/modules/${moduleId}`}>
                    <Button variant="outline" size="icon">
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                </Link>
                <div>
                    <h1 className="text-3xl font-bold">Edit Lesson</h1>
                    <p className="text-muted-foreground">Modify lesson content, tasks, and test cases.</p>
                </div>
            </div>

            <LessonEditor 
                onSubmit={updateAction} 
                initialData={initialData} 
                isUpdate={true} 
            />
        </div>
    );
}
