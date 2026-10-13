import { Globe, Lock, Building2 } from "lucide-react";
import { cn } from "@nuru/ui/lib/utils";
import { difficultyKey, type Dict } from "@/lib/dict";

const DIFFICULTY_STYLE: Record<string, string> = {
	mwanzilishi: "bg-mwani text-white",
	"wa kati": "bg-chungwa text-[#15120f]",
	"wa juu": "bg-pilipili text-[#15120f]",
};

const DIFFICULTY_DOTS: Record<string, number> = { mwanzilishi: 1, "wa kati": 2, "wa juu": 3 };

/** Difficulty sticker: colour plus one to three pips, so it reads without colour too. */
export function DifficultySticker({ value, t, className }: { value: string | null | undefined; t: Dict; className?: string }) {
	const key = difficultyKey(value);
	const dots = DIFFICULTY_DOTS[key];
	return (
		<span className={cn("lebo inline-flex items-center gap-1.5 rounded-sm border-2 border-mstari px-1.5 py-0.5", DIFFICULTY_STYLE[key], className)}>
			<span className="flex gap-0.5" aria-hidden>
				{[1, 2, 3].map((i) => (
					<span key={i} className={cn("size-1.5 rounded-full border border-current", i <= dots ? "bg-current" : "opacity-50")} />
				))}
			</span>
			{t.difficulty[key]}
		</span>
	);
}

const VIS_ICON = { public: Globe, private: Lock, organization: Building2 } as const;

export function VisibilitySticker({ value, t, className }: { value: string; t: Dict; className?: string }) {
	const v = (value in VIS_ICON ? value : "private") as keyof typeof VIS_ICON;
	const Icon = VIS_ICON[v];
	return (
		<span className={cn("lebo inline-flex items-center gap-1 rounded-sm border-2 border-mstari px-1.5 py-0.5", v === "public" ? "bg-bahari text-white" : "bg-card text-foreground", className)}>
			<Icon className="size-3" aria-hidden />
			{t.visibility[v]}
		</span>
	);
}

/** Module accent colours, cycled by position. */
export const MODULE_ACCENTS = ["text-jua", "text-bahari", "text-mwani", "text-zambarau", "text-chungwa", "text-udongo"];
export const MODULE_FILLS = ["bg-jua", "bg-bahari", "bg-mwani", "bg-zambarau", "bg-chungwa", "bg-udongo"];
