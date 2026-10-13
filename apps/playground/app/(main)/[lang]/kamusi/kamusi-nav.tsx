"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@nuru/ui/lib/utils";

type Item = { id: string; title: string };

// Section nav with scroll-spy. Desktop: a sticky column. Phone: a sticky row of
// chips that scrolls sideways and keeps the active chip in view.
export function KamusiNav({ items, label, variant }: { items: Item[]; label: string; variant: "column" | "chips" }) {
	const [active, setActive] = useState(items[0]?.id);
	const rowRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const sections = items.map((i) => document.getElementById(i.id)).filter(Boolean) as HTMLElement[];
		const io = new IntersectionObserver(
			(entries) => {
				const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
				if (visible[0]) setActive(visible[0].target.id);
			},
			{ rootMargin: "-15% 0px -70% 0px" },
		);
		sections.forEach((s) => io.observe(s));
		return () => io.disconnect();
	}, [items]);

	useEffect(() => {
		if (variant !== "chips" || !rowRef.current) return;
		const chip = rowRef.current.querySelector<HTMLElement>(`[data-id="${active}"]`);
		if (chip) rowRef.current.scrollTo({ left: chip.offsetLeft - 16, behavior: "smooth" });
	}, [active, variant]);

	if (variant === "chips")
		return (
			<nav aria-label={label}>
				<div ref={rowRef} className="flex gap-2 overflow-x-auto px-4 py-2.5 [scrollbar-width:none] sm:px-8">
					{items.map((item) => (
						<a
							key={item.id}
							href={`#${item.id}`}
							data-id={item.id}
							aria-current={active === item.id ? "location" : undefined}
							className={cn(
								"shrink-0 rounded-md border-2 border-mstari px-3 py-1.5 text-sm font-semibold whitespace-nowrap",
								active === item.id ? "bg-wino text-karatasi" : "bg-card",
							)}
						>
							{item.title}
						</a>
					))}
				</div>
			</nav>
		);

	return (
		<nav aria-label={label}>
			<p className="lebo mb-3 text-muted-foreground">{label}</p>
			<ol className="space-y-0.5 border-l-2 border-mstari">
				{items.map((item, i) => (
					<li key={item.id}>
						<a
							href={`#${item.id}`}
							aria-current={active === item.id ? "location" : undefined}
							className={cn(
								"-ml-[2px] flex items-baseline gap-2 border-l-4 py-1.5 pr-2 pl-3 text-[15px] transition-colors",
								active === item.id ? "border-jua bg-card font-semibold" : "border-transparent text-foreground/70 hover:text-foreground",
							)}
						>
							<span className="font-mono text-[11px] text-muted-foreground">{String(i + 1).padStart(2, "0")}</span>
							{item.title}
						</a>
					</li>
				))}
			</ol>
		</nav>
	);
}
