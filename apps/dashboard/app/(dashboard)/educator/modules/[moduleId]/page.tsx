import { getModuleWithLessons } from "@/app/actions/modules";
import { deleteLesson } from "@/app/actions/lessons";
import { Button, Card, CardHeader, CardTitle, CardContent, Badge } from "@nuru/ui";
import Link from "next/link";
import { PlusCircle, FileText, Settings, ArrowLeft, Trash2 } from "lucide-react";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function ModuleBuilderPage({ params }: { params: Promise<{ moduleId: string }> }) {
    const { moduleId } = await params;
	const module = await getModuleWithLessons(moduleId);

	if (!module) {
		notFound();
	}

	const title = typeof module.title === 'string' ? module.title : (module.title as any).en;

	return (
		<div className="container mx-auto py-10 space-y-8">
            <div className="flex items-center gap-4">
                <Link href="/educator/modules">
                    <Button variant="outline" size="icon">
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                </Link>
                <div>
                    <h1 className="text-3xl font-bold flex items-center gap-3">
                        {title}
                        <Badge variant={module.visibility === 'public' ? 'secondary' : 'outline'} className="capitalize">{module.visibility}</Badge>
                    </h1>
                    <p className="text-muted-foreground">Course Builder</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-2 space-y-6">
                    <div className="flex justify-between items-center">
                        <h2 className="text-xl font-bold">Lessons Syllabus</h2>
                        <Link href={`/educator/modules/${module.id}/lessons/create`}>
                            <Button size="sm" className="gap-2">
                                <PlusCircle className="h-4 w-4" /> Add Lesson
                            </Button>
                        </Link>
                    </div>

                    {module.lessons.length === 0 ? (
                        <Card className="flex flex-col items-center justify-center p-12 text-center border-dashed">
                            <FileText className="h-10 w-10 text-muted-foreground mb-4" />
                            <h3 className="text-lg font-semibold">No lessons yet</h3>
                            <p className="text-muted-foreground max-w-sm mt-2 mb-4">
                                This module is empty. Add lessons to build out your curriculum.
                            </p>
                            <Link href={`/educator/modules/${module.id}/lessons/create`}>
                                <Button variant="outline">Create First Lesson</Button>
                            </Link>
                        </Card>
                    ) : (
                        <div className="space-y-3">
                            {module.lessons.map((lesson, index) => (
                                <Card key={lesson.id} className="flex items-center justify-between p-4 hover:border-primary/50 transition-colors">
                                    <div className="flex items-center gap-4">
                                        <div className="bg-muted text-muted-foreground w-8 h-8 rounded flex items-center justify-center font-mono text-sm">
                                            {index + 1}
                                        </div>
                                        <div>
                                            <h4 className="font-semibold">
                                                {typeof lesson.title === 'string' ? lesson.title : (lesson.title as any).en}
                                            </h4>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Link href={`/educator/modules/${module.id}/lessons/${lesson.id}`}>
                                            <Button variant="ghost" size="sm">Edit</Button>
                                        </Link>
                                        <form action={deleteLesson.bind(null, lesson.id, module.id)}>
                                            <Button type="submit" variant="ghost" size="sm" className="text-destructive hover:bg-destructive/10 px-2">
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </form>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    )}
                </div>

                <div className="space-y-6">
                    <Card>
                        <CardHeader className="bg-muted/10 border-b pb-4">
                            <CardTitle className="text-lg flex items-center justify-between">
                                <span className="flex items-center gap-2">
                                    <Settings className="h-5 w-5" /> Module Settings
                                </span>
                                <Link href={`/educator/modules/${module.id}/edit`}>
                                    <Button variant="ghost" size="sm" className="h-8 px-2">Edit</Button>
                                </Link>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4 pt-6">
                            <div>
                                <p className="text-sm font-semibold mb-1 text-muted-foreground">Difficulty</p>
                                <Badge variant="outline" className="capitalize">{module.difficulty}</Badge>
                            </div>
                            <div>
                                <p className="text-sm font-semibold mb-1 text-muted-foreground">Executor</p>
                                <p className="text-sm font-medium">{module.executorType}</p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
		</div>
	);
}
