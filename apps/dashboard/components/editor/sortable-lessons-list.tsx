"use client";

import { useState, useTransition, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { Card } from "@nuru/ui/components/card";
import { Button } from "@nuru/ui/components/button";
import { GripVertical, Trash2 } from "lucide-react";
import Link from "next/link";
import { reorderLessons, deleteLesson } from "@/app/actions/lessons";
import { cn } from "@nuru/ui/lib/utils";

export function SortableLessonsList({ 
    lessons: initialLessons, 
    moduleId 
}: { 
    lessons: any[], 
    moduleId: string 
}) {
    // Sort initial lessons by order
    const sortedInitial = [...initialLessons].sort((a, b) => (a.order || 0) - (b.order || 0));
    const [lessons, setLessons] = useState(sortedInitial);
    const [isPending, startTransition] = useTransition();

    // Sync state if initialLessons change (e.g. after a delete)
    useEffect(() => {
        setLessons([...initialLessons].sort((a, b) => (a.order || 0) - (b.order || 0)));
    }, [initialLessons]);

    const handleDragEnd = (result: any) => {
        if (!result.destination) return;

        const items = Array.from(lessons);
        const [reorderedItem] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, reorderedItem);

        // Optimistic update
        setLessons(items);

        // Sync with server
        startTransition(async () => {
            const orderedIds = items.map((item) => item.id);
            await reorderLessons(moduleId, orderedIds);
        });
    };

    return (
        <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="lessons">
                {(provided) => (
                    <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-3">
                        {lessons.map((lesson, index) => (
                            <Draggable key={lesson.id} draggableId={lesson.id} index={index}>
                                {(provided, snapshot) => (
                                    <div
                                        ref={provided.innerRef}
                                        {...provided.draggableProps}
                                        className={cn(
                                            snapshot.isDragging ? "opacity-90 scale-[1.02] shadow-lg z-50" : "",
                                            "relative transition-all"
                                        )}
                                    >
                                        <Card className="group flex items-center justify-between p-3 px-5 rounded-2xl border-slate-200 dark:border-slate-800 hover:border-primary/50 hover:shadow-md transition-all bg-white dark:bg-slate-900">
                                            <div className="flex items-center gap-4">
                                                <div 
                                                    {...provided.dragHandleProps} 
                                                    className="cursor-grab hover:text-primary transition-colors text-slate-400 -ml-2 p-1 rounded-md hover:bg-slate-50 dark:hover:bg-slate-800"
                                                >
                                                    <GripVertical className="h-5 w-5" />
                                                </div>
                                                <div className="bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs">
                                                    {index + 1}
                                                </div>
                                                <div>
                                                    <h4 className="font-bold text-slate-900 dark:text-white">
                                                        {typeof lesson.title === 'string' ? lesson.title : lesson.title?.en}
                                                    </h4>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Link href={`/educator/modules/${moduleId}/lessons/${lesson.id}`}>
                                                    <Button variant="ghost" size="sm" className="rounded-lg font-bold">Edit</Button>
                                                </Link>
                                                <form action={deleteLesson.bind(null, lesson.id, moduleId)}>
                                                    <Button type="submit" variant="ghost" size="sm" className="text-slate-400 hover:text-destructive hover:bg-destructive/10 rounded-lg px-2">
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </form>
                                            </div>
                                        </Card>
                                    </div>
                                )}
                            </Draggable>
                        ))}
                        {provided.placeholder}
                        {isPending && (
                            <div className="flex justify-center pt-2">
                                <p className="text-xs font-semibold text-slate-400 animate-pulse">Saving order...</p>
                            </div>
                        )}
                    </div>
                )}
            </Droppable>
        </DragDropContext>
    );
}
