"use client";

import { Check } from "lucide-react";
import { cn } from "@nuru/ui/lib/utils";
import type { DarasaDetail } from "@/app/actions/madarasa";
import type { Lang } from "@/lib/dict";
import type { MadarasaStrings } from "./strings";
import type { CodeTarget } from "./code-dialog";

/**
 * Learners x lessons. Cells: mwani = passed, chungwa = attempted, empty = not started.
 * The first column and the header stay put while the grid scrolls on a phone.
 */
export function ProgressGrid({
	detail,
	lang,
	s,
	onOpen,
}: {
	detail: DarasaDetail;
	lang: Lang;
	s: MadarasaStrings;
	onOpen: (t: NonNullable<CodeTarget>) => void;
}) {
	const lessons = detail.moduli.flatMap((m) => m.lessons.map((l) => ({ ...l, moduleId: m.id })));
	const title = (x: { sw: string; en: string }) => x[lang] || x.sw;

	if (!lessons.length) {
		return <p className="gridi rounded-lg border-2 border-dashed border-mstari p-8 text-center text-muted-foreground">{s.noLessons}</p>;
	}

	const perLesson = lessons.map((l) => detail.wanafunzi.filter((w) => detail.cells[w.id]?.[l.id]?.passed).length);

	return (
		<div className="overflow-x-auto rounded-lg border-2 border-mstari bg-card">
			<table className="border-separate border-spacing-0 text-sm">
				<thead>
					<tr>
						<th
							rowSpan={2}
							scope="col"
							className="sticky left-0 z-20 min-w-28 border-r-2 border-b-2 border-mstari bg-card px-3 py-2 text-left align-bottom sm:min-w-48"
						>
							<span className="lebo">{s.learner}</span>
						</th>
						{detail.moduli.map((m, i) =>
							m.lessons.length ? (
								<th
									key={m.id}
									colSpan={m.lessons.length}
									scope="colgroup"
									className={cn(
										"border-b border-mstari/30 px-2 pt-2 pb-1 text-left font-display text-[0.8rem] font-bold whitespace-nowrap",
										i > 0 && "border-l-2 border-l-mstari",
									)}
								>
									<span className="block max-w-[calc(var(--n)*2.5rem)] truncate" style={{ ["--n" as string]: m.lessons.length }} title={title(m.title)}>
										{title(m.title)}
									</span>
								</th>
							) : null,
						)}
						<th rowSpan={2} scope="col" className="border-b-2 border-l-2 border-mstari px-3 py-2 text-right align-bottom">
							<span className="lebo">{s.total}</span>
						</th>
					</tr>
					<tr>
						{detail.moduli.map((m, i) =>
							m.lessons.map((l, j) => (
								<th
									key={l.id}
									scope="col"
									title={title(l.title)}
									className={cn(
										"border-b-2 border-mstari px-1 pb-1.5 text-center font-mono text-[0.7rem] font-bold text-muted-foreground",
										i > 0 && j === 0 && "border-l-2 border-l-mstari",
									)}
								>
									{j + 1}
								</th>
							)),
						)}
					</tr>
				</thead>
				<tbody>
					{detail.wanafunzi.map((w) => {
						const row = detail.cells[w.id] ?? {};
						const done = lessons.filter((l) => row[l.id]?.passed).length;
						return (
							<tr key={w.id} className="group">
								<th
									scope="row"
									className="sticky left-0 z-10 border-r-2 border-b border-mstari border-b-mstari/15 bg-card px-3 py-1.5 text-left font-semibold group-hover:bg-karatasi-2"
								>
									<span className="block max-w-44 truncate">{w.displayName}</span>
								</th>
								{detail.moduli.map((m, i) =>
									m.lessons.map((l, j) => {
										const c = row[l.id];
										const status = c?.passed ? s.passed : c ? s.tried : s.notStarted;
										const label = `${w.displayName} · ${title(l.title)} · ${status}${c ? ` · ${c.attempts} ${c.attempts === 1 ? s.attempt : s.attempts}` : ""}`;
										return (
											<td
												key={l.id}
												className={cn(
													"border-b border-b-mstari/15 p-1 text-center group-hover:bg-karatasi-2",
													i > 0 && j === 0 && "border-l-2 border-l-mstari",
												)}
											>
												{c ? (
													<button
														type="button"
														title={label}
														aria-label={label}
														onClick={() => onOpen({ mwanafunziId: w.id, learnerName: w.displayName, lessonId: l.id, lessonTitle: title(l.title) })}
														className={cn(
															"flex size-8 items-center justify-center rounded-sm border-2 border-mstari font-mono text-[0.7rem] font-bold transition-transform hover:-translate-y-px hover:shadow-kivuli-sm",
															c.passed ? "bg-mwani text-white" : "bg-chungwa text-[#15120f]",
														)}
													>
														{c.passed ? (c.attempts > 1 ? c.attempts : <Check className="size-4" aria-hidden />) : c.attempts}
													</button>
												) : (
													<span title={label} aria-label={label} className="mx-auto block size-8 rounded-sm border-2 border-dashed border-mstari/25" />
												)}
											</td>
										);
									}),
								)}
								<td className="border-b border-l-2 border-mstari border-b-mstari/15 px-3 text-right font-mono font-bold whitespace-nowrap group-hover:bg-karatasi-2">
									{done}/{lessons.length}
								</td>
							</tr>
						);
					})}
				</tbody>
				{detail.wanafunzi.length > 1 && (
					<tfoot>
						<tr>
							<th scope="row" className="sticky left-0 z-10 border-t-2 border-r-2 border-mstari bg-karatasi-2 px-3 py-1.5 text-left">
								<span className="lebo">{s.legendPassed}</span>
							</th>
							{perLesson.map((n, k) => (
								<td key={lessons[k].id} className="border-t-2 border-mstari bg-karatasi-2 py-1.5 text-center font-mono text-[0.7rem] font-bold">
									{n}
								</td>
							))}
							<td className="border-t-2 border-l-2 border-mstari bg-karatasi-2" />
						</tr>
					</tfoot>
				)}
			</table>
		</div>
	);
}

export function GridLegend({ s }: { s: MadarasaStrings }) {
	return (
		<ul className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
			<li className="flex items-center gap-1.5">
				<span className="size-4 rounded-sm border-2 border-mstari bg-mwani" aria-hidden /> {s.legendPassed}
			</li>
			<li className="flex items-center gap-1.5">
				<span className="size-4 rounded-sm border-2 border-mstari bg-chungwa" aria-hidden /> {s.legendTried}
			</li>
			<li className="flex items-center gap-1.5">
				<span className="size-4 rounded-sm border-2 border-dashed border-mstari/40" aria-hidden /> {s.legendNone}
			</li>
		</ul>
	);
}

/** CSV of the grid: one row per learner, one column per lesson (passed / attempts / blank). */
export function gridCsv(detail: DarasaDetail, lang: Lang, s: MadarasaStrings) {
	const lessons = detail.moduli.flatMap((m) => m.lessons.map((l, j) => ({ ...l, label: `${m.title[lang] || m.title.sw} ${j + 1}. ${l.title[lang] || l.title.sw}` })));
	const esc = (v: string | number) => {
		const str = String(v);
		return /[",\n]/.test(str) ? `"${str.replace(/"/g, '""')}"` : str;
	};
	const header = [s.learner, ...lessons.map((l) => l.label), s.total];
	const rows = detail.wanafunzi.map((w) => {
		const row = detail.cells[w.id] ?? {};
		const cells = lessons.map((l) => {
			const c = row[l.id];
			if (!c) return "";
			return c.passed ? `${s.passed} (${c.attempts})` : `${s.tried} (${c.attempts})`;
		});
		const done = lessons.filter((l) => row[l.id]?.passed).length;
		return [w.displayName, ...cells, `${done}/${lessons.length}`];
	});
	return "﻿" + [header, ...rows].map((r) => r.map(esc).join(",")).join("\r\n");
}
