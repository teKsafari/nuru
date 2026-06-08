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
		<div className="space-y-8 pb-12">
            <div className="flex items-center gap-4">
                <Link href="/educator/modules">
                    <Button variant="ghost" size="icon" className="rounded-xl border bg-white dark:bg-slate-900 shadow-sm">
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                </Link>
                <div>
                    <h1 className="text-3xl font-extrabold tracking-tight flex items-center gap-3">
                        {title}
                        <Badge variant={module.visibility === 'public' ? 'secondary' : 'outline'} className="rounded-full px-3 py-0.5 text-[10px] font-bold uppercase tracking-wider capitalize">
                            {module.visibility}
                        </Badge>
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400">Course Builder & Syllabus</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                    <div className="flex justify-between items-center">
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Lessons Syllabus</h2>
                        <Link href={`/educator/modules/${module.id}/lessons/create`}>
                            <Button size="sm" variant="secondary" className="gap-2 rounded-lg font-bold shadow-sm border border-slate-200 dark:border-slate-800">
                                <PlusCircle className="h-4 w-4" /> Add Lesson
                            </Button>
                        </Link>
                    </div>

                    {module.lessons.length === 0 ? (
                        <Card className="flex flex-col items-center justify-center p-16 text-center border-dashed border-2 rounded-3xl bg-slate-50/50 dark:bg-slate-900/50">
                            <div className="bg-primary/10 rounded-2xl p-5 mb-5">
                                <FileText className="h-10 w-10 text-primary" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white">No lessons yet</h3>
                            <p className="text-slate-500 dark:text-slate-400 max-w-sm mt-2 mb-6">
                                This module is empty. Add lessons to build out your curriculum.
                            </p>
                            <Link href={`/educator/modules/${module.id}/lessons/create`}>
                                <Button variant="outline" className="rounded-xl px-6">Create First Lesson</Button>
                            </Link>
                        </Card>
                    ) : (
                        <div className="space-y-3">
                            {module.lessons.map((lesson, index) => (
                                <Card key={lesson.id} className="group flex items-center justify-between p-3 px-5 rounded-2xl border-slate-200 dark:border-slate-800 hover:border-primary/50 hover:shadow-md transition-all">
                                    <div className="flex items-center gap-4">
                                        <div className="bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs">
                                            {index + 1}
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-slate-900 dark:text-white">
                                                {typeof lesson.title === 'string' ? lesson.title : (lesson.title as any).en}
                                            </h4>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Link href={`/educator/modules/${module.id}/lessons/${lesson.id}`}>
                                            <Button variant="ghost" size="sm" className="rounded-lg font-bold">Edit</Button>
                                        </Link>
                                        <form action={deleteLesson.bind(null, lesson.id, module.id)}>
                                            <Button type="submit" variant="ghost" size="sm" className="text-slate-400 hover:text-destructive hover:bg-destructive/10 rounded-lg px-2">
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
                    <Card className="rounded-3xl border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
                        <CardHeader className="bg-slate-50/50 dark:bg-slate-800/30 border-b border-slate-100 dark:border-slate-800 py-3 px-5">
                            <CardTitle className="text-sm font-bold flex items-center justify-between">
                                <span className="flex items-center gap-2 text-slate-900 dark:text-white">
                                    <Settings className="h-4 w-4 text-slate-400" /> Module Settings
                                </span>
                                <Link href={`/educator/modules/${module.id}/edit`}>
                                    <Button variant="ghost" size="sm" className="h-7 px-2 rounded-lg text-[10px] font-bold">Edit</Button>
                                </Link>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4 p-5">
                            <div>
                                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1.5">Difficulty Level</p>
                                <Badge variant="outline" className="capitalize rounded-lg px-2.5 py-0.5 text-xs font-semibold bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700">{module.difficulty}</Badge>
                            </div>
                            <div>
                                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1.5">Runtime Environment</p>
                                <div className="flex items-center gap-2 text-sm font-bold text-slate-700 dark:text-slate-300">
                                    <div className="w-2 h-2 rounded-full bg-primary" />
                                    {module.executorType}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
		</div>
	);
}
