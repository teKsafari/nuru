"use client";

import { useCallback, useEffect, useMemo, useState, useTransition, type ReactNode } from "react";
import Link from "next/link";
import { useForm, useFieldArray, useWatch, Controller, type FieldErrors } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useTheme } from "@wrksz/themes/client";
import { ArrowLeft, Check, Eye, FlaskConical, Loader2, PenLine, Plus, Save, ShieldCheck, Sparkles } from "lucide-react";
import { Label } from "@nuru/ui/components/label";
import { Input } from "@nuru/ui/components/input";
import { Button } from "@nuru/ui/components/button";
import { Textarea } from "@nuru/ui/components/textarea";
import { CodeEditor } from "@nuru/ui/components/code-editor";
import { nuru } from "@nuru/ui/lib/nuru-syntax";
import { cn } from "@nuru/ui/lib/utils";
import { testCaseSchema_v1, type TestCaseV1 } from "@nuru/ui/validation/test-cases";
import { gradeAll, kobeSignature, ubaoSignature, type GradeResult } from "@nuru/ui/validation/grader";
import { useDict } from "@/components/providers/lang-provider";
import type { Lang } from "@/lib/dict";
import { useNuruRunner, type Capture } from "./use-nuru-runner";
import { newOnly, testsFromRun } from "./generate-tests";
import { TestCard } from "./test-card";
import { VerifyPanel, type VerifyOutcome } from "./verify-panel";
import { LessonPreview } from "./lesson-preview";

type L = { sw: string; en: string };

export type LessonFormValues = {
	title: L;
	description: L;
	task: L;
	defaultCode: string;
	solution: string;
	tests: TestCaseV1[];
};

const extensions = [nuru];
const emptyL: L = { sw: "", en: "" };

export function emptyLesson(): LessonFormValues {
	return { title: { ...emptyL }, description: { ...emptyL }, task: { ...emptyL }, defaultCode: "", solution: "", tests: [] };
}

function Section({ n, title, help, children, action }: { n: string; title: string; help?: string; children: ReactNode; action?: ReactNode }) {
	return (
		<section className="mji overflow-hidden">
			<header className="flex flex-wrap items-center gap-x-3 gap-y-2 border-b-2 border-mstari bg-karatasi-2 px-4 py-2.5">
				<span className="lebo flex size-7 items-center justify-center rounded-sm border-2 border-mstari bg-card">{n}</span>
				<h2 className="font-display text-lg font-bold">{title}</h2>
				{action && <div className="ml-auto">{action}</div>}
			</header>
			<div className="space-y-4 p-4 sm:p-5">
				{help && <p className="-mt-1 text-sm text-muted-foreground">{help}</p>}
				{children}
			</div>
		</section>
	);
}

function LangTag({ lang, label }: { lang: Lang; label: string }) {
	return (
		<span className={cn("lebo inline-flex items-center gap-1 rounded-sm border-2 border-mstari px-1.5 py-0.5", lang === "sw" ? "bg-jua text-[#15120f]" : "bg-card text-muted-foreground")}>
			{lang}
			<span className="font-sans font-semibold normal-case tracking-normal">{label}</span>
		</span>
	);
}

export default function LessonEditor({
	onSubmit,
	initialData,
	isUpdate = false,
	backHref,
	moduleTitle,
}: {
	onSubmit: (data: LessonFormValues) => Promise<unknown>;
	initialData?: LessonFormValues;
	isUpdate?: boolean;
	backHref: string;
	moduleTitle?: string;
}) {
	const { t } = useDict();
	const e = t.editor;
	const { resolvedTheme } = useTheme();
	const theme = resolvedTheme === "dark" ? "dark" : "light";

	const schema = useMemo(
		() =>
			z.object({
				title: z.object({ sw: z.string().trim().min(1, e.titleRequired), en: z.string() }),
				description: z.object({ sw: z.string().trim().min(1, e.descRequired), en: z.string() }),
				task: z.object({ sw: z.string(), en: z.string() }),
				defaultCode: z.string(),
				solution: z.string(),
				tests: z.array(testCaseSchema_v1).min(1, e.testsRequired),
			}),
		[e],
	);

	const defaults = useMemo(() => {
		const d = initialData ?? emptyLesson();
		return { ...d, tests: d.tests.map((x) => ({ ...x, id: x.id || crypto.randomUUID(), isPublic: x.isPublic ?? true })) };
	}, [initialData]);

	const {
		register,
		control,
		handleSubmit,
		getValues,
		setValue,
		reset,
		formState: { errors, isDirty },
	} = useForm<LessonFormValues>({
		resolver: zodResolver(schema) as any,
		defaultValues: defaults,
	});

	const { fields, append, remove } = useFieldArray({ control, name: "tests", keyName: "_key" as "id" });
	const watched = useWatch({ control }) as LessonFormValues;
	const tests = (watched.tests ?? []) as TestCaseV1[];

	// ---- layout state ----
	const [mobileView, setMobileView] = useState<"edit" | "panel">("edit");
	const [panel, setPanel] = useState<"preview" | "verify">("preview");
	const [previewLang, setPreviewLang] = useState<Lang>("sw");

	// ---- save ----
	const [saving, startSave] = useTransition();
	const [savedAt, setSavedAt] = useState<number | null>(null);
	const [saveError, setSaveError] = useState<string | null>(null);
	const submit = handleSubmit(
		(data) =>
			startSave(async () => {
				setSaveError(null);
				try {
					await onSubmit(data);
					reset(data);
					setSavedAt(Date.now());
				} catch (err) {
					// Server action redirects surface as errors with a digest; let Next handle them.
					if (err && typeof err === "object" && "digest" in err && String((err as any).digest).startsWith("NEXT_REDIRECT")) throw err;
					setSaveError(err instanceof Error ? err.message : String(err));
				}
			}),
		(errs: FieldErrors<LessonFormValues>) => {
			setMobileView("edit");
			const first = errs.title ? "sec-title" : errs.description ? "sec-desc" : errs.tests ? "sec-tests" : null;
			if (first) document.getElementById(first)?.scrollIntoView({ behavior: "smooth", block: "start" });
		},
	);

	useEffect(() => {
		const onKey = (ev: KeyboardEvent) => {
			if ((ev.ctrlKey || ev.metaKey) && ev.key.toLowerCase() === "s") {
				ev.preventDefault();
				submit();
			}
		};
		window.addEventListener("keydown", onKey);
		return () => window.removeEventListener("keydown", onKey);
	}, [submit]);

	useEffect(() => {
		if (!isDirty) return;
		const warn = (ev: BeforeUnloadEvent) => {
			ev.preventDefault();
		};
		window.addEventListener("beforeunload", warn);
		return () => window.removeEventListener("beforeunload", warn);
	}, [isDirty]);

	// ---- Hakiki ----
	const { state: runnerState, capture } = useNuruRunner(t.verify);
	const [running, setRunning] = useState(false);
	const [outcome, setOutcome] = useState<VerifyOutcome | null>(null);
	const [verifyError, setVerifyError] = useState<string | null>(null);
	const [stdin, setStdin] = useState("");
	const [generating, setGenerating] = useState(false);
	const [genNote, setGenNote] = useState<string | null>(null);
	const [capturing, setCapturing] = useState<number | null>(null);

	const snapshotOf = (v: LessonFormValues) => JSON.stringify([v.solution, v.defaultCode, v.tests]);
	const stale = !!outcome && outcome.snapshot !== snapshotOf(watched);

	const verify = useCallback(async () => {
		const v = getValues();
		setVerifyError(null);
		setPanel("verify");
		if (!v.solution.trim()) {
			setVerifyError(t.verify.noSolution);
			return;
		}
		setRunning(true);
		try {
			const testsNow = v.tests.map((x) => ({ ...x }));
			const sol = await gradeAll(testsNow, v.solution, capture);
			const starter = testsNow.length ? await gradeAll(testsNow, v.defaultCode, capture) : null;
			// A solution that asks jaza() shows its output for the answers box, or the first io test's input.
			let plain = sol.plain as Capture;
			let plainInput: string[] | undefined;
			if (plain.status === "needs-input") {
				const io = testsNow.find((x) => x.type === "io" && x.input);
				plainInput = stdinLines() ?? io?.input?.split("\n");
				if (plainInput) plain = await capture(v.solution, plainInput);
			}
			setOutcome({
				snapshot: snapshotOf(v),
				tests: testsNow,
				plainInput,
				solution: { passed: sol.passed, results: sol.results, plain },
				starter: starter && { passed: starter.passed, results: starter.results },
			});
		} finally {
			setRunning(false);
		}
	}, [capture, getValues, t, stdin]);

	const stdinLines = () => (stdin.trim() ? stdin.replace(/\r\n/g, "\n").replace(/\n+$/, "").split("\n") : null);

	const generate = useCallback(async () => {
		const v = getValues();
		setGenNote(null);
		setVerifyError(null);
		if (!v.solution.trim()) {
			setVerifyError(t.verify.noSolution);
			setPanel("verify");
			return;
		}
		setGenerating(true);
		try {
			const lines = stdinLines();
			const r = await capture(v.solution, lines ?? undefined);
			if (r.status !== "ok" && r.stderr) setVerifyError(r.stderr);
			const fresh = newOnly(v.tests, testsFromRun(r, lines, t.verify));
			if (fresh.length) append(fresh, { shouldFocus: false });
			setGenNote(fresh.length ? `${fresh.length} ${t.verify.generated}` : t.verify.generatedNone);
		} finally {
			setGenerating(false);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [append, capture, getValues, stdin, t]);

	const captureFor = async (index: number) => {
		const v = getValues();
		const test = v.tests[index];
		if (!test || !v.solution.trim()) return;
		setCapturing(index);
		try {
			const lines = test.type === "io" ? (test.input ?? "").split("\n") : undefined;
			const r = await capture(v.solution, lines);
			let value = r.stdout;
			if (test.type === "kobe_picha") value = kobeSignature(r.events);
			if (test.type === "ubao_mfuatano") value = ubaoSignature(r.events);
			setValue(`tests.${index}.expectedOutput`, value, { shouldDirty: true });
		} finally {
			setCapturing(null);
		}
	};

	const resultFor = (test: TestCaseV1, i: number): GradeResult | undefined => {
		if (!outcome || stale) return undefined;
		return outcome.solution.results[test.id ?? String(i)];
	};

	const addTest = () =>
		append({ id: crypto.randomUUID(), type: "exact_output", expectedOutput: "", message: t.verify.msgExact, isPublic: true }, { shouldFocus: false });

	const passCount = outcome && !stale ? Object.values(outcome.solution.results).filter((r) => r.passed).length : null;

	// ---- render ----
	const bilingualInput = (name: "title", placeholder: { sw: string; en: string }) => (
		<div className="grid gap-4 md:grid-cols-2">
			{(["sw", "en"] as Lang[]).map((l) => (
				<div key={l} className="space-y-1.5">
					<Label htmlFor={`${name}-${l}`}>
						<LangTag lang={l} label={l === "sw" ? e.sw : e.en} />
					</Label>
					<Input id={`${name}-${l}`} {...register(`${name}.${l}`)} placeholder={placeholder[l]} className={cn(l === "sw" && errors[name]?.sw && "border-pilipili")} />
					{l === "sw" && errors[name]?.sw && <p className="text-sm font-semibold text-pilipili">{errors[name]?.sw?.message}</p>}
				</div>
			))}
		</div>
	);

	const bilingualText = (name: "description" | "task", rows: number, mono = false) => (
		<div className="grid gap-4 md:grid-cols-2">
			{(["sw", "en"] as Lang[]).map((l) => (
				<div key={l} className="space-y-1.5">
					<Label htmlFor={`${name}-${l}`} className="flex items-center justify-between">
						<LangTag lang={l} label={l === "sw" ? e.sw : e.en} />
						<button
							type="button"
							className="lebo hidden min-h-8 items-center gap-1 text-muted-foreground hover:text-foreground lg:inline-flex"
							onClick={() => {
								setPreviewLang(l);
								setPanel("preview");
							}}
						>
							<Eye className="size-3.5" />
							{e.tabPreview}
						</button>
					</Label>
					<Textarea
						id={`${name}-${l}`}
						rows={rows}
						{...register(`${name}.${l}`)}
						className={cn("resize-y leading-relaxed", mono && "font-mono text-[13px]", l === "sw" && name === "description" && errors.description?.sw && "border-pilipili")}
					/>
					{l === "sw" && name === "description" && errors.description?.sw && <p className="text-sm font-semibold text-pilipili">{errors.description.sw.message}</p>}
				</div>
			))}
		</div>
	);

	const previewPane = (
		<div className="space-y-4">
			<div className="flex items-center justify-between gap-2">
				<span className="lebo text-muted-foreground">{e.previewLang}</span>
				<div className="inline-flex rounded-md border-2 border-mstari bg-card p-0.5">
					{(["sw", "en"] as Lang[]).map((l) => (
						<button key={l} type="button" aria-pressed={previewLang === l} onClick={() => setPreviewLang(l)} className={cn("lebo min-h-8 min-w-10 rounded-[4px] px-2", previewLang === l ? "bg-jua text-[#15120f]" : "text-muted-foreground")}>
							{l}
						</button>
					))}
				</div>
			</div>
			<div className="rounded-md border-2 border-mstari bg-card p-4 sm:p-5">
				<LessonPreview
					title={(watched.title?.[previewLang] || watched.title?.sw || "").trim()}
					description={watched.description?.[previewLang] || watched.description?.sw || ""}
					task={watched.task?.[previewLang] || watched.task?.sw || ""}
					theme={theme}
					labels={{ task: previewLang === "sw" ? "Kazi yako" : "Your task", tryIt: previewLang === "sw" ? "Jaribu" : "Try it", empty: e.previewEmpty }}
				/>
			</div>
		</div>
	);

	const verifyPane = (
		<VerifyPanel
			t={t}
			runner={runnerState}
			running={running}
			outcome={outcome}
			stale={stale}
			error={verifyError}
			onRun={verify}
			onGenerate={generate}
			generating={generating}
			genNote={genNote}
			stdin={stdin}
			setStdin={setStdin}
		/>
	);

	return (
		<form onSubmit={submit} className="pb-16" noValidate>
			{/* Toolbar */}
			<div className="sticky top-[6.875rem] z-30 -mx-4 -mt-6 mb-6 border-b-2 border-mstari bg-karatasi px-4 py-3 sm:-mx-8 sm:-mt-10 sm:px-8 lg:top-0">
				<div className="flex flex-wrap items-center gap-3">
					<Link href={backHref} className="inline-flex size-10 shrink-0 items-center justify-center rounded-md border-2 border-mstari bg-card hover:bg-karatasi-2" aria-label={e.back} title={e.back}>
						<ArrowLeft className="size-4" />
					</Link>
					<div className="min-w-0 flex-1">
						{moduleTitle && <p className="lebo truncate text-muted-foreground">{moduleTitle}</p>}
						<h1 className="truncate font-display text-xl font-extrabold sm:text-2xl">{(watched.title?.sw || "").trim() || (isUpdate ? e.editLesson : e.newLesson)}</h1>
					</div>
					<span className={cn("lebo hidden items-center gap-1 sm:inline-flex", isDirty ? "text-chungwa" : "text-muted-foreground")} aria-live="polite">
						{isDirty ? e.unsaved : savedAt ? (
							<>
								<Check className="size-3.5" />
								{e.saved}
							</>
						) : null}
					</span>
					<Button type="submit" size="lg" disabled={saving || (isUpdate && !isDirty)} className="shrink-0">
						{saving ? <Loader2 className="animate-spin" /> : <Save />}
						<span className="hidden sm:inline">{saving ? e.saving : e.save}</span>
						<span className="sm:hidden">{e.saveShort}</span>
					</Button>
				</div>
				{saveError && <p className="mt-2 text-sm font-semibold text-pilipili">{saveError}</p>}

				{/* Phone and tablet: switch between the form and the side panel */}
				<div className="mt-3 grid grid-cols-3 gap-1 rounded-md border-2 border-mstari bg-card p-0.5 lg:hidden" role="tablist">
					{(
						[
							["edit", null, PenLine, e.tabEdit],
							["panel", "preview", Eye, e.tabPreview],
							["panel", "verify", ShieldCheck, e.tabVerify],
						] as const
					).map(([view, p, Icon, label]) => {
						const active = mobileView === view && (p === null || panel === p);
						return (
							<button
								key={label}
								type="button"
								role="tab"
								aria-selected={active}
								onClick={() => {
									setMobileView(view);
									if (p) setPanel(p);
								}}
								className={cn("flex min-h-10 items-center justify-center gap-1.5 rounded-[4px] text-sm font-semibold", active ? "bg-jua text-[#15120f]" : "text-muted-foreground")}
							>
								<Icon className="size-4" />
								{label}
							</button>
						);
					})}
				</div>
			</div>

			<div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,26rem)] xl:grid-cols-[minmax(0,1fr)_minmax(0,30rem)]">
				{/* Form */}
				<div className={cn("min-w-0 space-y-6", mobileView !== "edit" && "hidden lg:block")}>
					<div id="sec-title" className="scroll-mt-40">
						<Section n="01" title={e.titleLabel}>
							{bilingualInput("title", { sw: "Kutoa matokeo (andika)", en: "Printing output (andika)" })}
						</Section>
					</div>
					<div id="sec-desc" className="scroll-mt-40">
						<Section n="02" title={e.descLabel} help={e.descHelp}>
							{bilingualText("description", 12, true)}
						</Section>
					</div>
					<Section n="03" title={e.taskLabel} help={e.taskHelp}>
						{bilingualText("task", 3)}
					</Section>
					<Section n="04" title={`${e.starter} · ${e.solution}`}>
						<div className="grid gap-4 xl:grid-cols-2">
							{(
								[
									["defaultCode", e.starter, e.starterHelp, "anza.nr"],
									["solution", e.solution, e.solutionHelp, "suluhisho.nr"],
								] as const
							).map(([name, label, help, file]) => (
								<div key={name} className="min-w-0 space-y-1.5">
									<div className="flex items-baseline justify-between gap-2">
										<Label className="font-semibold">{label}</Label>
										<span className="lebo text-muted-foreground">{file}</span>
									</div>
									<p className="text-xs text-muted-foreground">{help}</p>
									<Controller
										control={control}
										name={name}
										render={({ field }) => (
											<div className={cn("h-64 overflow-hidden rounded-md border-2 border-mstari bg-[var(--editor-bg)] text-[14px]", name === "solution" && "border-mwani")}>
												<CodeEditor code={field.value} onChange={field.onChange} extensions={extensions} theme={theme} />
											</div>
										)}
									/>
								</div>
							))}
						</div>
					</Section>
					<div id="sec-tests" className="scroll-mt-40">
						<Section
							n="05"
							title={e.testsLabel}
							help={e.testsHelp}
							action={
								passCount !== null && (
									<span className={cn("lebo rounded-sm border-2 border-mstari px-1.5 py-0.5", outcome?.solution.passed ? "bg-mwani text-white" : "bg-pilipili text-[#15120f]")}>
										{passCount}/{outcome?.tests.length}
									</span>
								)
							}
						>
							{fields.length === 0 && (
								<div className="gridi flex flex-col items-center gap-2 rounded-md border-2 border-dashed border-mstari/50 p-6 text-center">
									<FlaskConical className="size-6 text-muted-foreground" />
									<p className="text-sm text-muted-foreground">{t.verify.noTests}</p>
								</div>
							)}
							<div className="space-y-4">
								{fields.map((field, index) => (
									<TestCard
										key={(field as any)._key}
										index={index}
										value={tests[index] ?? (field as TestCaseV1)}
										control={control}
										register={register}
										onRemove={() => remove(index)}
										onCapture={() => captureFor(index)}
										capturing={capturing === index}
										canCapture={runnerState === "ready" && !!watched.solution?.trim()}
										result={tests[index] ? resultFor(tests[index], index) : undefined}
										t={t}
									/>
								))}
							</div>
							{errors.tests?.message && <p className="text-sm font-semibold text-pilipili">{errors.tests.message}</p>}
							{errors.tests?.root?.message && <p className="text-sm font-semibold text-pilipili">{errors.tests.root.message}</p>}
							<div className="flex flex-wrap gap-2">
								<Button type="button" variant="outline" onClick={addTest}>
									<Plus />
									{e.addTest}
								</Button>
								<Button type="button" variant="ghost" onClick={generate} disabled={generating || runnerState !== "ready"}>
									{generating ? <Loader2 className="animate-spin" /> : <Sparkles />}
									{t.verify.generate}
								</Button>
							</div>
							{genNote && <p className="text-sm font-semibold">{genNote}</p>}
						</Section>
					</div>
				</div>

				{/* Side panel: preview and Hakiki */}
				<aside className={cn("min-w-0", mobileView !== "panel" && "hidden lg:block")}>
					<div className="mji overflow-hidden lg:sticky lg:top-24">
						<div className="hidden grid-cols-2 border-b-2 border-mstari lg:grid" role="tablist">
							{(
								[
									["preview", Eye, e.tabPreview],
									["verify", ShieldCheck, e.tabVerify],
								] as const
							).map(([p, Icon, label]) => (
								<button
									key={p}
									type="button"
									role="tab"
									aria-selected={panel === p}
									onClick={() => setPanel(p)}
									className={cn("flex min-h-11 items-center justify-center gap-2 font-semibold first:border-r-2 first:border-mstari", panel === p ? "bg-jua text-[#15120f]" : "bg-karatasi-2 text-muted-foreground hover:text-foreground")}
								>
									<Icon className="size-4" />
									{label}
									{p === "verify" && passCount !== null && <span className="font-mono text-xs">{passCount}/{outcome?.tests.length}</span>}
								</button>
							))}
						</div>
						<div className="max-h-none overflow-y-auto p-4 sm:p-5 lg:max-h-[calc(100dvh-9rem)]">{panel === "preview" ? previewPane : verifyPane}</div>
					</div>
				</aside>
			</div>
		</form>
	);
}
