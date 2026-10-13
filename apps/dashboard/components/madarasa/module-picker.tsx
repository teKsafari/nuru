"use client";

import { Check } from "lucide-react";
import { cn } from "@nuru/ui/lib/utils";
import type { AssignableModule } from "@/app/actions/madarasa";
import type { Lang } from "@/lib/dict";

/** Checklist of public modules. Order of selection is the order learners see them. */
export function ModulePicker({
	modules,
	value,
	onChange,
	lang,
	lessonsLabel,
}: {
	modules: AssignableModule[];
	value: string[];
	onChange: (ids: string[]) => void;
	lang: Lang;
	lessonsLabel: string;
}) {
	return (
		<ul className="grid gap-2">
			{modules.map((m) => {
				const at = value.indexOf(m.id);
				const on = at >= 0;
				return (
					<li key={m.id}>
						<button
							type="button"
							role="checkbox"
							aria-checked={on}
							onClick={() => onChange(on ? value.filter((id) => id !== m.id) : [...value, m.id])}
							className={cn(
								"flex min-h-12 w-full items-center gap-3 rounded-md border-2 border-mstari px-3 py-2 text-left transition-[transform,box-shadow] duration-100",
								on ? "bg-jua/40 shadow-kivuli-sm" : "bg-card hover:bg-karatasi-2",
							)}
						>
							<span
								className={cn(
									"flex size-6 shrink-0 items-center justify-center rounded-sm border-2 border-mstari font-mono text-xs font-bold",
									on ? "bg-wino text-karatasi" : "bg-card",
								)}
								aria-hidden
							>
								{on ? at + 1 : null}
							</span>
							<span className="min-w-0 flex-1 font-semibold">{m.title[lang] || m.title.sw}</span>
							<span className="lebo shrink-0 text-muted-foreground">
								{m.lessons} {lessonsLabel}
							</span>
							{on && <Check className="size-4 shrink-0" aria-hidden />}
						</button>
					</li>
				);
			})}
		</ul>
	);
}
