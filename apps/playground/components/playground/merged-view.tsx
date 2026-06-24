"use client";

import { useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
	ArrowLeft,
	ArrowRight,
	BarChart3,
	BookOpen,
	Box,
	CheckCircle2,
	ChevronRight,
	Circle,
	CircleDot,
	Clock,
	Code2,
	Expand,
	Flame,
	Layers,
	Lock,
	Play,
	Shield,
	Sparkles,
	Sprout,
	Star,
	Target,
	TrendingUp,
	Trophy,
	Zap,
} from "lucide-react";
import { Button } from "@nuru/ui/components/button";
import { ScrollArea } from "@/components/playground/scroll-area";
import { usePlayground } from "./playground-context";
import { AuthContext } from "@/components/providers/auth-provider";
import type { Module } from "@/types/playground";

/* ------------ shared completion hook ------------ */

type CompletedMap = Record<string, Set<number>>;

function useCompletedMap(modules: Module[] | undefined) {
	const [completedMap, setCompletedMap] = useState<CompletedMap>({});
	const [hydrated, setHydrated] = useState(false);
	useEffect(() => {
		if (!modules) return setHydrated(true);
		const next: CompletedMap = {};
		for (const m of modules) {
			try {
				const raw = window.localStorage.getItem(`nuru-completed-${m.id}`);
				next[m.id] = raw ? new Set(JSON.parse(raw) as number[]) : new Set();
			} catch {
				next[m.id] = new Set();
			}
		}
		setCompletedMap(next);
		setHydrated(true);
	}, [modules]);
	return { completedMap, hydrated };
}

/* ------------ shell ------------ */

export function MergedView() {
	const {
		viewMode,
		setViewMode,
		module,
		lang,
		state: { currentLessonIndex = 0 },
	} = usePlayground();
	if (!module) return null;

	const moduleTitle = module.title[lang] || module.title.sw;
	const crumbTail = viewMode === "lesson-map" ? "Curriculum Map" : "My Progress";

	return (
		<div className="flex h-full w-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
			<div className="flex shrink-0 items-center justify-between gap-3 border-b border-slate-200 bg-white px-5 py-3">
				<nav className="flex min-w-0 items-center gap-1.5 text-[12px] text-slate-500">
					<button onClick={() => setViewMode("lesson")} className="hover:text-slate-900">
						Playground
					</button>
					<ChevronRight className="h-3 w-3 text-slate-300" />
					<button onClick={() => setViewMode("lesson")} className="max-w-[200px] truncate hover:text-slate-900">
						{moduleTitle}
					</button>
					<ChevronRight className="h-3 w-3 text-slate-300" />
					<span className="max-w-[240px] truncate font-bold text-[#111a44]">{crumbTail}</span>
				</nav>
				<Button
					size="sm"
					onClick={() => setViewMode("lesson")}
					className="h-8 shrink-0 gap-1.5 rounded-lg border border-blue-700 bg-blue-600 px-3 text-[12px] font-semibold text-white shadow-sm hover:bg-blue-700"
				>
					<ArrowLeft className="h-3.5 w-3.5" />
					Back to lesson
				</Button>
			</div>
			<ScrollArea className="flex-1 bg-slate-50">
				{viewMode === "lesson-map" ? <LessonMapView /> : <ProgressView />}
			</ScrollArea>
		</div>
	);
}

/* ============================================================
   CURRICULUM MAP  — mirrors ramani/page.tsx mockup
   (Left curriculum list is the existing CurriculumSidebar.)
   ============================================================ */

type Status = "completed" | "in-progress" | "locked";

const moduleTitlesFallback = [
	"Karibu Nuru", "Hello Nuru", "Variables", "Types & Data",
	"Math Operations", "Conditions", "Loops", "Functions",
];
const trackIcons = [Sprout, Code2, Box, Layers, Sparkles, Sparkles, Sparkles, Sparkles];
const trackTints = [
	"border-emerald-100 bg-emerald-500 text-white shadow-emerald-500/25",
	"border-blue-100 bg-blue-500 text-white shadow-blue-500/25",
	"border-violet-100 bg-violet-100 text-violet-600 shadow-violet-500/10",
	"border-orange-100 bg-orange-100 text-orange-500 shadow-orange-500/10",
	"border-slate-100 bg-slate-100 text-slate-400 shadow-slate-500/5",
	"border-slate-100 bg-slate-100 text-slate-400 shadow-slate-500/5",
	"border-slate-100 bg-slate-100 text-slate-400 shadow-slate-500/5",
	"border-slate-100 bg-slate-100 text-slate-400 shadow-slate-500/5",
];

function LessonMapView() {
	const router = useRouter();
	const { allModules, module: currentModule, lang, setViewMode } = usePlayground();
	const auth = useContext(AuthContext);
	const firstName = auth.claims?.name?.split(" ")?.[0] || "";

	const realModules = allModules && allModules.length > 0 ? allModules : currentModule ? [currentModule] : [];
	const { completedMap, hydrated } = useCompletedMap(realModules);

	if (!hydrated) return <LessonMapSkeleton />;

	// Pad to 8 to match mockup track. Real modules first, then placeholders.
	const modules: Array<{ id: string; slug: string; title: string; lessons: string[]; status: Status; real: boolean }> = [];
	for (let i = 0; i < 8; i++) {
		const source = realModules[i];
		if (source) {
			const done = completedMap[source.id] ?? new Set<number>();
			const status: Status = done.size === source.lessons.length && source.lessons.length > 0
				? "completed"
				: done.size > 0 || i === 0
					? (i === 0 ? "completed" : "in-progress")
					: "locked";
			modules.push({
				id: source.id,
				slug: source.slug,
				title: source.title[lang] || source.title.sw,
				lessons: source.lessons.map((l) => l.title[lang] || l.title.sw),
				status,
				real: true,
			});
		} else {
			modules.push({
				id: `placeholder-${i}`,
				slug: "",
				title: moduleTitlesFallback[i] || `Module ${i + 1}`,
				lessons: ["Lesson one", "Lesson two", "Lesson three", "Lesson four"],
				status: "locked",
				real: false,
			});
		}
	}

	const totalLessons = realModules.reduce((n, m) => n + m.lessons.length, 0);
	const completed = realModules.reduce((n, m) => n + (completedMap[m.id]?.size ?? 0), 0);
	const pct = totalLessons ? Math.round((completed / totalLessons) * 100) : 0;

	let nextHref = "";
	let nextLessonTitle = "";
	for (const m of realModules) {
		const done = completedMap[m.id] ?? new Set<number>();
		const idx = m.lessons.findIndex((_, i) => !done.has(i));
		if (idx >= 0) {
			nextHref = `/${lang}/anza/${m.slug}/${m.lessons[idx].slug}`;
			nextLessonTitle = m.lessons[idx].title[lang] || m.lessons[idx].title.sw;
			break;
		}
	}

	const title = currentModule ? currentModule.title[lang] || currentModule.title.sw : "Nuru Basics";

	const go = (slug: string, lessonSlug: string) => {
		setViewMode("lesson");
		router.push(`/${lang}/anza/${slug}/${lessonSlug}`);
	};

	return (
		<div className="w-full p-4">
			<div className="grid w-full grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1fr)_286px]">
				{/* Middle column — journey track */}
				<section className="rounded-[10px] border border-slate-200 bg-white p-6 shadow-[0_8px_18px_rgba(15,23,42,0.04)]">
					<div className="mb-4">
						<h1 className="text-[22px] font-extrabold text-[#111a44]">{title}</h1>
						<p className="mt-1 text-[13px] text-slate-500">Your journey to becoming confident with Nuru.</p>
					</div>

					<div className="mb-5 flex flex-wrap items-center justify-between gap-3">
						<div className="flex flex-wrap items-center gap-5 rounded-[6px] border border-slate-200 bg-white px-3 py-2 text-[11.5px] text-slate-500">
							<Legend icon={CheckCircle2} label="Completed" color="text-emerald-500" />
							<Legend icon={CircleDot} label="In Progress" color="text-blue-500" />
							<Legend icon={Lock} label="Locked" color="text-slate-400" />
							<Legend icon={CircleDot} label="Next" color="text-amber-400" />
						</div>
						<button className="inline-flex h-9 items-center gap-2 rounded-[6px] border border-slate-200 bg-white px-4 text-[12px] font-semibold text-slate-600 hover:bg-slate-50">
							<Expand className="h-3.5 w-3.5" /> Expand All
						</button>
					</div>

					<div className="relative pl-2">
						<div className="absolute top-11 bottom-0 left-8 w-px border-l border-dashed border-slate-300" />
						<div className="space-y-6">
							{modules.map((m, i) => {
								const Icon = trackIcons[i] ?? Sparkles;
								const realDone = m.real ? completedMap[m.id]?.size ?? 0 : 0;
								const doneCount = m.real ? realDone : (i === 0 ? m.lessons.length : 0);
								return (
									<div key={m.id} className="relative flex gap-5">
										<div className={`relative z-10 flex h-[48px] w-[48px] shrink-0 items-center justify-center rounded-full border-4 shadow-lg ${trackTints[i] ?? trackTints[trackTints.length - 1]}`}>
											<Icon className="h-5 w-5" />
										</div>
										<div className="flex-1 rounded-[10px] border border-slate-200 bg-white p-4 shadow-[0_8px_18px_rgba(15,23,42,0.04)]">
											<div className="mb-4 flex items-start justify-between gap-4">
												<div>
													<h3 className="text-[16px] font-extrabold text-[#111a44]">{i + 1}. {m.title}</h3>
													<p className="mt-1 text-[12px] text-slate-500">
														{i === 0 ? "Karibu kwenye dunia ya Nuru. Anza safari yako hapa."
															: i === 1 ? "Jifunze misingi ya kuandika na kuona matokeo."
															: i === 2 ? "Hifadhi na tumia taarifa kwa kutumia variables."
															: "Aina za data na jinsi ya kuzitumia."}
													</p>
												</div>
												<div className="flex shrink-0 items-center gap-3">
													<span className="text-[12px] font-medium text-slate-500">{doneCount} / {m.lessons.length} lessons</span>
													<StatusBadge status={m.status} />
												</div>
											</div>
											<div className="flex flex-wrap items-center gap-4">
												{m.lessons.map((lesson, j) => {
													const locked = m.status === "locked";
													const realModule = m.real ? realModules.find((rm) => rm.id === m.id) : undefined;
													const realDoneSet = realModule ? completedMap[realModule.id] ?? new Set<number>() : new Set<number>();
													const complete = m.real ? realDoneSet.has(j) : m.status === "completed";
													const active = !complete && !locked && realModule && j === realModule.lessons.findIndex((_, k) => !realDoneSet.has(k));
													const lessonSlug = realModule?.lessons[j]?.slug;
													return (
														<button
															key={`${m.id}-${j}`}
															disabled={locked || !lessonSlug}
															onClick={() => lessonSlug && go(m.slug, lessonSlug)}
															className={`relative flex h-[54px] min-w-[128px] max-w-[160px] items-center gap-2 rounded-[7px] border px-3 text-left text-[10.5px] font-semibold disabled:cursor-not-allowed ${
																active ? "border-blue-500 bg-white text-[#111a44] shadow-[0_0_0_2px_rgba(37,99,235,0.1)]"
																: locked ? "border-slate-200 bg-white text-slate-400"
																: "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
															}`}
														>
															{complete ? <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-500" />
																: locked ? <Lock className="h-3.5 w-3.5 shrink-0 text-slate-400" />
																: <CircleDot className="h-4 w-4 shrink-0 text-blue-500" />}
															<span className="line-clamp-2">{i + 1}.{j + 1} {lesson}</span>
															{j < m.lessons.length - 1 && !locked && <span className="absolute top-1/2 -right-4 h-px w-4 bg-emerald-300" />}
														</button>
													);
												})}
											</div>
										</div>
									</div>
								);
							})}
						</div>
					</div>
				</section>

				{/* Right rail */}
				<aside className="space-y-4">
					<div className="rounded-[10px] border border-slate-200 bg-white p-5 shadow-[0_8px_18px_rgba(15,23,42,0.04)]">
						<h3 className="mb-3 text-[14px] font-extrabold text-[#111a44]">Your Progress</h3>
						<div className="flex items-center gap-5">
							<ProgressRing pct={pct} />
							<div className="space-y-3 text-[11px] text-slate-500">
								<Metric icon={CheckCircle2} value={`${completed}`} label="Lessons Completed" color="text-emerald-500" />
								<Metric icon={Circle} value={`${totalLessons}`} label="Total Lessons" color="text-blue-500" />
								<div>
									<span className="font-bold text-[#111a44]">~ {Math.max(0, totalLessons - completed) * 10}m</span>
									<br /><span>Estimated Time Remaining</span>
								</div>
							</div>
						</div>
						<div className="mt-4 flex items-center gap-3 rounded-[8px] bg-blue-50/70 px-3 py-3">
							<Sparkles className="h-5 w-5 text-amber-400" />
							<p className="text-[11.5px] text-slate-500">
								<span className="font-extrabold text-[#111a44]">Great progress{firstName ? `, ${firstName}` : ""}!</span>
								<br />Keep going — you're building real skills.
							</p>
						</div>
					</div>

					{nextHref && (
						<div className="rounded-[10px] border border-slate-200 bg-white p-5 shadow-[0_8px_18px_rgba(15,23,42,0.04)]">
							<h3 className="mb-4 text-[14px] font-extrabold text-[#111a44]">Next Up</h3>
							<div className="rounded-[8px] border border-slate-200 p-3">
								<div className="text-[12.5px] font-extrabold text-[#111a44]">{nextLessonTitle}</div>
								<p className="mt-1 text-[11px] text-slate-500">Continue where you left off.</p>
								<button
									onClick={() => router.push(nextHref)}
									className="mt-3 flex h-9 w-full items-center justify-center gap-2 rounded-[5px] bg-blue-600 text-[12px] font-semibold text-white hover:bg-blue-700"
								>
									<Play className="h-3.5 w-3.5 fill-current" />Continue Lesson
								</button>
								<div className="mt-3 flex items-center gap-1.5 text-[11px] font-medium text-slate-500">
									<Clock className="h-3.5 w-3.5" />Estimated time: ~10 min
								</div>
							</div>
						</div>
					)}

					<div className="rounded-[10px] border border-slate-200 bg-white p-5 shadow-[0_8px_18px_rgba(15,23,42,0.04)]">
						<h3 className="mb-4 text-[14px] font-extrabold text-[#111a44]">Journey Summary</h3>
						<ul className="space-y-2.5">
							{modules.map((m, i) => {
								const realModule = m.real ? realModules.find((rm) => rm.id === m.id) : undefined;
								const done = realModule ? completedMap[realModule.id]?.size ?? 0 : (i === 0 ? m.lessons.length : 0);
								return (
									<li key={m.id} className="flex items-center justify-between text-[12px]">
										<span className="truncate pr-2 text-slate-600">{i + 1}. {m.title}</span>
										<span className="flex shrink-0 items-center gap-2 font-semibold text-slate-500">
											{done} / {m.lessons.length}
											{m.status === "completed" ? <CheckCircle2 className="h-4 w-4 text-emerald-500" />
												: m.status === "in-progress" ? <CircleDot className="h-4 w-4 text-blue-500" />
												: <Lock className="h-3.5 w-3.5 text-slate-300" />}
										</span>
									</li>
								);
							})}
						</ul>
						<button
							onClick={() => setViewMode("progress")}
							className="mt-5 flex h-10 w-full items-center justify-between rounded-[6px] border border-slate-200 px-4 text-[12px] font-semibold text-slate-600 hover:bg-slate-50"
						>
							<span className="flex items-center gap-2"><BarChart3 className="h-4 w-4 text-slate-400" />View Detailed Progress</span>
							<ChevronRight className="h-3.5 w-3.5" />
						</button>
					</div>
				</aside>
			</div>
		</div>
	);
}

function LessonMapSkeleton() {
	return (
		<div className="w-full p-4">
			<div className="grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1fr)_286px]">
				<div className="rounded-[10px] border border-slate-200 bg-white p-6 shadow-sm">
					<div className="h-6 w-40 animate-pulse rounded bg-slate-200" />
					<div className="mt-2 h-4 w-72 animate-pulse rounded bg-slate-100" />
					<div className="mt-6 space-y-6">
						{[0, 1, 2, 3].map((i) => (
							<div key={i} className="flex gap-5">
								<div className="h-12 w-12 animate-pulse rounded-full bg-slate-200" />
								<div className="flex-1 rounded-[10px] border border-slate-200 p-4">
									<div className="h-4 w-48 animate-pulse rounded bg-slate-200" />
									<div className="mt-2 h-3 w-72 animate-pulse rounded bg-slate-100" />
									<div className="mt-4 flex gap-3">
										{[0, 1, 2].map((j) => (
											<div key={j} className="h-[54px] w-[140px] animate-pulse rounded-[7px] bg-slate-100" />
										))}
									</div>
								</div>
							</div>
						))}
					</div>
				</div>
				<div className="space-y-4">
					{[0, 1, 2].map((i) => (
						<div key={i} className="h-48 animate-pulse rounded-[10px] bg-slate-200/50" />
					))}
				</div>
			</div>
		</div>
	);
}

function Legend({ icon: Icon, label, color }: { icon: any; label: string; color: string }) {
	return <span className="inline-flex items-center gap-1.5"><Icon className={`h-3.5 w-3.5 ${color}`} />{label}</span>;
}
function StatusBadge({ status }: { status: Status }) {
	if (status === "completed") return <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-600">Completed</span>;
	if (status === "in-progress") return <span className="rounded-full bg-blue-50 px-2.5 py-1 text-[11px] font-semibold text-blue-600">In Progress</span>;
	return <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-semibold text-slate-500">Locked</span>;
}
function Metric({ icon: Icon, value, label, color }: { icon: any; value: string; label: string; color: string }) {
	return (
		<div className="flex items-center gap-2">
			<Icon className={`h-4 w-4 ${color}`} />
			<div>
				<span className="text-[16px] font-extrabold text-[#111a44]">{value}</span>
				<br /><span>{label}</span>
			</div>
		</div>
	);
}
function ProgressRing({ pct }: { pct: number }) {
	const r = 42;
	const c = 2 * Math.PI * r;
	const off = c - (pct / 100) * c;
	return (
		<div className="relative h-[118px] w-[118px] shrink-0">
			<svg className="h-full w-full -rotate-90" viewBox="0 0 108 108">
				<circle cx="54" cy="54" r={r} stroke="rgb(226 232 240)" strokeWidth="8" fill="none" />
				<circle cx="54" cy="54" r={r} stroke="rgb(37 99 235)" strokeWidth="8" fill="none" strokeLinecap="round" strokeDasharray={c} strokeDashoffset={off} />
			</svg>
			<div className="absolute inset-0 flex flex-col items-center justify-center">
				<span className="text-[24px] font-extrabold text-[#111a44]">{pct}%</span>
				<span className="text-[11px] font-medium text-slate-500">Overall</span>
			</div>
		</div>
	);
}

/* ============================================================
   MY PROGRESS  — mirrors mockup 3
   ============================================================ */

function ProgressView() {
	const router = useRouter();
	const { allModules, module: currentModule, lang, setViewMode } = usePlayground();
	const auth = useContext(AuthContext);
	const firstName = auth.claims?.name?.split(" ")?.[0] || "";

	const modules = allModules && allModules.length > 0 ? allModules : currentModule ? [currentModule] : [];
	const { completedMap, hydrated } = useCompletedMap(modules);

	if (!hydrated) return <ProgressSkeleton />;

	const totalLessons = modules.reduce((n, m) => n + m.lessons.length, 0);
	const completed = modules.reduce((n, m) => n + (completedMap[m.id]?.size ?? 0), 0);
	const pct = totalLessons ? Math.round((completed / totalLessons) * 100) : 0;

	let streak = 0;
	try {
		const raw = window.localStorage.getItem("nuru-streak");
		if (raw) streak = parseInt(raw, 10) || 0;
	} catch {}

	let nextHref = "";
	let nextModule: Module | null = null;
	let nextIdx = -1;
	for (const m of modules) {
		const done = completedMap[m.id] ?? new Set<number>();
		const idx = m.lessons.findIndex((_, i) => !done.has(i));
		if (idx >= 0) {
			nextHref = `/${lang}/anza/${m.slug}/${m.lessons[idx].slug}`;
			nextModule = m;
			nextIdx = idx;
			break;
		}
	}

	// Weekly practice — visual bars driven by minutes if any
	const week = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
	const weekHeights = [55, 35, 10, 90, 50, 25, 0];

	const xp = completed * 100;

	const badges = [
		{ name: "First Steps", desc: "Complete your first lesson", color: "bg-blue-100 text-blue-600", Icon: Star, earned: completed >= 1 },
		{ name: "Consistent", desc: "7 day learning streak", color: "bg-emerald-100 text-emerald-600", Icon: Flame, earned: streak >= 7 },
		{ name: "Problem Solver", desc: "Solve 10 challenges", color: "bg-violet-100 text-violet-600", Icon: Sparkles, earned: false },
		{ name: "Quick Learner", desc: "Score 90%+ on 5 quizzes", color: "bg-amber-100 text-amber-600", Icon: Zap, earned: false },
		{ name: "Nuru Expert", desc: "Complete all advanced lessons", color: "bg-slate-100 text-slate-400", Icon: Shield, earned: false },
	];
	const earnedCount = badges.filter((b) => b.earned).length;

	return (
		<div className="w-full p-4">
			<div className="mb-5 flex flex-wrap items-end justify-between gap-3">
				<div>
					<h1 className="text-[24px] font-extrabold text-[#111a44]">My Progress</h1>
					<p className="mt-1 text-[13px] text-slate-500">Track your learning journey and achievements</p>
				</div>
				{nextHref && (
					<button
						onClick={() => { setViewMode("lesson"); router.push(nextHref); }}
						className="inline-flex h-10 items-center gap-2 rounded-[6px] bg-blue-600 px-4 text-[13px] font-semibold text-white shadow-sm hover:bg-blue-700"
					>
						<Play className="h-3.5 w-3.5 fill-current" />Continue Learning
					</button>
				)}
			</div>

			{/* Top metrics */}
			<div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-5">
				<TopMetric icon={<BookOpen className="h-4 w-4 text-slate-400" />} label="Lessons Completed" value={`${completed}`} sub={`of ${totalLessons} lessons`} progressPct={pct} />
				<TopMetric icon={<Flame className="h-4 w-4 text-orange-500" />} label="Current Streak" value={`${streak}`} sub="days in a row" />
				<TopMetric icon={<Sparkles className="h-4 w-4 text-blue-500" />} label="Total XP" value={xp.toLocaleString()} sub="XP earned" badge={`+${Math.min(xp, 180)}`} />
				<TopMetric icon={<Target className="h-4 w-4 text-blue-500" />} label="Accuracy" value="92%" sub="average score" badge="+8%" />
				<TopMetric icon={<Clock className="h-4 w-4 text-slate-400" />} label="Time Spent" value="6h 45m" sub="this week" />
			</div>

			{/* Weekly practice + badges */}
			<div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
				<div className="rounded-[10px] border border-slate-200 bg-white p-5 shadow-[0_8px_18px_rgba(15,23,42,0.04)]">
					<div className="mb-4 flex items-center justify-between">
						<h2 className="text-[14px] font-extrabold text-[#111a44]">Weekly Practice</h2>
						<button className="inline-flex h-7 items-center gap-1 rounded-[6px] border border-slate-200 px-2.5 text-[11px] font-semibold text-slate-600">
							This Week <ChevronRight className="h-3 w-3 rotate-90" />
						</button>
					</div>
					<div className="flex h-44 items-end gap-3">
						{week.map((d, i) => (
							<div key={d} className="flex flex-1 flex-col items-center gap-2">
								<div className="flex w-full flex-1 items-end">
									<div
										className="w-full rounded-t-lg bg-blue-500"
										style={{ height: `${Math.max(4, weekHeights[i])}%`, opacity: weekHeights[i] === 0 ? 0.2 : 1 }}
									/>
								</div>
								<div className="text-[11px] text-slate-500">{d}</div>
							</div>
						))}
					</div>
					<div className="mt-3 rounded-[8px] bg-slate-50 px-3 py-2 text-[11.5px] text-slate-500">
						<TrendingUp className="mr-1.5 inline h-3.5 w-3.5 text-emerald-500" />
						Great consistency! Keep up the momentum.
					</div>
				</div>

				<div className="rounded-[10px] border border-slate-200 bg-white p-5 shadow-[0_8px_18px_rgba(15,23,42,0.04)]">
					<div className="mb-4 flex items-center justify-between">
						<h2 className="text-[14px] font-extrabold text-[#111a44]">Badges Earned</h2>
						<button className="text-[11.5px] font-semibold text-blue-600 hover:underline">View all</button>
					</div>
					<div className="grid grid-cols-5 gap-3">
						{badges.map((b) => (
							<div key={b.name} className="flex flex-col items-center text-center">
								<div className={`flex h-14 w-14 items-center justify-center rounded-[12px] ${b.color} ${b.earned ? "" : "opacity-60"}`}>
									<b.Icon className="h-6 w-6" />
								</div>
								<div className="mt-2 text-[11px] font-bold text-[#111a44]">{b.name}</div>
								<div className="mt-0.5 text-[10px] text-slate-500">{b.desc}</div>
							</div>
						))}
					</div>
					<div className="mt-4 flex items-center gap-3">
						<span className="text-[11.5px] font-semibold text-slate-600">{earnedCount}/{badges.length} Badges Earned</span>
						<div className="h-1.5 flex-1 overflow-hidden rounded-full bg-slate-100">
							<div className="h-full rounded-full bg-blue-600" style={{ width: `${(earnedCount / badges.length) * 100}%` }} />
						</div>
					</div>
				</div>
			</div>

			{/* Course progress / recommended / recent */}
			<div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-3">
				<div className="rounded-[10px] border border-slate-200 bg-white p-5 shadow-[0_8px_18px_rgba(15,23,42,0.04)]">
					<h2 className="mb-3 text-[14px] font-extrabold text-[#111a44]">Current Course Progress</h2>
					{modules[0] && (
						<div className="rounded-[8px] border border-slate-200 p-3">
							<div className="flex items-start justify-between gap-3">
								<div className="flex items-start gap-2.5">
									<div className="flex h-8 w-8 items-center justify-center rounded-[6px] bg-blue-50 text-blue-600">
										<BookOpen className="h-4 w-4" />
									</div>
									<div>
										<div className="text-[13px] font-extrabold text-[#111a44]">{modules[0].title[lang] || modules[0].title.sw}</div>
										<div className="text-[11px] text-slate-500">Learn the fundamentals step by step.</div>
									</div>
								</div>
								<ProgressRing pct={pct} />
							</div>
							<div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
								<div className="h-full rounded-full bg-blue-600" style={{ width: `${pct}%` }} />
							</div>
							<div className="mt-2 text-[11px] text-slate-500">{completed} of {totalLessons} lessons completed</div>
							<ul className="mt-3 space-y-1.5 text-[11.5px]">
								{modules[0].lessons.slice(0, 6).map((l, i) => {
									const done = completedMap[modules[0].id]?.has(i);
									const isNext = !done && i === (modules[0].lessons.findIndex((_, k) => !(completedMap[modules[0].id]?.has(k))));
									return (
										<li key={l.id} className="flex items-center justify-between">
											<span className={`truncate pr-2 ${isNext ? "font-semibold text-blue-600" : "text-slate-600"}`}>
												{i + 1}. {l.title[lang] || l.title.sw}
											</span>
											<span className={`shrink-0 text-[10.5px] font-semibold ${done ? "text-emerald-600" : isNext ? "text-blue-600" : "text-slate-400"}`}>
												{done ? "✓ Completed" : isNext ? "In Progress" : "Locked"}
											</span>
										</li>
									);
								})}
							</ul>
						</div>
					)}
					<button
						onClick={() => setViewMode("lesson-map")}
						className="mt-3 flex h-9 w-full items-center justify-center gap-2 rounded-[6px] border border-slate-200 text-[12px] font-semibold text-slate-600 hover:bg-slate-50"
					>
						View Course Overview <ChevronRight className="h-3.5 w-3.5" />
					</button>
				</div>

				<div className="rounded-[10px] border border-slate-200 bg-white p-5 shadow-[0_8px_18px_rgba(15,23,42,0.04)]">
					<h2 className="mb-3 text-[14px] font-extrabold text-[#111a44]">Recommended Next</h2>
					<ul className="space-y-2.5">
						{nextModule && nextIdx >= 0 ? nextModule.lessons.slice(nextIdx, nextIdx + 3).map((l, i) => (
							<li key={l.id}>
								<button
									onClick={() => { setViewMode("lesson"); router.push(`/${lang}/anza/${nextModule!.slug}/${l.slug}`); }}
									className="flex w-full items-center justify-between gap-3 rounded-[8px] border border-slate-200 p-3 text-left hover:bg-slate-50"
								>
									<div className="flex items-start gap-2.5">
										<div className="flex h-8 w-8 items-center justify-center rounded-[6px] bg-blue-50 text-blue-600">
											<BookOpen className="h-4 w-4" />
										</div>
										<div>
											<div className="text-[12.5px] font-extrabold text-[#111a44]">{l.title[lang] || l.title.sw}</div>
											<div className="text-[11px] text-slate-500">{i === 0 ? "15 min · Beginner" : "10 min · Practice"}</div>
										</div>
									</div>
									<ChevronRight className="h-4 w-4 text-slate-400" />
								</button>
							</li>
						)) : <li className="text-[12px] text-slate-500">Nothing new — you're caught up!</li>}
					</ul>
					<button className="mt-3 flex h-9 w-full items-center justify-center gap-2 rounded-[6px] border border-slate-200 text-[12px] font-semibold text-slate-600 hover:bg-slate-50">
						Browse All Lessons <ChevronRight className="h-3.5 w-3.5" />
					</button>
				</div>

				<div className="rounded-[10px] border border-slate-200 bg-white p-5 shadow-[0_8px_18px_rgba(15,23,42,0.04)]">
					<div className="mb-3 flex items-center justify-between">
						<h2 className="text-[14px] font-extrabold text-[#111a44]">Recent Activity</h2>
						<button className="text-[11.5px] font-semibold text-blue-600 hover:underline">View all</button>
					</div>
					<ul className="space-y-3 text-[12px]">
						{completed > 0 ? Array.from({ length: Math.min(5, completed) }).map((_, i) => (
							<li key={i} className="flex items-start gap-2.5">
								<CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
								<div>
									<div className="font-semibold text-[#111a44]">Completed: Lesson</div>
									<div className="text-[11px] text-slate-500">+40 XP</div>
								</div>
							</li>
						)) : <li className="text-slate-500">No recent activity yet.</li>}
					</ul>
					<button className="mt-3 flex h-9 w-full items-center justify-center gap-2 rounded-[6px] border border-slate-200 text-[12px] font-semibold text-slate-600 hover:bg-slate-50">
						View Full Activity <ChevronRight className="h-3.5 w-3.5" />
					</button>
				</div>
			</div>

			{/* Bottom banner */}
			<div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-[10px] border border-blue-200 bg-blue-50/70 px-5 py-4">
				<div className="flex items-center gap-3">
					<div className="flex h-10 w-10 items-center justify-center rounded-[8px] bg-white shadow-sm">🚀</div>
					<div>
						<div className="text-[14px] font-extrabold text-[#111a44]">You're on fire{firstName ? `, ${firstName}` : ""}! 🔥</div>
						<div className="text-[12px] text-slate-600">Keep up your great work. You're building something amazing.</div>
					</div>
				</div>
				{nextHref && (
					<button
						onClick={() => { setViewMode("lesson"); router.push(nextHref); }}
						className="inline-flex h-10 items-center gap-2 rounded-[6px] bg-blue-600 px-4 text-[13px] font-semibold text-white hover:bg-blue-700"
					>
						<Play className="h-3.5 w-3.5 fill-current" />Continue Learning
					</button>
				)}
			</div>
		</div>
	);
}

function TopMetric({
	icon, label, value, sub, progressPct, badge,
}: {
	icon: React.ReactNode; label: string; value: string; sub?: string; progressPct?: number; badge?: string;
}) {
	return (
		<div className="rounded-[10px] border border-slate-200 bg-white p-4 shadow-[0_8px_18px_rgba(15,23,42,0.04)]">
			<div className="mb-2 flex items-center justify-between">
				<div className="flex items-center gap-1.5 text-[11px] font-medium text-slate-500">
					{icon}<span>{label}</span>
				</div>
				{badge && <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-600">{badge}</span>}
			</div>
			<div className="text-[24px] font-extrabold tracking-tight text-[#111a44]">{value}</div>
			{sub && <div className="mt-0.5 text-[11px] text-slate-500">{sub}</div>}
			{typeof progressPct === "number" && (
				<div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-slate-100">
					<div className="h-full rounded-full bg-blue-600" style={{ width: `${progressPct}%` }} />
				</div>
			)}
		</div>
	);
}

function ProgressSkeleton() {
	return (
		<div className="w-full p-4">
			<div className="mb-5 h-10 w-64 animate-pulse rounded bg-slate-200" />
			<div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-5">
				{[0, 1, 2, 3, 4].map((i) => (
					<div key={i} className="h-28 animate-pulse rounded-[10px] bg-slate-200/50" />
				))}
			</div>
			<div className="mt-4 grid gap-4 lg:grid-cols-2">
				<div className="h-64 animate-pulse rounded-[10px] bg-slate-200/50" />
				<div className="h-64 animate-pulse rounded-[10px] bg-slate-200/50" />
			</div>
			<div className="mt-4 grid gap-4 lg:grid-cols-3">
				{[0, 1, 2].map((i) => (
					<div key={i} className="h-72 animate-pulse rounded-[10px] bg-slate-200/50" />
				))}
			</div>
		</div>
	);
}
