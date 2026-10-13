import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, BookOpen, Clock, Cpu, FlaskConical, Play } from "lucide-react";
import { Button } from "@nuru/ui/components/button";
import { getModuleWithLessons } from "@/app/actions/modules";
import { getServerDict } from "@/lib/lang";
import { difficultyKey, pick } from "@/lib/dict";
import { PageHead } from "@/components/shared/page-head";
import { DifficultySticker } from "@/components/shared/stickers";

export const dynamic = "force-dynamic";

const PLAYGROUND_URL = process.env.PLAYGROUND_URL || "http://localhost:3000";

export default async function MarketplaceModulePage({ params }: { params: Promise<{ moduleId: string }> }) {
	const { moduleId } = await params;
	const [module, { t, lang }] = await Promise.all([getModuleWithLessons(moduleId), getServerDict()]);

	if (!module || module.visibility !== "public") notFound();

	const title = pick(module.title, lang);
	const other = pick(module.title, lang === "sw" ? "en" : "sw");
	const startHref = `${PLAYGROUND_URL}/${lang}/anza/${module.slug}`;
	const testCount = module.lessons.reduce((n, l) => n + (Array.isArray(l.tests) ? l.tests.length : 0), 0);

	return (
		<div className="space-y-8 pb-12">
			<Link href="/marketplace" className="lebo inline-flex min-h-10 items-center gap-1.5 text-muted-foreground hover:text-foreground">
				<ArrowLeft className="size-4" />
				{t.soko.back}
			</Link>

			<PageHead
				eyebrow={<DifficultySticker value={module.difficulty} t={t} />}
				title={title}
				lead={other !== title ? other : undefined}
				actions={
					module.lessons.length > 0 && (
						<Button asChild size="lg">
							<a href={startHref} target="_blank" rel="noopener">
								<Play className="fill-current" />
								{t.soko.start}
							</a>
						</Button>
					)
				}
			/>

			<div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
				<div className="space-y-8 lg:col-span-2">
					<section className="kadi p-5">
						<h2 className="mb-2 font-display text-xl font-bold">{t.soko.about}</h2>
						<p className="text-muted-foreground">{t.soko.aboutBody.replace("{level}", t.difficulty[difficultyKey(module.difficulty)])}</p>
					</section>

					<section>
						<h2 className="mb-4 font-display text-xl font-bold">{t.soko.syllabus}</h2>
						{module.lessons.length === 0 ? (
							<p className="text-muted-foreground italic">{t.soko.noLessons}</p>
						) : (
							<ol className="space-y-3">
								{module.lessons.map((lesson, index) => {
									const desc = pick(lesson.task ?? lesson.description, lang);
									return (
										<li key={lesson.id} className="flex items-start gap-3 rounded-lg border-2 border-mstari bg-card p-3 shadow-kivuli-sm">
											<span className="flex size-9 shrink-0 items-center justify-center rounded-md border-2 border-mstari bg-jua font-display text-sm font-bold text-[#15120f]">{index + 1}</span>
											<div className="min-w-0">
												<h3 className="font-semibold">{pick(lesson.title, lang).replace(/^\d+\.\s*/, "")}</h3>
												{desc && <p className="mt-0.5 line-clamp-2 text-sm text-muted-foreground">{desc.replace(/[`*#]/g, "")}</p>}
											</div>
										</li>
									);
								})}
							</ol>
						)}
					</section>
				</div>

				<aside>
					<div className="kadi overflow-hidden lg:sticky lg:top-6">
						<h2 className="lebo border-b-2 border-mstari bg-karatasi-2 px-4 py-2.5">{t.soko.details2}</h2>
						<dl className="divide-y-2 divide-dashed divide-mstari/20 px-4">
							{[
								[BookOpen, t.soko.syllabus, String(module.lessons.length)],
								[FlaskConical, t.editor.testsLabel, String(testCount)],
								[Clock, t.soko.time, `~${module.lessons.length * 15} ${t.soko.minutes}`],
								[Cpu, t.modules.runtime, module.executorType],
							].map(([Icon, label, value]) => {
								const I = Icon as typeof BookOpen;
								return (
									<div key={label as string} className="flex items-center justify-between gap-4 py-3">
										<dt className="inline-flex items-center gap-2 text-sm text-muted-foreground">
											<I className="size-4" aria-hidden />
											{label as string}
										</dt>
										<dd className="font-mono text-sm font-semibold">{value as string}</dd>
									</div>
								);
							})}
						</dl>
					</div>
				</aside>
			</div>
		</div>
	);
}
