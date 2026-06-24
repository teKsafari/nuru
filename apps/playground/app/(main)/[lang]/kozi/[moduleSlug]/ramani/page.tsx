import Link from "next/link";
import { notFound } from "next/navigation";
import {
	BarChart3,
	BookOpen,
	Box,
	CheckCircle2,
	ChevronDown,
	ChevronRight,
	Circle,
	CircleDot,
	Clock,
	Code2,
	Expand,
	Layers,
	Lock,
	Play,
	Sparkles,
	Sprout,
} from "lucide-react";
import { getModuleBySlug, getAllModulesWithLessons } from "@/lib/lessons.server";

export const dynamic = "force-dynamic";

type Status = "completed" | "in-progress" | "locked";

const moduleTitles = [
	"Karibu Nuru",
	"Hello Nuru",
	"Variables",
	"Types & Data",
	"Math Operations",
	"Conditions",
	"Loops",
	"Functions",
];

const lessonTitles: Record<number, string[]> = {
	0: ["Karibu kwenye Nuru", "Nuru ni nini?", "Jinsi Nuru inavyofanya kazi"],
	1: ["Hello World", "Outputting Results (andika)", "Mistari ya Maelekezo", "Maoni (Comments)", "Zoezi: Chapisha sentensi yako"],
	2: ["Variables ni nini?", "Kutengeneza Variable", "Kutumia Variable", "Zoezi: Umri na Jina"],
	3: ["Aina za Data", "String (Maandishi)", "Number (Namba)", "Zoezi: Taarifa Binafsi"],
};

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

export default async function CurriculumMapPage({
	params,
}: {
	params: Promise<{ lang: string; moduleSlug: string }>;
}) {
	const { lang, moduleSlug } = await params;
	let mod;
	try {
		mod = await getModuleBySlug(moduleSlug);
	} catch {
		return notFound();
	}
	const allModulesRaw = await getAllModulesWithLessons();
	const title = mod.slug === "misingi-ya-nuru" ? "Nuru Basics" : mod.title[lang as "en" | "sw"] || mod.title.sw;
	const modules = Array.from({ length: 8 }, (_, i) => {
		const source = allModulesRaw[i] || allModulesRaw[0] || mod;
		const lessons = lessonTitles[i] || (source.lessons || []).slice(0, 4).map((l) => l.title[lang as "en" | "sw"] || l.title.sw);
		return {
			id: source.id || String(i),
			slug: source.slug || mod.slug,
			title: moduleTitles[i] || source.title?.[lang as "en" | "sw"] || source.title?.sw || `Module ${i + 1}`,
			lessons: lessons.length ? lessons : ["Lesson one", "Lesson two", "Lesson three", "Lesson four"],
			status: (i === 0 ? "completed" : i === 1 ? "in-progress" : "locked") as Status,
		};
	});

	const nextHref = `/${lang}/anza/${mod.slug}/${mod.lessons[1]?.slug || mod.lessons[0]?.slug || ""}`;

	return (
		<main className="min-h-screen bg-white">
			<div className="mx-auto max-w-[1280px] px-4 pt-4 pb-8">
				<nav className="mb-3 flex items-center gap-2 px-2 text-[13px] font-medium text-slate-500">
					<Link href={`/${lang}/kozi/${mod.slug}`} className="hover:text-slate-900">
						{title}
					</Link>
					<ChevronRight className="h-3.5 w-3.5 text-slate-300" />
					<span className="font-bold text-[#111a44]">Curriculum Map</span>
				</nav>

				<div className="grid grid-cols-1 gap-4 lg:grid-cols-[246px_minmax(0,1fr)_286px]">
					<aside className="overflow-hidden rounded-[10px] border border-slate-200 bg-white shadow-[0_8px_18px_rgba(15,23,42,0.04)]">
						<div className="border-b border-slate-100 p-4">
							<div className="flex items-center gap-2.5">
								<div className="flex h-7 w-7 items-center justify-center rounded-[6px] bg-blue-50 text-blue-600">
									<BookOpen className="h-4 w-4" />
								</div>
								<h2 className="text-[16px] font-extrabold text-[#111a44]">{title}</h2>
							</div>
							<div className="mt-4 flex items-center gap-3">
								<span className="text-[11px] font-medium text-slate-500">65% complete</span>
								<div className="h-1.5 flex-1 overflow-hidden rounded-full bg-slate-100">
									<div className="h-full w-[65%] rounded-full bg-blue-600" />
								</div>
							</div>
						</div>

						<div className="px-4 py-3">
							{modules.map((m, i) => {
								const open = i < 2;
								const done = m.status === "completed";
								return (
									<div key={`${m.id}-${i}`} className="border-b border-slate-100 py-2 last:border-b-0">
										<button className="flex w-full items-center justify-between py-1.5 text-left text-[13px] font-extrabold text-[#111a44]">
											<span>{i + 1}. {m.title}</span>
											<ChevronDown className={`h-4 w-4 text-slate-500 ${open ? "" : "-rotate-90"}`} />
										</button>
										{open && (
											<ul className="mt-1 space-y-0.5 pb-1">
												{m.lessons.map((lesson, j) => {
													const completed = done || (i === 1 && j < 2);
													return (
														<li key={lesson} className="flex items-center gap-2 py-1.5 text-[12px] text-slate-600">
															<span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-slate-100 text-[10px] font-semibold text-slate-400">{j + 1}</span>
															<span className="min-w-0 flex-1 truncate">{lesson}</span>
															{completed ? <CheckCircle2 className="h-4 w-4 text-emerald-500" /> : <span className="h-4 w-4 rounded-full border border-slate-300" />}
														</li>
													);
												})}
											</ul>
										)}
									</div>
								);
							})}
						</div>

						<div className="border-t border-slate-100 p-4">
							<Link href={`/${lang}/masomo/progress`} className="flex h-9 items-center justify-between rounded-[6px] border border-slate-200 px-3 text-[12px] font-semibold text-slate-500 hover:bg-slate-50">
								<span className="flex items-center gap-2"><BarChart3 className="h-4 w-4 text-slate-400" />View Progress</span>
								<ChevronRight className="h-3.5 w-3.5" />
							</Link>
						</div>
					</aside>

					<section className="rounded-[10px] border border-slate-200 bg-white p-6 shadow-[0_8px_18px_rgba(15,23,42,0.04)]">
						<div className="mb-4">
							<h1 className="text-[22px] font-extrabold text-[#111a44]">{title}</h1>
							<p className="mt-1 text-[13px] text-slate-500">Your journey to becoming confident with Nuru.</p>
						</div>

						<div className="mb-5 flex flex-wrap items-center justify-between gap-3">
							<div className="flex items-center gap-5 rounded-[6px] border border-slate-200 bg-white px-3 py-2 text-[11.5px] text-slate-500">
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
								{modules.slice(0, 4).map((m, i) => {
									const Icon = trackIcons[i];
									const doneCount = i === 0 ? 3 : i === 1 ? 2 : 0;
									return (
										<div key={`${m.id}-track-${i}`} className="relative flex gap-5">
											<div className={`relative z-10 flex h-[48px] w-[48px] shrink-0 items-center justify-center rounded-full border-4 shadow-lg ${trackTints[i]}`}>
												<Icon className="h-5 w-5" />
											</div>
											<div className="flex-1 rounded-[10px] border border-slate-200 bg-white p-4 shadow-[0_8px_18px_rgba(15,23,42,0.04)]">
												<div className="mb-4 flex items-start justify-between gap-4">
													<div>
														<h3 className="text-[16px] font-extrabold text-[#111a44]">{i + 1}. {m.title}</h3>
														<p className="mt-1 text-[12px] text-slate-500">{i === 0 ? "Karibu kwenye dunia ya Nuru. Anza safari yako hapa." : i === 1 ? "Jifunze misingi ya kuandika na kuona matokeo." : i === 2 ? "Hifadhi na tumia taarifa kwa kutumia variables." : "Aina za data na jinsi ya kuzitumia."}</p>
													</div>
													<div className="flex items-center gap-3">
														<span className="text-[12px] font-medium text-slate-500">{doneCount} / {m.lessons.length} lessons</span>
														<StatusBadge status={m.status} />
													</div>
												</div>
												<div className="flex flex-wrap items-center gap-4">
													{m.lessons.map((lesson, j) => {
														const locked = m.status === "locked";
														const active = i === 1 && j === 1;
														const complete = m.status === "completed" || (i === 1 && j === 0);
														return (
															<Link key={lesson} href={locked ? "#" : nextHref} className={`relative flex h-[54px] min-w-[128px] max-w-[160px] items-center gap-2 rounded-[7px] border px-3 text-[10.5px] font-semibold ${active ? "border-blue-500 bg-white text-[#111a44] shadow-[0_0_0_2px_rgba(37,99,235,0.1)]" : locked ? "border-slate-200 bg-white text-slate-400" : "border-slate-200 bg-white text-slate-600"}`}>
																{complete ? <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-500" /> : locked ? <Lock className="h-3.5 w-3.5 shrink-0 text-slate-400" /> : <CircleDot className="h-4 w-4 shrink-0 text-blue-500" />}
																<span className="line-clamp-2">{i + 1}.{j + 1} {lesson}</span>
																{j < m.lessons.length - 1 && !locked && <span className="absolute top-1/2 -right-4 h-px w-4 bg-emerald-300" />}
															</Link>
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

					<aside className="space-y-4">
						<div className="rounded-[10px] border border-slate-200 bg-white p-5 shadow-[0_8px_18px_rgba(15,23,42,0.04)]">
							<h3 className="mb-3 text-[14px] font-extrabold text-[#111a44]">Your Progress</h3>
							<div className="flex items-center gap-5">
								<ProgressRing pct={65} />
								<div className="space-y-3 text-[11px] text-slate-500">
									<Metric icon={CheckCircle2} value="13" label="Lessons Completed" color="text-emerald-500" />
									<Metric icon={Circle} value="20" label="Total Lessons" color="text-blue-500" />
									<div><span className="font-bold text-[#111a44]">--</span> <span className="font-bold text-[#111a44]">~ 2h 15m</span><br /><span>Estimated Time Remaining</span></div>
								</div>
							</div>
							<div className="mt-4 flex items-center gap-3 rounded-[8px] bg-blue-50/70 px-3 py-3">
								<Sparkles className="h-5 w-5 text-amber-400" />
								<p className="text-[11.5px] text-slate-500"><span className="font-extrabold text-[#111a44]">Great progress, David!</span><br />Keep going — you're building real skills.</p>
							</div>
						</div>

						<div className="rounded-[10px] border border-slate-200 bg-white p-5 shadow-[0_8px_18px_rgba(15,23,42,0.04)]">
							<h3 className="mb-4 text-[14px] font-extrabold text-[#111a44]">Next Up</h3>
							<div className="rounded-[8px] border border-slate-200 p-3">
								<div className="text-[12.5px] font-extrabold text-[#111a44]">2.2 Outputting Results (andika)</div>
								<p className="mt-1 text-[11px] text-slate-500">Jifunze kutumia <span className="font-mono">andika()</span> kuonyesha matokeo.</p>
								<Link href={nextHref} className="mt-3 flex h-9 items-center justify-center gap-2 rounded-[5px] bg-blue-600 text-[12px] font-semibold text-white hover:bg-blue-700"><Play className="h-3.5 w-3.5 fill-current" />Continue Lesson</Link>
								<div className="mt-3 flex items-center gap-1.5 text-[11px] font-medium text-slate-500"><Clock className="h-3.5 w-3.5" />Estimated time: ~10 min</div>
							</div>
						</div>

						<div className="rounded-[10px] border border-slate-200 bg-white p-5 shadow-[0_8px_18px_rgba(15,23,42,0.04)]">
							<h3 className="mb-4 text-[14px] font-extrabold text-[#111a44]">Journey Summary</h3>
							<ul className="space-y-2.5">
								{modules.map((m, i) => <li key={m.title} className="flex items-center justify-between text-[12px]"><span className="text-slate-600">{i + 1}. {m.title}</span><span className="flex items-center gap-2 font-semibold text-slate-500">{i === 0 ? "3 / 3" : i === 1 ? "2 / 5" : "0 / 4"}{m.status === "completed" ? <CheckCircle2 className="h-4 w-4 text-emerald-500" /> : m.status === "in-progress" ? <CircleDot className="h-4 w-4 text-blue-500" /> : <Lock className="h-3.5 w-3.5 text-slate-300" />}</span></li>)}
							</ul>
							<Link href={`/${lang}/masomo/progress`} className="mt-5 flex h-10 items-center justify-between rounded-[6px] border border-slate-200 px-4 text-[12px] font-semibold text-slate-600 hover:bg-slate-50"><span className="flex items-center gap-2"><BarChart3 className="h-4 w-4 text-slate-400" />View Detailed Progress</span><ChevronRight className="h-3.5 w-3.5" /></Link>
						</div>
					</aside>
				</div>
			</div>
		</main>
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
	return <div className="flex items-center gap-2"><Icon className={`h-4 w-4 ${color}`} /><div><span className="text-[16px] font-extrabold text-[#111a44]">{value}</span><br /><span>{label}</span></div></div>;
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