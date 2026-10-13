import Link from "next/link";
import type { ReactNode } from "react";
import { BookOpen, FlaskConical, ArrowRight } from "lucide-react";
import { cn } from "@nuru/ui/lib/utils";
import { pick, type Dict, type Lang } from "@/lib/dict";
import { DifficultySticker, VisibilitySticker, MODULE_ACCENTS, MODULE_FILLS } from "@/components/kanga/stickers";

export type ModuleSummary = {
	id: string;
	title: unknown;
	difficulty: string | null;
	visibility: string;
	lessons: { id: string; tests: unknown }[];
};

/** A module as an mji card: kanga band in the module's colour, title, counts and stickers. */
export function ModuleCard({ module, index, href, t, lang, footer, showVisibility = true }: { module: ModuleSummary; index: number; href: string; t: Dict; lang: Lang; footer?: ReactNode; showVisibility?: boolean }) {
	const title = pick(module.title, lang);
	const other = pick(module.title, lang === "sw" ? "en" : "sw");
	const lessonCount = module.lessons.length;
	const testCount = module.lessons.reduce((n, l) => n + (Array.isArray(l.tests) ? l.tests.length : 0), 0);
	const accent = MODULE_ACCENTS[index % MODULE_ACCENTS.length];
	const fill = MODULE_FILLS[index % MODULE_FILLS.length];

	return (
		<article className="mji group relative flex flex-col overflow-hidden">
			<div className={cn("flex items-center justify-between border-b-2 border-mstari px-4 py-2", fill, fill === "bg-jua" || fill === "bg-chungwa" || fill === "bg-zambarau" ? "text-[#15120f]" : "text-white")}>
				<span className="lebo">Moduli {String(index + 1).padStart(2, "0")}</span>
				<DifficultySticker value={module.difficulty} t={t} />
			</div>
			<div className={cn("pindo-nukta mt-2 opacity-70", accent)} aria-hidden />
			<div className="flex flex-1 flex-col gap-4 p-4 pt-3">
				<div>
					<h3 className="font-display text-xl font-bold leading-snug">
						<Link href={href} className="after:absolute after:inset-0 focus-visible:outline-none">
							{title}
						</Link>
					</h3>
					{other && other !== title && <p className="mt-0.5 text-sm text-muted-foreground">{other}</p>}
				</div>
				<div className="mt-auto flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
					<span className="inline-flex items-center gap-1.5 font-semibold">
						<BookOpen className="size-4" aria-hidden />
						<span className="font-display text-lg leading-none">{lessonCount}</span>
						<span className="text-muted-foreground">{lessonCount === 1 ? t.modules.lesson : t.modules.lessons}</span>
					</span>
					<span className="inline-flex items-center gap-1.5 font-semibold">
						<FlaskConical className="size-4" aria-hidden />
						<span className="font-display text-lg leading-none">{testCount}</span>
						<span className="text-muted-foreground">{t.modules.tests}</span>
					</span>
				</div>
			</div>
			<div className="relative z-10 flex items-center gap-2 border-t-2 border-mstari bg-karatasi-2 px-4 py-2">
				<Link href={href} tabIndex={-1} className="mr-auto inline-flex min-h-10 items-center gap-1 text-sm font-semibold group-hover:underline group-hover:decoration-jua group-hover:decoration-2 group-hover:underline-offset-4">
					{t.modules.manage}
					<ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
				</Link>
				{showVisibility && <VisibilitySticker value={module.visibility} t={t} />}
				{footer}
			</div>
		</article>
	);
}
