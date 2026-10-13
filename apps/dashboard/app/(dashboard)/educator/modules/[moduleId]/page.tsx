import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, FileText, Pencil, Plus, ExternalLink, Cpu } from "lucide-react";
import { Button } from "@nuru/ui/components/button";
import { getOwnedModuleWithLessons } from "@/lib/modules.server";
import { getServerDict } from "@/lib/lang";
import { pick } from "@/lib/dict";
import { SortableLessonsList } from "@/components/editor/sortable-lessons-list";
import { PageHead, EmptyState } from "@/components/shared/page-head";
import { DifficultySticker, VisibilitySticker } from "@/components/shared/stickers";

export const dynamic = "force-dynamic";

const PLAYGROUND_URL = process.env.PLAYGROUND_URL || "http://localhost:3000";

export default async function ModuleBuilderPage({ params }: { params: Promise<{ moduleId: string }> }) {
	const { moduleId } = await params;
	const [module, { t, lang }] = await Promise.all([getOwnedModuleWithLessons(moduleId), getServerDict()]);

	if (!module) notFound();

	const title = pick(module.title, lang);
	const other = pick(module.title, lang === "sw" ? "en" : "sw");
	const testCount = module.lessons.reduce((n, l) => n + (Array.isArray(l.tests) ? l.tests.length : 0), 0);

	return (
		<div className="space-y-8 pb-12">
			<Link href="/educator/modules" className="lebo inline-flex min-h-10 items-center gap-1.5 text-muted-foreground hover:text-foreground">
				<ArrowLeft className="size-4" />
				{t.modules.back}
			</Link>

			<PageHead
				eyebrow={
					<span className="flex flex-wrap items-center gap-2">
						<DifficultySticker value={module.difficulty} t={t} />
						<VisibilitySticker value={module.visibility} t={t} />
					</span>
				}
				title={title}
				lead={other !== title ? other : undefined}
				actions={
					<Button asChild size="lg">
						<Link href={`/educator/modules/${module.id}/lessons/create`}>
							<Plus />
							{t.modules.addLesson}
						</Link>
					</Button>
				}
			/>

			<div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
				<section className="space-y-4 lg:col-span-2">
					<div className="flex items-baseline justify-between">
						<h2 className="font-display text-xl font-bold">{t.modules.syllabus}</h2>
						<span className="lebo text-muted-foreground">
							{module.lessons.length} {t.modules.lessons} · {testCount} {t.modules.tests}
						</span>
					</div>
					{module.lessons.length === 0 ? (
						<EmptyState
							icon={<FileText />}
							title={t.modules.noLessons}
							body={t.modules.noLessonsBody}
							action={
								<Button asChild variant="outline">
									<Link href={`/educator/modules/${module.id}/lessons/create`}>
										<Plus />
										{t.modules.addLesson}
									</Link>
								</Button>
							}
						/>
					) : (
						<SortableLessonsList lessons={module.lessons} moduleId={module.id} />
					)}
				</section>

				<aside className="space-y-6">
					<div className="kadi overflow-hidden">
						<div className="flex items-center justify-between border-b-2 border-mstari bg-karatasi-2 px-4 py-2">
							<h2 className="lebo">{t.modules.settings}</h2>
							<Button asChild variant="ghost" size="sm">
								<Link href={`/educator/modules/${module.id}/edit`}>
									<Pencil />
									{t.modules.edit}
								</Link>
							</Button>
						</div>
						<dl className="divide-y-2 divide-dashed divide-mstari/20 px-4">
							<div className="flex items-center justify-between gap-4 py-3">
								<dt className="text-sm text-muted-foreground">{t.modules.difficulty}</dt>
								<dd>
									<DifficultySticker value={module.difficulty} t={t} />
								</dd>
							</div>
							<div className="flex items-center justify-between gap-4 py-3">
								<dt className="text-sm text-muted-foreground">{t.modules.visibility}</dt>
								<dd>
									<VisibilitySticker value={module.visibility} t={t} />
								</dd>
							</div>
							<div className="flex items-center justify-between gap-4 py-3">
								<dt className="text-sm text-muted-foreground">{t.modules.runtime}</dt>
								<dd className="inline-flex items-center gap-1.5 font-mono text-sm font-semibold">
									<Cpu className="size-4" aria-hidden />
									{module.executorType}
								</dd>
							</div>
						</dl>
					</div>
					{module.lessons.length > 0 && (
						<Button asChild variant="outline" className="w-full">
							<a href={`${PLAYGROUND_URL}/${lang}/anza/${module.slug}`} target="_blank" rel="noopener">
								<ExternalLink />
								{t.modules.openInPlayground}
							</a>
						</Button>
					)}
				</aside>
			</div>
		</div>
	);
}
