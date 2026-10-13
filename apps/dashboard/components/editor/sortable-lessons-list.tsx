"use client";

import { useState, useTransition, useEffect } from "react";
import Link from "next/link";
import { DragDropContext, Droppable, Draggable, type DropResult } from "@hello-pangea/dnd";
import { GripVertical, Pencil, FlaskConical, KeyRound } from "lucide-react";
import { Button } from "@nuru/ui/components/button";
import { cn } from "@nuru/ui/lib/utils";
import { reorderLessons, deleteLesson } from "@/app/actions/lessons";
import { useDict } from "@/components/providers/lang-provider";
import { ConfirmDelete } from "@/components/kanga/confirm-delete";
import { pick } from "@/lib/dict";

type LessonRow = { id: string; title: unknown; order: number | null; tests: unknown; solution: string | null };

export function SortableLessonsList({ lessons: initialLessons, moduleId }: { lessons: LessonRow[]; moduleId: string }) {
	const { t, lang } = useDict();
	const sortOrder = (rows: LessonRow[]) => [...rows].sort((a, b) => (a.order || 0) - (b.order || 0));
	const [lessons, setLessons] = useState(() => sortOrder(initialLessons));
	const [isPending, startTransition] = useTransition();

	useEffect(() => {
		setLessons(sortOrder(initialLessons));
	}, [initialLessons]);

	const handleDragEnd = (result: DropResult) => {
		if (!result.destination || result.destination.index === result.source.index) return;
		const items = Array.from(lessons);
		const [moved] = items.splice(result.source.index, 1);
		items.splice(result.destination.index, 0, moved);
		setLessons(items);
		startTransition(async () => {
			await reorderLessons(moduleId, items.map((item) => item.id));
		});
	};

	return (
		<DragDropContext onDragEnd={handleDragEnd}>
			<Droppable droppableId="lessons">
				{(provided) => (
					<ol {...provided.droppableProps} ref={provided.innerRef} className="space-y-3">
						{lessons.map((lesson, index) => {
							const tests = Array.isArray(lesson.tests) ? lesson.tests.length : 0;
							const title = pick(lesson.title, lang);
							return (
								<Draggable key={lesson.id} draggableId={lesson.id} index={index}>
									{(drag, snapshot) => (
										<li ref={drag.innerRef} {...drag.draggableProps} className={cn("relative", snapshot.isDragging && "z-50")}>
											<div
												className={cn(
													"flex items-center gap-2 rounded-lg border-2 border-mstari bg-card py-2 pr-2 pl-1 sm:gap-3",
													snapshot.isDragging ? "shadow-kivuli-lg -rotate-1" : "shadow-kivuli-sm",
												)}
											>
												<span {...drag.dragHandleProps} aria-label={t.modules.dragHint} title={t.modules.dragHint} className="flex h-10 w-7 shrink-0 cursor-grab items-center justify-center text-muted-foreground hover:text-foreground">
													<GripVertical className="size-5" />
												</span>
												<span className="flex size-9 shrink-0 items-center justify-center rounded-md border-2 border-mstari bg-jua font-display text-sm font-bold text-[#15120f]">{index + 1}</span>
												<div className="min-w-0 flex-1">
													<Link href={`/educator/modules/${moduleId}/lessons/${lesson.id}`} className="block truncate font-semibold hover:underline hover:decoration-jua hover:decoration-2 hover:underline-offset-4">
														{title.replace(/^\d+\.\s*/, "")}
													</Link>
													<div className="mt-0.5 flex items-center gap-3 text-xs text-muted-foreground">
														<span className={cn("inline-flex items-center gap-1", tests === 0 && "text-pilipili")}>
															<FlaskConical className="size-3.5" aria-hidden />
															{tests} {t.modules.tests}
														</span>
														{lesson.solution && (
															<span className="inline-flex items-center gap-1">
																<KeyRound className="size-3.5" aria-hidden />
																{t.editor.solution}
															</span>
														)}
													</div>
												</div>
												<Button asChild variant="outline" size="sm" className="h-10 sm:h-9">
													<Link href={`/educator/modules/${moduleId}/lessons/${lesson.id}`} aria-label={`${t.modules.edit}: ${title}`}>
														<Pencil />
														<span className="hidden sm:inline">{t.modules.edit}</span>
													</Link>
												</Button>
												<ConfirmDelete action={deleteLesson.bind(null, lesson.id, moduleId)} label={t.modules.delete} confirmLabel={t.modules.confirmDelete} />
											</div>
										</li>
									)}
								</Draggable>
							);
						})}
						{provided.placeholder}
						{isPending && <p className="lebo animate-pulse pt-1 text-center text-muted-foreground">{t.modules.savingOrder}</p>}
					</ol>
				)}
			</Droppable>
		</DragDropContext>
	);
}
