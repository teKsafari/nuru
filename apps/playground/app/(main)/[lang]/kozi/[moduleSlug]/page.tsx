import Link from "next/link";
import { notFound } from "next/navigation";
import {
	ChevronRight,
	ChevronDown,
	GraduationCap,
	Gauge,
	BookOpen,
	Clock,
	Play,
	Code2,
	Flame,
	CheckCircle2,
	Activity,
	Flag,
	Circle,
} from "lucide-react";
import { getModuleBySlug } from "@/lib/lessons.server";

export const dynamic = "force-dynamic";

export default async function KoziModulePage({
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
	const title = mod.slug === "misingi-ya-nuru" ? "Nuru Basics" : mod.title[lang as "en" | "sw"] || mod.title.sw;
	const totalLessons = mod.slug === "misingi-ya-nuru" ? 7 : mod.lessons.length;
	const firstLessonHref = `/${lang}/anza/${mod.slug}${
		mod.lessons[0] ? `/${mod.lessons[0].slug}` : ""
	}`;
	// Placeholder progress / activity data (UI parity with mockup)
	const overallPct = 42;
	const lessonsDone = 7;
	const timeSpent = "3h 24m";
	const streakDays = 7;
	const streakWeek = [true, true, true, true, true, true, false];
	const visibleLessons = [
		{ number: 2, title: "Hello Nuru", description: "Jifunze kutoa matokeo kwenye skrini kwa kutumia andika().", pct: 100, tint: "bg-blue-50 text-blue-600", label: "2" },
		{ number: 3, title: "Variables", description: "Elewa vigezo na jinsi ya kuhifadhi na kutumia data.", pct: 100, tint: "bg-emerald-50 text-emerald-600", label: "(x)" },
		{ number: 4, title: "Types & Data", description: "Jifunze aina za data kama namba, maandishi na boolean.", pct: 100, tint: "bg-violet-50 text-violet-600", icon: BookOpen },
		{ number: 5, title: "Math Operations", description: "Fanya mahesabu ya msingi kwa urahisi.", pct: 100, tint: "bg-amber-50 text-amber-600", label: "+" },
		{ number: 6, title: "Conditions", description: "Tumia masharti kufanya maamuzi katika programu.", pct: 86, tint: "bg-orange-50 text-orange-600", label: "if" },
		{ number: 7, title: "Loops", description: "Rudia maagizo kwa kutumia loops na kurahisisha kazi.", pct: 75, tint: "bg-blue-50 text-blue-600", label: "↻" },
	];

	const recentActivity = [
		{ title: "Functions", time: "Today • 10:24 AM" },
		{ title: "Loops", time: "Yesterday • 4:15 PM" },
		{ title: "Conditions", time: "Yesterday • 11:42 AM" },
		{ title: "Math Operations", time: "2 days ago • 3:30 PM" },
		{ title: "Types & Data", time: "3 days ago • 9:18 AM" },
	];

	const milestones = [
		{ label: "Finish Nuru Basics", meta: "58% of learners", tint: "bg-blue-100 text-blue-600" },
		{ label: "Complete all exercises", meta: "42% of learners", tint: "bg-violet-100 text-violet-600" },
		{ label: "7-day learning streak", meta: "35% of learners", tint: "bg-amber-100 text-amber-600" },
	];

	return (
		<main className="min-h-screen bg-background">
			<div className="mx-auto max-w-[1220px] px-8 pt-6 pb-8">
				{/* Breadcrumbs */}
				<nav className="mb-6 flex items-center gap-2 text-[12px] font-medium text-muted-foreground">
					<Link href={`/${lang}`} className="hover:text-foreground">Dashboard</Link>
					<ChevronRight className="h-3.5 w-3.5 text-muted-foreground/60" />
					<Link href={`/${lang}/kozi/${mod.slug}`} className="hover:text-foreground">Courses</Link>
					<ChevronRight className="h-3.5 w-3.5 text-muted-foreground/60" />
					<span className="font-semibold text-foreground">{title}</span>
				</nav>

				<div className="grid grid-cols-1 gap-[26px] lg:grid-cols-[1fr_322px]">
					{/* LEFT MAIN COLUMN */}
					<div className="space-y-6">
						{/* Hero card */}
						<section className="relative min-h-[354px] overflow-hidden rounded-[10px] border border-blue-200 bg-gradient-to-br from-white via-blue-50/20 to-blue-100/60 p-10 shadow-[0_8px_28px_rgba(30,64,175,0.08)]">
							<div className="absolute inset-0 bg-[radial-gradient(circle_at_78%_23%,rgba(37,99,235,0.12)_0_10px,transparent_11px),radial-gradient(circle_at_66%_37%,rgba(37,99,235,0.14)_0_7px,transparent_8px),radial-gradient(circle_at_94%_31%,rgba(37,99,235,0.10)_0_8px,transparent_9px)]" />
							<div className="absolute right-0 bottom-0 h-32 w-[55%] rounded-tl-[100%] bg-gradient-to-t from-blue-500/20 via-blue-200/20 to-transparent blur-sm" />
							<div className="relative z-10 max-w-[480px]">
								<div className="mb-3 inline-flex items-center gap-2 text-[12px] font-extrabold uppercase text-blue-600">
									<GraduationCap className="h-4 w-4" />
									Course
								</div>
								<h1 className="mb-4 text-[40px] leading-none font-extrabold tracking-tight text-foreground">
									{title}
								</h1>
								<p className="mb-8 max-w-[430px] text-[13.5px] leading-7 text-muted-foreground">
									Jifunze misingi ya Nuru hatua kwa hatua. Kozi hii itakusaidia
									kujenga uelewa thabiti wa programu kutoka mwanzo hadi mwisho.
								</p>
								<div className="mb-8 flex flex-wrap gap-0">
									<Stat icon={Gauge} label="Progress" value={`${overallPct}%`} tint="text-blue-600" />
									<Stat icon={BookOpen} label="Lessons" value={`${lessonsDone}/${totalLessons}`} tint="text-emerald-600" />
									<Stat icon={Clock} label="Time Spent" value={timeSpent} tint="text-amber-600" />
								</div>
								<div className="flex flex-wrap gap-3">
									<Link
										href={firstLessonHref}
										className="inline-flex h-10 items-center gap-2 rounded-[6px] bg-blue-600 px-5 text-[13px] font-semibold text-white shadow-sm hover:bg-blue-700"
									>
										<Play className="h-4 w-4 fill-current" />
										Continue Learning
									</Link>
									<Link
										href={`/${lang}/playground`}
										className="inline-flex h-10 items-center gap-2 rounded-[6px] border border-border bg-card px-5 text-[13px] font-semibold text-muted-foreground shadow-sm hover:bg-muted"
									>
										<Code2 className="h-4 w-4" />
										View Playground
									</Link>
								</div>
							</div>
							{/* Decorative tile */}
							<div className="pointer-events-none absolute top-[92px] right-[134px] hidden rotate-[-12deg] lg:block">
								<div className="flex h-[142px] w-[142px] items-center justify-center rounded-[30px] bg-gradient-to-br from-blue-400 via-blue-600 to-blue-800 shadow-[0_32px_55px_rgba(37,99,235,0.34)] ring-1 ring-white/45">
									<svg className="h-20 w-20 rotate-[12deg] text-white drop-shadow-sm" viewBox="0 0 24 24" fill="none">
										<path
											d="M12 2v6m0 8v6M2 12h6m8 0h6M4.93 4.93l4.24 4.24m5.66 5.66l4.24 4.24M4.93 19.07l4.24-4.24m5.66-5.66l4.24-4.24"
											stroke="currentColor"
											strokeWidth="2.5"
											strokeLinecap="round"
										/>
									</svg>
								</div>
							</div>
						</section>

						{/* Course Content */}
						<section>
							<div className="mb-4 flex items-center justify-between">
								<div className="flex items-center gap-3">
									<h2 className="text-[17px] font-extrabold text-foreground">Course Content</h2>
									<span className="rounded-full border border-border bg-card px-2.5 py-0.5 text-[11px] font-semibold text-muted-foreground">
										{totalLessons} Lessons
									</span>
								</div>
								<button className="inline-flex items-center gap-1 text-[12px] font-semibold text-blue-600 hover:text-blue-700">
									Expand All <ChevronDown className="h-3.5 w-3.5" />
								</button>
							</div>
							<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
								{visibleLessons.map((lesson, i) => {
									const source = mod.lessons[lesson.number - 1] || mod.lessons[i] || mod.lessons[0];
									const isDone = lesson.pct === 100;
									const Icon = lesson.icon;
									return (
										<Link
											key={lesson.number}
											href={source ? `/${lang}/anza/${mod.slug}/${source.slug}` : firstLessonHref}
											className="group rounded-[10px] border border-border bg-card p-4 shadow-[0_8px_18px_rgba(15,23,42,0.04)] transition-all hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md"
										>
											<div className="mb-5 flex items-start gap-4">
												<div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-[10px] text-[18px] font-bold ${lesson.tint}`}>
													{Icon ? <Icon className="h-5 w-5" /> : lesson.label}
												</div>
												<div className="min-w-0 flex-1">
													<h3 className="truncate text-[13.5px] font-extrabold text-foreground">
														{lesson.number}. {lesson.title}
													</h3>
													<p className="mt-1.5 line-clamp-2 text-[11.5px] leading-5 text-muted-foreground">
														{lesson.description}
													</p>
												</div>
											</div>
											<div className="flex items-center gap-2">
												<div className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
													<div
														className="h-full rounded-full bg-blue-600"
														style={{ width: `${lesson.pct}%` }}
													/>
												</div>
												<span className="w-8 text-right text-[11px] font-semibold text-muted-foreground">{lesson.pct}%</span>
												{isDone ? (
													<CheckCircle2 className="h-4 w-4 text-emerald-500" />
												) : (
													<Circle className="h-4 w-4 text-muted-foreground/60" />
												)}
											</div>
										</Link>
									);
								})}
							</div>
						</section>

						{/* Practice CTA */}
						<section className="flex flex-col items-start justify-between gap-4 rounded-[10px] border border-border bg-card px-5 py-4 shadow-[0_8px_18px_rgba(15,23,42,0.04)] sm:flex-row sm:items-center">
							<div className="flex items-center gap-4">
								<div className="flex h-10 w-10 items-center justify-center rounded-[8px] bg-blue-600 text-white">
									<Code2 className="h-5 w-5" />
								</div>
								<div>
									<h3 className="text-[13.5px] font-extrabold text-foreground">
										Practice in the Playground
									</h3>
									<p className="text-[12px] text-muted-foreground">
										Tumia maarifa yako kwenye Nuru Playground. Jaribu, cheza na jifunze zaidi!
									</p>
								</div>
							</div>
							<Link
								href={`/${lang}/playground`}
								className="inline-flex h-9 min-w-[140px] items-center justify-center gap-2 rounded-[6px] border border-border bg-card px-4 text-[12.5px] font-semibold text-muted-foreground shadow-sm hover:bg-muted"
							>
								<Code2 className="h-4 w-4" />
								Open Playground
							</Link>
						</section>
					</div>

					{/* RIGHT SIDEBAR */}
					<aside className="space-y-4">
						{/* Streak */}
						<div className="rounded-[10px] border border-border bg-card p-5 shadow-[0_8px_18px_rgba(15,23,42,0.04)]">
							<div className="flex items-center gap-3">
								<div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-50">
									<Flame className="h-6 w-6 text-orange-500" />
								</div>
								<div>
									<div className="text-[12px] font-medium text-muted-foreground">Current Streak</div>
									<div className="flex items-baseline gap-1">
										<span className="text-3xl font-extrabold text-foreground">{streakDays}</span>
										<span className="text-[12px] text-muted-foreground">days</span>
									</div>
								</div>
							</div>
							<p className="mt-3 text-[12px] leading-relaxed text-muted-foreground">
								Keep it up! You're building an amazing habit.
							</p>
							<div className="mt-4 flex items-center justify-between">
								{["M", "T", "W", "T", "F", "S", "S"].map((d, i) => (
									<div key={i} className="flex flex-col items-center gap-1.5">
										<div
											className={`flex h-7 w-7 items-center justify-center rounded-full ${
												streakWeek[i]
													? "bg-blue-600 text-white"
													: "border border-border bg-card text-muted-foreground/60"
											}`}
										>
											{streakWeek[i] && <CheckCircle2 className="h-4 w-4" />}
										</div>
										<span className="text-[10px] font-semibold text-muted-foreground">{d}</span>
									</div>
								))}
							</div>
						</div>

						{/* Recent activity */}
						<div className="rounded-[10px] border border-border bg-card p-5 shadow-[0_8px_18px_rgba(15,23,42,0.04)]">
							<div className="mb-4 flex items-center justify-between">
								<div className="flex items-center gap-2">
									<Activity className="h-4 w-4 text-muted-foreground" />
									<h3 className="text-[13px] font-bold text-foreground">Recent Activity</h3>
								</div>
								<Link
									href={`/${lang}/masomo/progress`}
									className="text-[11px] font-semibold text-blue-600 hover:text-blue-700"
								>
									View all
								</Link>
							</div>
							<ul className="space-y-3">
								{recentActivity.map((a, i) => (
									<li key={i} className="flex items-start gap-3">
										<CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
										<div className="min-w-0 flex-1">
											<div className="text-[12.5px] text-foreground">
												<span className="font-semibold text-foreground">Completed:</span> {a.title}
											</div>
											<div className="text-[11px] text-muted-foreground">{a.time}</div>
										</div>
									</li>
								))}
							</ul>
						</div>

						{/* Milestones */}
						<div className="rounded-[10px] border border-border bg-card p-5 shadow-[0_8px_18px_rgba(15,23,42,0.04)]">
							<div className="mb-4 flex items-center gap-2">
								<Flag className="h-4 w-4 text-muted-foreground" />
								<h3 className="text-[13px] font-bold text-foreground">Upcoming Milestones</h3>
							</div>
							<ul className="space-y-3">
								{milestones.map((m, i) => (
									<li key={i} className="flex items-center gap-3">
										<Circle className="h-4 w-4 text-muted-foreground/60" />
										<div className="min-w-0 flex-1">
											<div className="text-[12.5px] font-semibold text-foreground">{m.label}</div>
											<div className="text-[11px] text-muted-foreground">{m.meta}</div>
										</div>
										<div className={`flex h-8 w-8 items-center justify-center rounded-lg ${m.tint}`}>
											<Flag className="h-4 w-4" />
										</div>
									</li>
								))}
							</ul>
							<Link
								href={`/${lang}/masomo/progress`}
								className="mt-4 flex items-center justify-between text-[12px] font-semibold text-blue-600 hover:text-blue-700"
							>
								View all milestones <ChevronRight className="h-3.5 w-3.5" />
							</Link>
						</div>
					</aside>
				</div>
			</div>
		</main>
	);
}

function Stat({
	icon: Icon,
	label,
	value,
	tint,
}: {
	icon: any;
	label: string;
	value: string;
	tint: string;
}) {
	return (
		<div className="flex items-center gap-3 border-r border-border pr-8 last:border-r-0 last:pr-0">
			<div className={`flex h-8 w-8 items-center justify-center rounded-full border border-blue-600/20 bg-card ${tint}`}>
				<Icon className="h-5 w-5" />
			</div>
			<div>
				<div className="text-[10.5px] font-semibold text-muted-foreground">
					{label}
				</div>
				<div className="text-[18px] leading-tight font-extrabold text-foreground">{value}</div>
			</div>
		</div>
	);
}
