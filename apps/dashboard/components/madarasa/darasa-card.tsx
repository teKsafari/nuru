import Link from "next/link";
import { ArrowRight, CheckCircle2, Users } from "lucide-react";
import { cn } from "@nuru/ui/lib/utils";
import type { DarasaSummary } from "@/app/actions/madarasa";
import type { MadarasaStrings } from "./strings";

const ACCENTS = ["bg-jua", "bg-bahari", "bg-mwani", "bg-zambarau", "bg-chungwa", "bg-pilipili"];

export function DarasaCard({ d, index, s, showTeacher }: { d: DarasaSummary; index: number; s: MadarasaStrings; showTeacher: boolean }) {
	return (
		<Link
			href={`/educator/madarasa/${d.id}`}
			className={cn("kadi bonyeza group flex flex-col overflow-hidden", d.archivedAt && "opacity-70")}
		>
			<div className={cn("h-3 border-b-2 border-mstari", d.archivedAt ? "bg-karatasi-2" : ACCENTS[index % ACCENTS.length])} aria-hidden />
			<div className="flex flex-1 flex-col p-5">
				<div className="flex items-start justify-between gap-3">
					<h3 className="min-w-0 font-display text-xl leading-tight font-bold break-words">{d.name}</h3>
					{d.archivedAt ? (
						<span className="lebo shrink-0 rounded-sm border-2 border-mstari bg-karatasi-2 px-1.5 py-0.5">{s.archived}</span>
					) : null}
				</div>
				{showTeacher && d.teacherName && (
					<p className="mt-1 text-sm text-muted-foreground">
						{s.teacher}: {d.teacherName}
					</p>
				)}
				<p className="mt-4 inline-flex w-fit rounded-md border-2 border-mstari bg-karatasi-2 px-3 py-1.5 font-mono text-2xl font-bold tracking-[0.15em]">
					{d.code}
				</p>
				<div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
					<span className="inline-flex items-center gap-1.5">
						<Users className="size-4" aria-hidden />
						<strong>{d.wanafunzi}</strong> {s.wanafunzi}
					</span>
					<span className="inline-flex items-center gap-1.5">
						<CheckCircle2 className="size-4 text-mwani" aria-hidden />
						<strong>{d.passed}</strong> {s.passedShort}
					</span>
				</div>
				<span className="lebo mt-5 inline-flex items-center gap-1 self-end transition-transform group-hover:translate-x-0.5">
					{s.open} <ArrowRight className="size-3.5" aria-hidden />
				</span>
			</div>
		</Link>
	);
}
