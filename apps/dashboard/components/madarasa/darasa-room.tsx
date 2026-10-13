"use client";

import { useCallback, useEffect, useRef, useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Archive, ArchiveRestore, ArrowLeft, Download, Loader2, Pencil, RefreshCw, Trash2, Users } from "lucide-react";

import { Button } from "@nuru/ui/components/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@nuru/ui/components/dialog";
import { cn } from "@nuru/ui/lib/utils";
import {
	deleteDarasa,
	getDarasaDetail,
	setDarasaArchived,
	updateDarasaModules,
	type AssignableModule,
	type DarasaDetail,
} from "@/app/actions/madarasa";
import { useDict } from "@/components/providers/lang-provider";
import { PageHead, EmptyState } from "@/components/kanga/page-head";
import { CodeDialog, type CodeTarget } from "./code-dialog";
import { JoinCode } from "./join-code";
import { LearnersList, ArmedButton } from "./learners-list";
import { ModulePicker } from "./module-picker";
import { GridLegend, ProgressGrid, gridCsv } from "./progress-grid";
import { madarasaStrings } from "./strings";

const REFRESH_MS = 15_000;

export function DarasaRoom({ initial, modules }: { initial: DarasaDetail; modules: AssignableModule[] }) {
	const { lang, t } = useDict();
	const s = madarasaStrings(lang);
	const router = useRouter();
	const [detail, setDetail] = useState(initial);
	const [loading, setLoading] = useState(false);
	const [target, setTarget] = useState<CodeTarget>(null);
	const [editing, setEditing] = useState(false);
	const [picked, setPicked] = useState<string[]>(initial.darasa.moduleIds);
	const [saving, startSave] = useTransition();
	const inflight = useRef(false);

	const refresh = useCallback(async () => {
		if (inflight.current) return;
		inflight.current = true;
		setLoading(true);
		try {
			setDetail(await getDarasaDetail(initial.darasa.id));
		} catch {
		} finally {
			inflight.current = false;
			setLoading(false);
		}
	}, [initial.darasa.id]);

	// Server-rendered updates (after revalidatePath) replace local state.
	useEffect(() => setDetail(initial), [initial]);

	// Live grid: poll every 15s while the tab is visible, and right away on return.
	useEffect(() => {
		const id = setInterval(() => document.visibilityState === "visible" && void refresh(), REFRESH_MS);
		const onVis = () => document.visibilityState === "visible" && void refresh();
		document.addEventListener("visibilitychange", onVis);
		return () => {
			clearInterval(id);
			document.removeEventListener("visibilitychange", onVis);
		};
	}, [refresh]);

	const d = detail.darasa;
	const lessons = detail.moduli.flatMap((m) => m.lessons);
	const totalPassed = detail.wanafunzi.reduce(
		(n, w) => n + lessons.filter((l) => detail.cells[w.id]?.[l.id]?.passed).length,
		0,
	);
	const avg = detail.wanafunzi.length && lessons.length ? Math.round((totalPassed / (detail.wanafunzi.length * lessons.length)) * 100) : 0;
	const time = new Date(detail.at).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", second: "2-digit" });

	function downloadCsv() {
		const blob = new Blob([gridCsv(detail, lang, s)], { type: "text/csv;charset=utf-8" });
		const url = URL.createObjectURL(blob);
		const a = document.createElement("a");
		a.href = url;
		a.download = `${d.name.replace(/[^\p{L}\p{N}]+/gu, "-").replace(/^-|-$/g, "") || "darasa"}-${d.code}.csv`;
		document.body.appendChild(a);
		a.click();
		a.remove();
		setTimeout(() => URL.revokeObjectURL(url), 1000);
	}

	const assigned = d.moduleIds.length
		? d.moduleIds.map((id) => modules.find((m) => m.id === id)).filter((m): m is AssignableModule => !!m)
		: null;

	return (
		<div className="space-y-8 pb-12">
			<div>
				<Link href="/educator/madarasa" className="lebo inline-flex items-center gap-1.5 text-muted-foreground hover:text-foreground">
					<ArrowLeft className="size-3.5" aria-hidden /> {s.back}
				</Link>
				<PageHead
					className="mt-3"
					eyebrow={
						<span className="inline-flex flex-wrap items-center gap-2">
							{s.eyebrow}
							{d.teacherName && (
								<span className="normal-case tracking-normal">
									· {s.teacher}: {d.teacherName}
								</span>
							)}
						</span>
					}
					title={
						<span className="inline-flex flex-wrap items-center gap-3">
							{d.name}
							{d.archivedAt && <span className="lebo rounded-sm border-2 border-mstari bg-karatasi-2 px-2 py-1 align-middle">{s.archived}</span>}
						</span>
					}
					lead={
						<span className="flex flex-wrap items-center gap-1.5">
							{(assigned ?? [{ id: "all", title: { sw: s.allPublic, en: s.allPublic } }]).map((m) => (
								<span key={m.id} className="lebo rounded-sm border-2 border-mstari bg-card px-1.5 py-0.5 text-foreground">
									{m.title[lang] || m.title.sw}
								</span>
							))}
							<Button variant="link" size="sm" className="h-7 px-1" onClick={() => setEditing(true)}>
								<Pencil /> {s.editModules}
							</Button>
						</span>
					}
				/>
			</div>

			{d.archivedAt && (
				<p className="rounded-lg border-2 border-mstari bg-karatasi-2 px-4 py-3 font-semibold">{s.archivedNote}</p>
			)}

			<div className="grid gap-6 xl:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)]">
				<JoinCode darasaId={d.id} code={d.code} name={d.name} s={s} archived={!!d.archivedAt} />
				<div className="grid grid-cols-3 gap-3 sm:gap-4 xl:grid-cols-1">
					<Stat label={s.statWanafunzi} value={detail.wanafunzi.length} tone="bg-jua" />
					<Stat label={s.statPassed} value={totalPassed} tone="bg-mwani text-white" />
					<Stat label={s.statAvg} value={`${avg}%`} hint={s.statAvgHint} tone="bg-bahari text-white" />
				</div>
			</div>

			<section aria-labelledby="gridi" className="space-y-4">
				<div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
					<div>
						<h2 id="gridi" className="font-display text-2xl font-extrabold tracking-tight">
							{s.grid}
						</h2>
						<p className="mt-1 max-w-2xl text-sm text-muted-foreground">{s.gridLead}</p>
					</div>
					<div className="flex flex-wrap items-center gap-2">
						<span className="lebo inline-flex items-center gap-1.5 text-muted-foreground" aria-live="polite">
							<span className={cn("size-2.5 rounded-full border border-mstari bg-mwani", !loading && "animate-pulse")} aria-hidden />
							{s.live} · {s.updated} <span suppressHydrationWarning>{time}</span>
						</span>
						<Button variant="outline" size="sm" className="h-10" onClick={() => void refresh()} disabled={loading}>
							{loading ? <Loader2 className="animate-spin" /> : <RefreshCw />} {s.refresh}
						</Button>
						<Button variant="outline" size="sm" className="h-10" onClick={downloadCsv} disabled={!detail.wanafunzi.length}>
							<Download /> {s.csv}
						</Button>
					</div>
				</div>
				<GridLegend s={s} />
				{detail.wanafunzi.length === 0 ? (
					<EmptyState icon={<Users />} title={s.noLearners} body={s.noLearnersBody} methali={t.app.methaliEmpty} />
				) : (
					<ProgressGrid detail={detail} lang={lang} s={s} onOpen={setTarget} />
				)}
			</section>

			{detail.wanafunzi.length > 0 && (
				<section aria-labelledby="wanafunzi" className="space-y-3">
					<h2 id="wanafunzi" className="font-display text-2xl font-extrabold tracking-tight">
						{s.learners} <span className="font-mono text-lg text-muted-foreground">({detail.wanafunzi.length})</span>
					</h2>
					<p className="max-w-2xl text-sm text-muted-foreground">{s.learnersLead}</p>
					<LearnersList learners={detail.wanafunzi} s={s} lang={lang} onChanged={() => void refresh()} />
				</section>
			)}

			<section aria-labelledby="mipangilio" className="rounded-lg border-2 border-dashed border-mstari p-5">
				<h2 id="mipangilio" className="lebo">
					{s.settings}
				</h2>
				<div className="mt-3 flex flex-wrap gap-2">
					<Button variant="outline" className="h-11" onClick={() => setEditing(true)}>
						<Pencil /> {s.editModules}
					</Button>
					{d.archivedAt ? (
						<Button
							variant="outline"
							className="h-11"
							onClick={async () => {
								await setDarasaArchived(d.id, false);
								void refresh();
							}}
						>
							<ArchiveRestore /> {s.unarchive}
						</Button>
					) : (
						<ArmedButton
							icon={<Archive />}
							label={s.archive}
							confirmLabel={s.archiveConfirm}
							action={async () => {
								await setDarasaArchived(d.id, true);
								await refresh();
							}}
						/>
					)}
					<ArmedButton
						danger
						icon={<Trash2 />}
						label={s.delete}
						confirmLabel={s.deleteConfirm}
						action={async () => {
							await deleteDarasa(d.id);
							router.push("/educator/madarasa");
						}}
					/>
				</div>
			</section>

			<CodeDialog target={target} onClose={() => setTarget(null)} s={s} />

			<Dialog open={editing} onOpenChange={(o) => { setEditing(o); if (o) setPicked(d.moduleIds); }}>
				<DialogContent className="max-w-xl">
					<DialogHeader>
						<DialogTitle className="font-display text-xl">{s.modules}</DialogTitle>
					</DialogHeader>
					<p className="-mt-2 text-sm text-muted-foreground">{s.modulesHint}</p>
					<div className="max-h-[55dvh] overflow-y-auto p-1">
						<ModulePicker modules={modules} value={picked} onChange={setPicked} lang={lang} lessonsLabel={s.lessons} />
					</div>
					<DialogFooter className="gap-2">
						<Button variant="ghost" onClick={() => setEditing(false)}>
							{s.cancel}
						</Button>
						<Button
							disabled={saving}
							onClick={() =>
								startSave(async () => {
									await updateDarasaModules(d.id, picked);
									await refresh();
									setEditing(false);
								})
							}
						>
							{saving && <Loader2 className="animate-spin" />} {s.save}
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</div>
	);
}

function Stat({ label, value, hint, tone }: { label: string; value: number | string; hint?: string; tone: string }) {
	return (
		<div className="mji flex flex-col justify-between gap-2 overflow-hidden p-0">
			<div className={cn("border-b-2 border-mstari px-3 py-1.5 sm:px-4", tone)}>
				<p className="lebo leading-tight [overflow-wrap:anywhere]">{label}</p>
			</div>
			<div className="px-3 pb-3 sm:px-4">
				<p className="font-display text-[clamp(1.8rem,5vw,2.75rem)] leading-none font-extrabold tracking-tight">{value}</p>
				{hint && <p className="mt-1 hidden text-xs text-muted-foreground sm:block">{hint}</p>}
			</div>
		</div>
	);
}
