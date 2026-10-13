"use client";

import { memo, useMemo } from "react";
import Markdown from "react-markdown";
import { ExternalLink, Lightbulb, Target } from "lucide-react";
import { CodeEditor } from "@nuru/ui/components/code-editor";
import { nuru } from "@nuru/ui/lib/nuru-syntax";
import { parseHighlights } from "@/lib/utils/highlights";
import { uwanjaHref } from "@/lib/share";

// The +++highlight+++ convention marks the part of an example the learner should look at.
const HIGHLIGHT_CLASS = "bg-jua/45 rounded-[3px] px-0.5 text-[#15120f] font-semibold";
const extensions = [nuru];

function CodeBlock({ source, lang, theme, tryLabel }: { source: string; lang: string; theme: "light" | "dark"; tryLabel: string }) {
	const { cleanedCode, highlights } = useMemo(() => {
		const parsed = parseHighlights(source.replace(/\n$/, ""));
		return { cleanedCode: parsed.cleanedCode, highlights: parsed.highlights.map((h) => ({ ...h, className: HIGHLIGHT_CLASS })) };
	}, [source]);
	return (
		<div className="not-prose my-5 overflow-hidden rounded-lg border-2 border-mstari bg-[var(--editor-bg)] shadow-kivuli-sm">
			<div className="flex items-center justify-between border-b-2 border-mstari bg-karatasi-2 px-3 py-1">
				<span className="lebo text-muted-foreground">mfano.nr</span>
				<a
					href={uwanjaHref(lang, cleanedCode)}
					target="_blank"
					rel="noopener"
					className="lebo inline-flex h-7 items-center gap-1 rounded-sm px-1.5 text-foreground hover:bg-jua hover:text-wino"
				>
					{tryLabel}
					<ExternalLink className="size-3" />
				</a>
			</div>
			<div className="py-1.5 text-[14px]">
				<CodeEditor code={cleanedCode} highlights={highlights} readOnly extensions={extensions} theme={theme} />
			</div>
		</div>
	);
}

interface LessonContentProps {
	description: string;
	task?: string;
	hint?: string | null;
	labels: { task: string; hint: string; tryIt: string };
	lang: string;
	theme: "light" | "dark";
}

export const LessonContent = memo(function LessonContent({ description, task, hint, labels, lang, theme }: LessonContentProps) {
	return (
		<div className="text-[15.5px] leading-[1.75] text-foreground/90">
			<Markdown
				components={{
					code(props) {
						const { children, className } = props;
						const isBlock = /language-(\w+)/.test(className || "") || String(children).includes("\n");
						if (isBlock) return <CodeBlock source={String(children)} lang={lang} theme={theme} tryLabel={labels.tryIt} />;
						return (
							<code className="rounded-[5px] border border-mstari/25 bg-karatasi-2 px-1.5 py-0.5 font-mono text-[0.88em] font-semibold text-foreground">
								{children}
							</code>
						);
					},
					pre: ({ children }) => <>{children}</>,
					p: ({ children }) => <p className="mb-4 last:mb-0">{children}</p>,
					h1: ({ children }) => <h2 className="mt-7 mb-3 font-display text-2xl font-bold">{children}</h2>,
					h2: ({ children }) => <h2 className="mt-7 mb-3 font-display text-xl font-bold">{children}</h2>,
					h3: ({ children }) => <h3 className="mt-6 mb-2 font-display text-lg font-bold">{children}</h3>,
					ul: ({ children }) => <ul className="mb-4 ml-5 list-disc space-y-1.5 marker:text-udongo">{children}</ul>,
					ol: ({ children }) => <ol className="mb-4 ml-5 list-decimal space-y-1.5 marker:font-mono marker:font-bold">{children}</ol>,
					strong: ({ children }) => <strong className="font-bold text-foreground">{children}</strong>,
					a: ({ children, href }) => (
						<a href={href} target="_blank" rel="noopener" className="font-semibold underline decoration-jua decoration-2 underline-offset-4">
							{children}
						</a>
					),
					blockquote: ({ children }) => <blockquote className="my-4 border-l-4 border-jua pl-4 italic">{children}</blockquote>,
				}}
			>
				{description}
			</Markdown>

			{task && (
				<section className="mji relative mt-8 bg-[color-mix(in_oklab,var(--jua)_22%,var(--card))] p-5 pt-6" data-testid="task">
					<span className="lebo absolute -top-3 left-4 inline-flex items-center gap-1.5 rounded-sm border-2 border-mstari bg-jua px-2 py-0.5 text-wino">
						<Target className="size-3.5" />
						{labels.task}
					</span>
					<div className="text-[15px] leading-relaxed text-foreground">
						<Markdown
							components={{
								p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
								code: ({ children }) => (
									<code className="rounded-[5px] border border-mstari/30 bg-card px-1.5 py-0.5 font-mono text-[0.88em] font-semibold">{children}</code>
								),
							}}
						>
							{task}
						</Markdown>
					</div>
				</section>
			)}

			{hint && (
				<section className="relative mt-7 rounded-lg border-2 border-dashed border-bahari bg-[color-mix(in_oklab,var(--bahari)_10%,var(--card))] p-4 pt-5" data-testid="hint">
					<span className="lebo absolute -top-3 left-4 inline-flex items-center gap-1.5 rounded-sm border-2 border-mstari bg-bahari px-2 py-0.5 text-white">
						<Lightbulb className="size-3.5" />
						{labels.hint}
					</span>
					<p className="text-[15px] leading-relaxed">{hint}</p>
				</section>
			)}
		</div>
	);
});
