"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
	ArrowRight,
	BookOpen,
	Check,
	ChevronLeft,
	ChevronRight,
	Code2,
	Eye,
	Lightbulb,
	MoreHorizontal,
	Play,
	RotateCcw,
	Send,
	Square,
	SquareTerminal,
} from "lucide-react";
import { Button } from "@nuru/ui/components/button";
import { CodeEditor } from "@nuru/ui/components/code-editor";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@nuru/ui/components/dropdown-menu";
import { nuru } from "@nuru/ui/lib/nuru-syntax";
import { cn } from "@nuru/ui/lib/utils";
import { gradeAll, type Runner } from "@nuru/ui/validation/grader";
import type { Dictionary } from "@/app/(main)/[lang]/dictionaries";
import type { Language, Lesson, Module } from "@/types/playground";
import { useMobileLayout } from "@/hooks/use-mobile";
import { currentOwnerKey, readLocalProgress, reportProgress } from "@/lib/progress";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/playground/resizable";
import { TEST_TIMEOUT_MS, useProgram } from "@/components/runtime/use-program";
import { OutputTabs, Pane, type OutputTab } from "@/components/runtime/output-tabs";
import { primeAudio } from "@/components/runtime/ubao-board";
import { fill, useEditorTheme, useModEnter, LayoutPending } from "../shared";
import { LessonContent } from "./lesson-content";
import { TestResults, testKey, type Verdict } from "./test-results";
import { celebrate } from "./celebrate";

interface LessonViewProps {
	module: Module;
	lessonSlug: string;
	nextModuleSlug?: string;
	lang: Language;
	dict: Dictionary;
}

type MobileTab = "somo" | "kodi" | "matokeo";

const SOLUTION_AFTER = 3;
const extensions = [nuru];

/** Which renderers a lesson needs, from the module config and the lesson itself. */
function renderersFor(module: Module, lesson: Lesson): { kobe: boolean; ubao: boolean } {
	const type = module.panels?.renderer?.type ?? "";
	const text = lesson.initialCode;
	const tests = lesson.tests ?? [];
	const uses = lesson.solutionUses;
	return {
		kobe: type === "kobe" || !!uses?.kobe || /tumia\s+kobe\b/.test(text) || tests.some((t) => t.type === "kobe_picha"),
		ubao: type === "ubao" || !!uses?.ubao || /tumia\s+ubao\b/.test(text) || tests.some((t) => t.type === "ubao_mfuatano"),
	};
}

const stripNumber = (title: string) => title.replace(/^\s*\d+\.\s*/, "");

export function LessonView({ module, lessonSlug, nextModuleSlug, lang, dict }: LessonViewProps) {
	const router = useRouter();
	const layout = useMobileLayout();
	const isMobile = !!layout;
	const editorTheme = useEditorTheme();
	const program = useProgram();
	const L = dict.uwanja.lesson;

	const index = Math.max(0, module.lessons.findIndex((l) => l.slug === lessonSlug));
	const lesson = module.lessons[index];
	const total = module.lessons.length;
	const tests = useMemo(() => lesson.tests ?? [], [lesson.tests]);
	const renderers = useMemo(() => renderersFor(module, lesson), [module, lesson]);
	const visual = renderers.kobe || renderers.ubao;
	const ghost = tests.find((t) => t.type === "kobe_picha")?.expectedOutput;
	const isDev = process.env.NODE_ENV === "development";

	// Saved code and attempt counts belong to whoever uses this device: on a
	// shared tablet the next learner must not inherit them. An anonymous
	// visitor keeps the original, un-namespaced keys.
	const owner = typeof document === "undefined" ? "" : currentOwnerKey();
	const ns = owner ? `~${owner}-` : "-";
	const codeKey = `nuru-code${ns}${module.id}-${lesson.id}`;
	const attemptsKey = `nuru-attempts${ns}${lesson.id}`;

	const [code, setCode] = useState(lesson.initialCode);
	const [loaded, setLoaded] = useState(false);
	const [completed, setCompleted] = useState<Set<string>>(new Set());
	const [verdict, setVerdict] = useState<Verdict | null>(null);
	const [checking, setChecking] = useState(false);
	const [attempts, setAttempts] = useState(0);
	const [hint, setHint] = useState<string | null>(null);
	const [fetchingSolution, setFetchingSolution] = useState(false);
	const [mobileTab, setMobileTab] = useState<MobileTab>("somo");

	const outputTabs = useMemo<OutputTab[]>(() => {
		const t: OutputTab[] = [];
		if (renderers.kobe) t.push("kobe");
		if (renderers.ubao) t.push("ubao");
		t.push("terminal");
		if (tests.length) t.push("tests");
		return t;
	}, [renderers, tests.length]);
	const [tab, setTab] = useState<OutputTab>(outputTabs[0]);

	const codeRef = useRef(code);
	codeRef.current = code;

	// Per-lesson state from this device.
	useEffect(() => {
		let saved: string | null = null;
		let tries = 0;
		try {
			saved = localStorage.getItem(codeKey);
			tries = Number(localStorage.getItem(attemptsKey) ?? 0) || 0;
		} catch {}
		setCode(saved ?? lesson.initialCode);
		setAttempts(tries);
		setVerdict(null);
		setHint(null);
		setTab(outputTabs[0]);
		setMobileTab("somo");
		setLoaded(true);
		program.stop();
		program.clear();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [lesson.id, codeKey]);

	useEffect(() => {
		const read = () => setCompleted(new Set(readLocalProgress(module.id).completedLessonIds));
		read();
		window.addEventListener("nuru:progress", read);
		window.addEventListener("storage", read);
		return () => {
			window.removeEventListener("nuru:progress", read);
			window.removeEventListener("storage", read);
		};
	}, [module.id]);

	const onCodeChange = useCallback(
		(next: string) => {
			setCode(next);
			try {
				localStorage.setItem(codeKey, next);
			} catch {}
		},
		[codeKey],
	);

	// Follow the program to the view it uses. Grading picks its own tab, so the
	// automatic switch is off from Wasilisha until the next Endesha.
	const autoTab = useRef(true);
	useEffect(() => {
		if (autoTab.current && program.channels.kobe && renderers.kobe) setTab("kobe");
	}, [program.channels.kobe, renderers.kobe]);
	useEffect(() => {
		if (autoTab.current && program.channels.ubao && renderers.ubao && !program.channels.kobe) setTab("ubao");
	}, [program.channels.ubao, program.channels.kobe, renderers.ubao]);
	useEffect(() => {
		if (program.phase === "input") {
			setTab("terminal");
			setMobileTab("matokeo");
		}
	}, [program.phase]);

	const running = program.phase !== "idle" && !checking;

	const run = useCallback(() => {
		if (checking) return;
		primeAudio();
		autoTab.current = true;
		setTab(renderers.kobe ? "kobe" : renderers.ubao ? "ubao" : "terminal");
		setMobileTab("matokeo");
		void program.run(codeRef.current);
	}, [program, renderers, checking]);

	useModEnter(run);

	const nextHref =
		index < total - 1
			? `/${lang}/anza/${module.slug}/${module.lessons[index + 1].slug}`
			: nextModuleSlug
				? `/${lang}/anza/${nextModuleSlug}`
				: `/${lang}/masomo`;
	const nextLabel = index < total - 1 ? L.next : nextModuleSlug ? L.nextModule : L.allModules;
	const goNext = () => router.push(nextHref);

	const submit = async () => {
		if (checking) return;
		primeAudio();
		const src = codeRef.current;
		autoTab.current = false;
		setChecking(true);
		setVerdict(null);
		setHint(null);
		setTab(renderers.kobe ? "kobe" : renderers.ubao ? "ubao" : "tests");
		setMobileTab("matokeo");

		// The first, plain run is shown to the learner; runs with test input are silent.
		let first = true;
		const runner: Runner = async (c, stdin) => {
			if (first && stdin === undefined) {
				first = false;
				return program.run(c, { timeoutMs: TEST_TIMEOUT_MS, interactive: false });
			}
			return program.capture(c, stdin);
		};

		let passed = false;
		let results: Verdict["results"] = {};
		try {
			if (tests.length) {
				const r = await gradeAll(tests, src, runner);
				passed = r.passed;
				results = r.results;
			} else {
				// A run that timed out or crashed printed no error of its own, but did not pass.
				const r = await program.run(src, { timeoutMs: TEST_TIMEOUT_MS, interactive: false });
				passed = r.status === "ok" && !r.stderr;
			}
		} catch {
			passed = false;
		}

		setVerdict({ passed, results });
		setChecking(false);
		setTab("tests");

		const tries = passed ? attempts : attempts + 1;
		setAttempts(tries);
		try {
			localStorage.setItem(attemptsKey, String(tries));
		} catch {}

		void reportProgress({ moduleId: module.id, lessonId: lesson.id, passed, code: src });
		if (passed) celebrate();
	};

	const showHint = () => {
		const failing = verdict ? tests.find((t, i) => !verdict.results[testKey(t, i)]?.passed) : undefined;
		setHint(failing?.message ?? L.hintFallback);
		setMobileTab("somo");
		requestAnimationFrame(() => document.querySelector('[data-testid="hint"]')?.scrollIntoView({ behavior: "smooth", block: "center" }));
	};

	const reset = () => {
		program.stop();
		program.clear();
		onCodeChange(lesson.initialCode);
		setVerdict(null);
		setHint(null);
	};

	const canShowSolution = !!lesson.hasSolution && (isDev || attempts >= SOLUTION_AFTER);
	// The solution is not in the page: it is fetched once the learner unlocks it.
	const showSolution = async () => {
		if (fetchingSolution) return;
		setFetchingSolution(true);
		try {
			const res = await fetch(`/api/suluhisho?lesson=${encodeURIComponent(lesson.id)}`, { cache: "no-store" });
			const data = res.ok ? ((await res.json()) as { solution?: string }) : null;
			if (!data?.solution) throw new Error(String(res.status));
			onCodeChange(data.solution);
			setMobileTab("kodi");
		} catch {
			setHint(L.solutionFailed);
			setMobileTab("somo");
		} finally {
			setFetchingSolution(false);
		}
	};

	const isDone = completed.has(lesson.id);
	const title = stripNumber(lesson.title[lang] || lesson.title.sw);
	const moduleTitle = module.title[lang] || module.title.sw;
	const outputLabels = { ...dict.uwanja, tabs: dict.uwanja.tabs };

	// ---------- pieces ----------

	const runButton = running ? (
		<Button variant="destructive" onClick={program.stop} className={cn(isMobile && "h-12 flex-1")} data-testid="stop">
			<Square className="fill-current" />
			{dict.uwanja.stop}
		</Button>
	) : (
		<Button variant="ink" onClick={run} disabled={checking} className={cn(isMobile && "h-12 flex-1")} data-testid="run" title={dict.uwanja.shortcut}>
			<Play className="fill-current" />
			{dict.uwanja.run}
		</Button>
	);

	const submitButton = (
		<Button variant={verdict?.passed ? "outline" : "default"} onClick={submit} disabled={checking} className={cn(isMobile && "h-12 flex-[1.3]")} data-testid="submit">
			<Send />
			{checking ? L.checking : L.submit}
		</Button>
	);

	const secondary = (
		<>
			<Button variant="ghost" size="sm" onClick={showHint} data-testid="hint-btn">
				<Lightbulb />
				{L.hint}
			</Button>
			<Button variant="ghost" size="sm" onClick={reset} data-testid="reset">
				<RotateCcw />
				{L.reset}
			</Button>
			{canShowSolution && (
				<Button variant="ghost" size="sm" onClick={showSolution} disabled={fetchingSolution} data-testid="solution">
					<Eye />
					{fetchingSolution ? L.solutionLoading : L.solution}
				</Button>
			)}
		</>
	);

	const progressDots = (
		<div className="flex min-w-0 flex-wrap items-center justify-center gap-1.5" aria-label={fill(L.step, { n: index + 1, total })}>
			{module.lessons.map((l, i) => {
				const done = completed.has(l.id);
				return (
					<Link
						key={l.id}
						href={`/${lang}/anza/${module.slug}/${l.slug}`}
						title={stripNumber(l.title[lang] || l.title.sw)}
						className={cn(
							"h-3 rounded-full border-2 border-mstari transition-[width] duration-150",
							i === index ? "w-7 bg-jua" : done ? "w-3 bg-mwani" : "w-3 bg-card hover:bg-karatasi-2",
						)}
					/>
				);
			})}
		</div>
	);

	const lessonPanel = (
		<div className="flex h-full min-h-0 flex-col bg-card">
			<div className="pindo shrink-0 text-jua" aria-hidden />
			<div className="min-h-0 flex-1 overflow-y-auto">
				<article className="mx-auto max-w-[68ch] px-5 pt-5 pb-10 sm:px-7">
					<nav className="mb-4 flex flex-wrap items-center gap-1.5 text-sm text-muted-foreground">
						<Link href={`/${lang}/masomo`} className="inline-flex items-center gap-1 hover:text-foreground">
							<BookOpen className="size-3.5" />
							{L.lessons}
						</Link>
						<ChevronRight className="size-3.5" />
						<Link href={`/${lang}/anza/${module.slug}`} className="truncate hover:text-foreground">
							{moduleTitle}
						</Link>
					</nav>
					<div className="mb-3 flex flex-wrap items-center gap-2">
						<span className="lebo rounded-sm border-2 border-mstari bg-karatasi-2 px-2 py-0.5" data-testid="step">
							{fill(L.step, { n: index + 1, total })}
						</span>
						{isDone && (
							<span className="lebo inline-flex items-center gap-1 rounded-sm border-2 border-mstari bg-mwani px-2 py-0.5 text-white" data-testid="completed">
								<Check className="size-3" strokeWidth={3} />
								{L.completed}
							</span>
						)}
					</div>
					<h1 className="mb-6 font-display text-[2rem] leading-[1.1] font-extrabold sm:text-[2.4rem]">{title}</h1>
					<LessonContent
						description={lesson.description[lang] || lesson.description.sw}
						task={lesson.task ? lesson.task[lang] || lesson.task.sw : undefined}
						hint={hint}
						labels={{ task: L.task, hint: L.hint, tryIt: L.tryIt }}
						lang={lang}
						theme={editorTheme}
					/>
				</article>
			</div>
			<div className="flex shrink-0 items-center justify-between gap-3 border-t-2 border-mstari bg-karatasi-2 px-3 py-2.5">
				{index > 0 ? (
					<Button variant="outline" size="sm" asChild>
						<Link href={`/${lang}/anza/${module.slug}/${module.lessons[index - 1].slug}`}>
							<ChevronLeft />
							<span className="hidden lg:inline">{L.prev}</span>
						</Link>
					</Button>
				) : (
					<span className="w-9" />
				)}
				{progressDots}
				<Button variant="outline" size="sm" asChild>
					<Link href={nextHref} data-testid="next-nav">
						<span className="hidden lg:inline">{nextLabel}</span>
						<ChevronRight />
					</Link>
				</Button>
			</div>
		</div>
	);

	const editor = (
		<div className="flex h-full min-h-0 flex-col bg-[var(--editor-bg)]">
			<div className="flex shrink-0 flex-wrap items-center justify-between gap-2 border-b-2 border-mstari bg-karatasi-2 px-2 py-1.5">
				<div className="flex items-center gap-0.5">{!isMobile && secondary}</div>
				{!isMobile && (
					<div className="flex items-center gap-2">
						{runButton}
						{submitButton}
					</div>
				)}
			</div>
			<div className="min-h-0 flex-1" data-testid="editor">
				{loaded && <CodeEditor code={code} onChange={onCodeChange} theme={editorTheme} extensions={extensions} />}
			</div>
		</div>
	);

	const testsPane = (
		<TestResults tests={tests} verdict={verdict} checking={checking} labels={L} nextLabel={nextLabel} onNext={verdict?.passed ? goNext : undefined} />
	);

	const badges: Partial<Record<OutputTab, React.ReactNode>> = verdict
		? {
				tests: (
					<span
						className={cn("ml-0.5 inline-flex size-5 items-center justify-center rounded-full border-2 border-mstari text-[10px]", verdict.passed ? "bg-mwani text-white" : "bg-pilipili text-wino")}
						aria-hidden
					>
						{verdict.passed ? <Check className="size-3" strokeWidth={3} /> : "!"}
					</span>
				),
			}
		: {};

	const output = (
		<OutputTabs program={program} tabs={outputTabs} active={tab} onChange={setTab} labels={outputLabels} ghost={ghost} tests={testsPane} badges={badges} />
	);

	if (layout === undefined) return <LayoutPending />;

	if (isMobile) {
		const tabsDef: { id: MobileTab; label: string; icon: typeof BookOpen }[] = [
			{ id: "somo", label: L.tabLesson, icon: BookOpen },
			{ id: "kodi", label: L.tabCode, icon: Code2 },
			{ id: "matokeo", label: L.tabOutput, icon: SquareTerminal },
		];
		return (
			<div className="flex h-full min-h-0 flex-col bg-karatasi">
				<div role="tablist" className="grid shrink-0 grid-cols-3 border-b-2 border-mstari bg-karatasi-2">
					{tabsDef.map(({ id, label, icon: Icon }) => (
						<button
							key={id}
							role="tab"
							aria-selected={mobileTab === id}
							data-mtab={id}
							onClick={() => setMobileTab(id)}
							className={cn(
								"relative inline-flex h-12 items-center justify-center gap-2 border-r-2 border-mstari text-sm font-semibold last:border-r-0",
								mobileTab === id ? "bg-card" : "text-muted-foreground",
							)}
						>
							<Icon className="size-4" />
							{label}
							{id === "matokeo" && verdict && (
								<span className={cn("size-2.5 rounded-full border border-mstari", verdict.passed ? "bg-mwani" : "bg-pilipili")} />
							)}
							{mobileTab === id && <span className="absolute inset-x-0 -bottom-[2px] h-[3px] bg-jua" />}
						</button>
					))}
				</div>
				<div className="relative min-h-0 flex-1">
					<Pane on={mobileTab === "somo"}>{lessonPanel}</Pane>
					<Pane on={mobileTab === "kodi"}>{editor}</Pane>
					<Pane on={mobileTab === "matokeo"}>{output}</Pane>
				</div>
				<div className="flex shrink-0 items-center gap-2 border-t-2 border-mstari bg-card px-3 pt-2.5 pb-[calc(0.625rem+env(safe-area-inset-bottom))]">
					{runButton}
					{submitButton}
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button variant="outline" className="h-12 w-12 px-0" aria-label={dict.uwanja.more}>
								<MoreHorizontal />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end" side="top" sideOffset={8} className="w-56 rounded-lg border-2 border-mstari p-1.5 shadow-kivuli">
							<DropdownMenuItem onSelect={showHint} className="gap-3 px-2 py-3 focus:bg-jua focus:text-wino">
								<Lightbulb />
								{L.hint}
							</DropdownMenuItem>
							<DropdownMenuItem onSelect={reset} className="gap-3 px-2 py-3 focus:bg-jua focus:text-wino">
								<RotateCcw />
								{L.reset}
							</DropdownMenuItem>
							{canShowSolution ? (
								<DropdownMenuItem onSelect={showSolution} disabled={fetchingSolution} className="gap-3 px-2 py-3 focus:bg-jua focus:text-wino">
									<Eye />
									{fetchingSolution ? L.solutionLoading : L.solution}
								</DropdownMenuItem>
							) : (
								lesson.hasSolution && (
									<DropdownMenuItem disabled className="gap-3 px-2 py-3 text-xs">
										<Eye />
										{L.solutionLocked}
									</DropdownMenuItem>
								)
							)}
							<DropdownMenuItem onSelect={goNext} className="gap-3 px-2 py-3 focus:bg-jua focus:text-wino">
								<ArrowRight />
								{nextLabel}
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</div>
			</div>
		);
	}

	return (
		<div className="h-full min-h-0 bg-karatasi pt-3 pr-4 pb-4 pl-3 lg:pt-4 lg:pr-5 lg:pb-5 lg:pl-4">
			<ResizablePanelGroup direction="horizontal" autoSaveId="nuru-somo" className="gap-0">
				<ResizablePanel defaultSize={42} minSize={26}>
					<div className="mji mr-2 h-full overflow-hidden">{lessonPanel}</div>
				</ResizablePanel>
				<ResizableHandle withHandle className="bg-transparent data-[resize-handle-state=hover]:bg-transparent data-[resize-handle-state=drag]:bg-transparent" />
				<ResizablePanel defaultSize={58} minSize={34}>
					<div className="mji ml-2 h-full overflow-hidden">
						<ResizablePanelGroup direction="vertical" autoSaveId={visual ? "nuru-somo-kulia-picha" : "nuru-somo-kulia"}>
							<ResizablePanel defaultSize={visual ? 40 : 55} minSize={20}>
								{editor}
							</ResizablePanel>
							<ResizableHandle withHandle />
							<ResizablePanel defaultSize={visual ? 60 : 45} minSize={20}>
								{output}
							</ResizablePanel>
						</ResizablePanelGroup>
					</div>
				</ResizablePanel>
			</ResizablePanelGroup>
		</div>
	);
}
