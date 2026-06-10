import { getModuleWithLessons } from "@/app/actions/modules";
import { Button } from "@nuru/ui/components/button";
import { Card, CardHeader, CardTitle, CardContent } from "@nuru/ui/components/card";
import { Badge } from "@nuru/ui/components/badge";
import Link from "next/link";
import { Play, ArrowLeft, BookOpen, Clock, FileText } from "lucide-react";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function MarketplaceModulePage({ params }: { params: Promise<{ moduleId: string }> }) {
    const { moduleId } = await params;
	const module = await getModuleWithLessons(moduleId);

	if (!module) {
		notFound();
	}

	const title = typeof module.title === 'string' ? module.title : (module.title as any).en;

    // Determine playground URL based on environment or fallback to relative/localhost for dev
    const playgroundUrl = process.env.PLAYGROUND_URL || "http://localhost:3001";

	return (
		<div className="container mx-auto py-10 space-y-8 max-w-4xl">
            <div className="flex items-center gap-4">
                <Link href="/marketplace">
                    <Button variant="outline" size="icon">
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                </Link>
                <div className="flex-1">
                    <Badge className="mb-2 bg-primary/20 text-primary hover:bg-primary/30">
                        {module.difficulty}
                    </Badge>
                    <h1 className="text-3xl font-bold flex items-center gap-3">
                        {title}
                    </h1>
                </div>
                <Button size="lg" className="gap-2" asChild>
                    <a href={`${playgroundUrl}/playground?module=${module.id}`} target="_blank" rel="noopener noreferrer">
                        <Play className="h-5 w-5 fill-current" /> Start Module
                    </a>
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-2 space-y-8">
                    <section>
                        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                            <BookOpen className="h-5 w-5 text-muted-foreground" />
                            About this Module
                        </h2>
                        <div className="prose dark:prose-invert">
                            <p className="text-lg text-muted-foreground">
                                This interactive programming module is designed for {module.difficulty} learners.
                                It uses the {module.executorType} executor to provide a hands-on learning experience.
                            </p>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                            <FileText className="h-5 w-5 text-muted-foreground" />
                            Syllabus
                        </h2>
                        
                        {module.lessons.length === 0 ? (
                            <p className="text-muted-foreground italic">No lessons have been added to this module yet.</p>
                        ) : (
                            <div className="space-y-4">
                                {module.lessons.map((lesson, index) => (
                                    <Card key={lesson.id} className="overflow-hidden">
                                        <div className="flex items-start p-4 gap-4">
                                            <div className="bg-primary/10 text-primary w-8 h-8 rounded-full flex items-center justify-center font-bold shrink-0 mt-0.5">
                                                {index + 1}
                                            </div>
                                            <div>
                                                <h4 className="font-semibold text-lg mb-1">
                                                    {typeof lesson.title === 'string' ? lesson.title : (lesson.title as any).en}
                                                </h4>
                                                <p className="text-muted-foreground line-clamp-2 text-sm">
                                                    Learn and practice core concepts through interactive tasks.
                                                </p>
                                            </div>
                                        </div>
                                    </Card>
                                ))}
                            </div>
                        )}
                    </section>
                </div>

                <div>
                    <Card>
                        <CardHeader>
                            <CardTitle>Module Details</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex justify-between items-center py-2 border-b">
                                <span className="text-muted-foreground text-sm flex items-center gap-2">
                                    <BookOpen className="h-4 w-4" /> Lessons
                                </span>
                                <span className="font-semibold">{module.lessons.length}</span>
                            </div>
                            <div className="flex justify-between items-center py-2 border-b">
                                <span className="text-muted-foreground text-sm flex items-center gap-2">
                                    <Clock className="h-4 w-4" /> Est. Time
                                </span>
                                <span className="font-semibold">~{module.lessons.length * 15} mins</span>
                            </div>
                            <div className="flex justify-between items-center py-2 border-b">
                                <span className="text-muted-foreground text-sm">Executor</span>
                                <Badge variant="secondary">{module.executorType}</Badge>
                            </div>
                            <div className="pt-4">
                                <Button className="w-full gap-2" asChild>
                                    <a href={`${playgroundUrl}/playground?module=${module.id}`} target="_blank" rel="noopener noreferrer">
                                        <Play className="h-4 w-4 fill-current" /> Start Learning
                                    </a>
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
		</div>
	);
}
