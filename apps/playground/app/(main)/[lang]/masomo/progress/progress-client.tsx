"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
	Trophy,
	Flame,
	Target,
	Clock,
	TrendingUp,
	CheckCircle2,
	Sparkles,
	ArrowRight,
	Activity as ActivityIcon,
} from "lucide-react";
import type { Module } from "@/types/playground";
import {
	getActivity,
	getBadges,
	getPracticeWeek,
	getRuns,
	getStreak,
	computeBadges,
	type PlaygroundActivity,
	type EarnedBadge,
	type PracticeSession,
} from "@/lib/playground-storage";

interface Props {
	modules: Module[];
	lang: "en" | "sw";
	dict: any;
}

export function ProgressDashboardClient({ modules, lang }: Props) {
	const [activity, setActivity] = useState<PlaygroundActivity[]>([]);
	const [badges, setBadges] = useState<EarnedBadge[]>([]);
	const [week, setWeek] = useState<PracticeSession[]>([]);
	const [streak, setStreak] = useState(0);
	const [runs, setRuns] = useState<number>(0);

	// Aggregate completed lessons across modules from per-module localStorage
	const completed = useMemo(() => {
		if (typeof window === "undefined") return 0;
		let total = 0;
		for (const m of modules) {
			try {
				const raw = window.localStorage.getItem(`nuru-completed-${m.id}`);
				if (raw) total += (JSON.parse(raw) as number[]).length;
			} catch {}
		}
		return total;
	}, [modules]);

	const totalLessons = modules.reduce((n, m) => n + m.lessons.length, 0);
	const pct = totalLessons ? Math.round((completed / totalLessons) * 100) : 0;

	useEffect(() => {
		setActivity(getActivity(10));
		setWeek(getPracticeWeek());
		setStreak(getStreak());
		const r = getRuns();
		setRuns(r.length);
		const passedSuites = r.filter((x) => x.success).length;
		setBadges(
			computeBadges({
				completedCount: completed,
				streak: getStreak(),
				passedSuites,
			}),
		);
	}, [completed]);

	// Recommended next: first incomplete lesson
	const nextLesson = useMemo(() => {
		for (const m of modules) {
			let completedIdx: number[] = [];
			try {
				if (typeof window !== "undefined") {
					const raw = window.localStorage.getItem(`nuru-completed-${m.id}`);
					if (raw) completedIdx = JSON.parse(raw);
				}
			} catch {}
			const idx = m.lessons.findIndex((_, i) => !completedIdx.includes(i));
			if (idx >= 0) return { module: m, lesson: m.lessons[idx] };
		}
		return null;
	}, [modules]);

	const maxMinutes = Math.max(1, ...week.map((d) => d.minutes));

	return (
		<main className="flex-1 overflow-auto bg-slate-50 p-6 md:p-10">
			<div className="mx-auto max-w-6xl">
				<div className="mb-8 flex items-end justify-between gap-4">
					<div>
						<h1 className="text-3xl font-bold tracking-tight text-slate-900">
							My Progress
						</h1>
						<p className="mt-1 text-sm text-slate-600">
							Your learning journey across Nuru Playground
						</p>
					</div>
					{nextLesson && (
						<Link
							href={`/${lang}/anza/${nextLesson.module.slug}/${nextLesson.lesson.slug}`}
							className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700"
						>
							Continue Learning
							<ArrowRight className="h-4 w-4" />
						</Link>
					)}
				</div>

				{/* Metrics */}
				<div className="grid grid-cols-2 gap-4 md:grid-cols-4">
					<MetricCard
						icon={<CheckCircle2 className="h-5 w-5 text-emerald-500" />}
						label="Lessons completed"
						value={`${completed}/${totalLessons}`}
						sub={`${pct}% overall`}
					/>
					<MetricCard
						icon={<Flame className="h-5 w-5 text-orange-500" />}
						label="Current streak"
						value={`${streak} day${streak === 1 ? "" : "s"}`}
						sub={streak > 0 ? "Keep it going!" : "Run code today to start"}
					/>
					<MetricCard
						icon={<Target className="h-5 w-5 text-blue-500" />}
						label="Total runs"
						value={`${runs}`}
						sub="Code executions"
					/>
					<MetricCard
						icon={<Trophy className="h-5 w-5 text-amber-500" />}
						label="Badges earned"
						value={`${badges.length}`}
						sub={badges.length ? "Nice work" : "Earn your first"}
					/>
				</div>

				<div className="mt-6 grid gap-4 md:grid-cols-3">
					{/* Weekly practice */}
					<div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:col-span-2">
						<div className="mb-4 flex items-center justify-between">
							<div>
								<h2 className="text-base font-semibold text-slate-900">
									Weekly Practice
								</h2>
								<p className="text-xs text-slate-500">Last 7 days</p>
							</div>
							<TrendingUp className="h-5 w-5 text-blue-500" />
						</div>
						<div className="flex h-40 items-end gap-3">
							{week.map((d) => {
								const h = Math.round((d.minutes / maxMinutes) * 100);
								return (
									<div key={d.date} className="flex flex-1 flex-col items-center gap-2">
										<div
											className="w-full rounded-t-lg bg-gradient-to-t from-blue-500 to-blue-400"
											style={{ height: `${Math.max(4, h)}%` }}
											title={`${d.minutes} min`}
										/>
										<div className="text-[10.5px] text-slate-500">
											{new Date(d.date).toLocaleDateString(undefined, {
												weekday: "short",
											})}
										</div>
									</div>
								);
							})}
						</div>
					</div>

					{/* Badges */}
					<div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
						<div className="mb-4 flex items-center justify-between">
							<h2 className="text-base font-semibold text-slate-900">
								Badges Earned
							</h2>
							<Trophy className="h-5 w-5 text-amber-500" />
						</div>
						{badges.length === 0 ? (
							<p className="rounded-xl border border-dashed border-slate-200 bg-slate-50 px-4 py-6 text-center text-xs text-slate-500">
								Complete lessons and pass tests to earn badges.
							</p>
						) : (
							<ul className="space-y-2.5">
								{badges.map((b) => (
									<li
										key={b.id}
										className="flex items-center gap-3 rounded-xl border border-amber-100 bg-amber-50/60 px-3 py-2.5"
									>
										<div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-100">
											<Sparkles className="h-4 w-4 text-amber-600" />
										</div>
										<div className="min-w-0">
											<div className="truncate text-[13px] font-semibold text-slate-900">
												{b.title}
											</div>
											<div className="truncate text-[11px] text-slate-500">
												{b.description}
											</div>
										</div>
									</li>
								))}
							</ul>
						)}
					</div>
				</div>

				<div className="mt-6 grid gap-4 md:grid-cols-3">
					{/* Course progress */}
					<div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:col-span-2">
						<h2 className="mb-4 text-base font-semibold text-slate-900">
							Current Course Progress
						</h2>
						<ul className="space-y-3">
							{modules.map((m) => {
								let count = 0;
								try {
									if (typeof window !== "undefined") {
										const raw = window.localStorage.getItem(
											`nuru-completed-${m.id}`,
										);
										if (raw) count = (JSON.parse(raw) as number[]).length;
									}
								} catch {}
								const p = Math.round((count / m.lessons.length) * 100);
								return (
									<li
										key={m.id}
										className="rounded-xl border border-slate-200 bg-white px-4 py-3"
									>
										<div className="mb-1.5 flex items-center justify-between">
											<Link
												href={`/${lang}/anza/${m.slug}`}
												className="truncate text-[13.5px] font-semibold text-slate-800 hover:text-blue-600"
											>
												{m.title[lang] || m.title.sw}
											</Link>
											<span className="text-[11.5px] font-medium text-slate-500">
												{count} / {m.lessons.length}
											</span>
										</div>
										<div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
											<div
												className="h-full rounded-full bg-blue-600 transition-all"
												style={{ width: `${p}%` }}
											/>
										</div>
									</li>
								);
							})}
						</ul>
					</div>

					{/* Recent activity */}
					<div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
						<div className="mb-4 flex items-center justify-between">
							<h2 className="text-base font-semibold text-slate-900">
								Recent Activity
							</h2>
							<ActivityIcon className="h-5 w-5 text-blue-500" />
						</div>
						{activity.length === 0 ? (
							<p className="rounded-xl border border-dashed border-slate-200 bg-slate-50 px-4 py-6 text-center text-xs text-slate-500">
								Run some code to populate your activity.
							</p>
						) : (
							<ul className="space-y-2.5">
								{activity.map((a) => (
									<li key={a.id} className="flex items-start gap-2.5">
										<div className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-500" />
										<div className="min-w-0 flex-1">
											<div className="truncate text-[12.5px] font-medium text-slate-800">
												{a.title}
											</div>
											<div className="text-[11px] text-slate-500">
												{new Date(a.createdAt).toLocaleString()}
											</div>
										</div>
									</li>
								))}
							</ul>
						)}
					</div>
				</div>

				{/* Motivation banner */}
				<div className="mt-6 overflow-hidden rounded-2xl border border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-5">
					<div className="flex items-center gap-4">
						<div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white shadow-sm">
							<Clock className="h-5 w-5 text-blue-600" />
						</div>
						<div className="flex-1">
							<h3 className="text-[15px] font-semibold text-slate-900">
								Keep your momentum going
							</h3>
							<p className="text-[12.5px] text-slate-600">
								A few minutes a day adds up fast. Every run counts.
							</p>
						</div>
						{nextLesson && (
							<Link
								href={`/${lang}/anza/${nextLesson.module.slug}/${nextLesson.lesson.slug}`}
								className="inline-flex items-center gap-2 rounded-xl border border-blue-200 bg-white px-3.5 py-2 text-[12.5px] font-semibold text-blue-700 hover:bg-blue-50"
							>
								Resume lesson
								<ArrowRight className="h-3.5 w-3.5" />
							</Link>
						)}
					</div>
				</div>
			</div>
		</main>
	);
}

function MetricCard({
	icon,
	label,
	value,
	sub,
}: {
	icon: React.ReactNode;
	label: string;
	value: string;
	sub?: string;
}) {
	return (
		<div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
			<div className="mb-2 flex items-center justify-between">
				<span className="text-[11.5px] font-medium uppercase tracking-wider text-slate-500">
					{label}
				</span>
				{icon}
			</div>
			<div className="text-2xl font-bold tracking-tight text-slate-900">
				{value}
			</div>
			{sub && <div className="mt-0.5 text-[11.5px] text-slate-500">{sub}</div>}
		</div>
	);
}
