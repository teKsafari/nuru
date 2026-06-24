"use client";

import { useState } from "react";
import {
	X,
	Compass,
	BookOpen,
	Code2,
	Wrench,
	Lightbulb,
	CheckCircle2,
	XCircle,
	AlertTriangle,
} from "lucide-react";
import { cn } from "@nuru/ui/lib/utils";
import { ScrollArea } from "@/components/playground/scroll-area";
import { usePlayground } from "./playground-context";

type GuideTab = "help" | "explain" | "examples" | "fix";

/**
 * Right-side "Nuru Guide" panel. Reads from lesson content + current run
 * results — no AI backend, so this never pretends to chat. The optional
 * search input filters lesson content locally.
 */
export function NuruGuidePanel({ onClose }: { onClose: () => void }) {
	const {
		module,
		state: { currentLessonIndex = 0, code, testResults, testErrors },
		lang,
	} = usePlayground();

	const [tab, setTab] = useState<GuideTab>("help");
	const [q, setQ] = useState("");

	const lesson = module?.lessons[currentLessonIndex];
	if (!module || !lesson) return null;

	const hint = lesson.hint?.[lang] || lesson.hint?.sw;
	const mistakes = lesson.commonMistakes?.[lang] || lesson.commonMistakes?.sw || [];
	const requirements = lesson.requirements?.[lang] || lesson.requirements?.sw || [];
	const task = lesson.task?.[lang] || lesson.task?.sw;
	const description = lesson.description[lang] || lesson.description.sw;

	const tests = Object.entries(testResults || {});
	const failed = tests.filter(([, r]) => r.passed === false);
	const passed = tests.filter(([, r]) => r.passed);

	const filt = (s: string) =>
		!q.trim() || s.toLowerCase().includes(q.trim().toLowerCase());

	return (
		<aside className="flex h-full w-[340px] shrink-0 flex-col border-l border-slate-200 bg-white shadow-sm">
			{/* Header */}
			<div className="flex shrink-0 items-center justify-between border-b border-slate-200 px-4 py-3">
				<div className="flex items-center gap-2">
					<div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
						<Compass className="h-4 w-4" />
					</div>
					<div>
						<div className="text-[13px] font-semibold text-slate-900">
							Nuru Guide
						</div>
						<div className="text-[10.5px] text-slate-500">
							Contextual help for this lesson
						</div>
					</div>
				</div>
				<button
					onClick={onClose}
					aria-label="Close guide"
					className="rounded-md p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-700"
				>
					<X className="h-4 w-4" />
				</button>
			</div>

			{/* Tabs */}
			<div className="flex shrink-0 items-center gap-1 border-b border-slate-200 px-2">
				{(
					[
						{ id: "help", icon: BookOpen, label: "Help" },
						{ id: "explain", icon: Code2, label: "Explain" },
						{ id: "examples", icon: Lightbulb, label: "Examples" },
						{ id: "fix", icon: Wrench, label: "Fix" },
					] as { id: GuideTab; icon: any; label: string }[]
				).map((t) => {
					const Icon = t.icon;
					const active = tab === t.id;
					return (
						<button
							key={t.id}
							onClick={() => setTab(t.id)}
							className={cn(
								"relative flex flex-1 items-center justify-center gap-1.5 px-2 py-2.5 text-[12px] font-medium transition-colors",
								active
									? "text-blue-600"
									: "text-slate-500 hover:text-slate-700",
							)}
						>
							<Icon className="h-3.5 w-3.5" />
							{t.label}
							{active && (
								<span className="absolute inset-x-1 -bottom-px h-0.5 rounded bg-blue-600" />
							)}
						</button>
					);
				})}
			</div>

			{/* Local search (filters lesson content only — not AI) */}
			<div className="shrink-0 border-b border-slate-100 px-4 py-2">
				<input
					value={q}
					onChange={(e) => setQ(e.target.value)}
					placeholder="Search this lesson…"
					className="h-8 w-full rounded-lg border border-slate-200 bg-slate-50 px-2.5 text-[12px] text-slate-700 placeholder:text-slate-400 focus:border-blue-400 focus:bg-white focus:outline-none"
				/>
			</div>

			<ScrollArea className="flex-1">
				<div className="space-y-3 p-4">
					{tab === "help" && (
						<>
							<Card title="What this lesson is about">
								<p className="line-clamp-[12] text-[12.5px] leading-relaxed text-slate-600">
									{filt(description) ? description : "No match in this section."}
								</p>
							</Card>
							{task && filt(task) && (
								<Card title="Your task" tone="amber">
									<p className="text-[12.5px] leading-relaxed text-slate-700">{task}</p>
								</Card>
							)}
							{hint && filt(hint) && (
								<Card title="Hint" tone="amber">
									<p className="text-[12.5px] leading-relaxed text-slate-700">{hint}</p>
								</Card>
							)}
							{requirements.length > 0 && (
								<Card title="Requirements">
									<ul className="space-y-1.5 text-[12.5px] text-slate-700">
										{requirements.filter(filt).map((r, i) => (
											<li key={i} className="flex gap-2">
												<span className="mt-1 h-1 w-1 shrink-0 rounded-full bg-slate-400" />
												<span>{r}</span>
											</li>
										))}
									</ul>
								</Card>
							)}
						</>
					)}

					{tab === "explain" && (
						<>
							<Card title="Your code">
								<pre className="max-h-48 overflow-auto rounded-lg bg-slate-900 p-3 font-mono text-[11.5px] leading-relaxed text-slate-100">
									{code || "// (write some code to see it here)"}
								</pre>
							</Card>
							<Card title="Line-by-line">
								<ul className="space-y-1 font-mono text-[11.5px] text-slate-700">
									{(code || "").split("\n").slice(0, 12).map((line, i) => (
										<li key={i} className="flex gap-3">
											<span className="w-5 text-right text-slate-400">
												{i + 1}
											</span>
											<span className="min-w-0 flex-1 truncate">
												{line || <span className="italic text-slate-400">(empty)</span>}
											</span>
										</li>
									))}
								</ul>
								<p className="mt-3 text-[11.5px] text-slate-500">
									Tip: each <code className="rounded bg-slate-100 px-1">andika()</code> prints its
									argument followed by a newline.
								</p>
							</Card>
						</>
					)}

					{tab === "examples" && (
						<>
							{lesson.solution && (
								<Card title="A working example">
									<pre className="max-h-56 overflow-auto rounded-lg bg-slate-900 p-3 font-mono text-[11.5px] leading-relaxed text-slate-100">
										{lesson.solution}
									</pre>
								</Card>
							)}
							<Card title="Starter code">
								<pre className="max-h-40 overflow-auto rounded-lg bg-slate-900 p-3 font-mono text-[11.5px] leading-relaxed text-slate-100">
									{lesson.initialCode}
								</pre>
							</Card>
						</>
					)}

					{tab === "fix" && (
						<>
							{failed.length === 0 && (!testErrors || testErrors.length === 0) ? (
								<div className="rounded-xl border border-emerald-200 bg-emerald-50/60 px-4 py-6 text-center">
									<CheckCircle2 className="mx-auto mb-2 h-6 w-6 text-emerald-500" />
									<p className="text-[12.5px] font-medium text-emerald-800">
										Nothing to fix yet. Run your code to see results here.
									</p>
								</div>
							) : (
								<>
									{testErrors && testErrors.length > 0 && (
										<Card title="Error messages" tone="red">
											<ul className="space-y-1 text-[12px] text-red-700">
												{testErrors.map((e, i) => (
													<li key={i}>{e}</li>
												))}
											</ul>
										</Card>
									)}
									{failed.length > 0 && (
										<Card title={`${failed.length} test(s) failing`} tone="red">
											<ul className="space-y-2 text-[12px]">
												{failed.map(([id, r], i) => (
													<li key={id} className="rounded-lg bg-white p-2.5">
														<div className="flex items-center gap-2 font-semibold text-slate-800">
															<XCircle className="h-3.5 w-3.5 text-red-500" />
															Test {i + 1}
														</div>
														{r.error && (
															<div className="mt-1 text-red-600">{r.error}</div>
														)}
													</li>
												))}
											</ul>
										</Card>
									)}
									{mistakes.length > 0 && (
										<Card title="Common mistakes" tone="amber">
											<ul className="space-y-1.5 text-[12.5px] text-slate-700">
												{mistakes.map((m, i) => (
													<li key={i} className="flex gap-2">
														<AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-500" />
														<span>{m}</span>
													</li>
												))}
											</ul>
										</Card>
									)}
								</>
							)}
							{passed.length > 0 && (
								<p className="text-center text-[11.5px] text-slate-500">
									{passed.length} test{passed.length === 1 ? "" : "s"} already passing — keep going.
								</p>
							)}
						</>
					)}
				</div>
			</ScrollArea>
		</aside>
	);
}

function Card({
	title,
	tone = "slate",
	children,
}: {
	title: string;
	tone?: "slate" | "amber" | "red";
	children: React.ReactNode;
}) {
	const toneCls =
		tone === "amber"
			? "border-amber-200 bg-amber-50/60"
			: tone === "red"
				? "border-red-200 bg-red-50/60"
				: "border-slate-200 bg-white";
	return (
		<div className={cn("overflow-hidden rounded-xl border", toneCls)}>
			<div className="border-b border-slate-100/70 bg-white/40 px-3.5 py-2 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
				{title}
			</div>
			<div className="px-3.5 py-3">{children}</div>
		</div>
	);
}
