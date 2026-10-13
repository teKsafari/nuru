"use client";

import { cn } from "@nuru/ui/lib/utils";
import { PICHA_IDS, PICHA_UREFU, type PichaId } from "@/lib/darasa/shared";
import { Picha, PICHA_MAJINA, PICHA_RANGI } from "./picha";

interface PictureGridProps {
	value: PichaId[];
	onChange: (next: PichaId[]) => void;
	label: string;
	disabled?: boolean;
	/** Bump to replay the "wrong" shake. */
	shakeKey?: number;
}

/**
 * The 3x3 picture-password grid. Tiles are at least 96px square on a 360px phone.
 * Tapping a chosen tile again removes it (and everything chosen after it).
 */
export function PictureGrid({ value, onChange, label, disabled, shakeKey = 0 }: PictureGridProps) {
	function tap(id: PichaId) {
		if (disabled) return;
		const at = value.indexOf(id);
		if (at >= 0) onChange(value.slice(0, at));
		else if (value.length < PICHA_UREFU) onChange([...value, id]);
	}

	return (
		<>
		<style>{`@keyframes tikisa{0%,100%{transform:translateX(0)}20%{transform:translateX(-8px)}40%{transform:translateX(7px)}60%{transform:translateX(-5px)}80%{transform:translateX(3px)}}`}</style>
		<div
			key={shakeKey}
			role="group"
			aria-label={label}
			className={cn("grid grid-cols-3 gap-2.5 sm:gap-3", shakeKey > 0 && "animate-[tikisa_320ms_ease-in-out]")}
		>
			{PICHA_IDS.map((id) => {
				const order = value.indexOf(id);
				const chosen = order >= 0;
				return (
					<button
						key={id}
						type="button"
						onClick={() => tap(id)}
						disabled={disabled}
						aria-pressed={chosen}
						aria-label={chosen ? `${PICHA_MAJINA[id]} (${order + 1})` : PICHA_MAJINA[id]}
						className={cn(
							"relative flex aspect-square min-h-24 flex-col items-center justify-center gap-1 rounded-lg border-2 border-mstari p-2 transition-[transform,box-shadow] duration-100 select-none",
							chosen
								? "translate-x-0.5 translate-y-0.5 bg-jua shadow-none ring-3 ring-wino ring-offset-2 ring-offset-karatasi"
								: cn(PICHA_RANGI[id], "shadow-kivuli-sm hover:-translate-x-px hover:-translate-y-px hover:shadow-kivuli active:translate-x-0.5 active:translate-y-0.5 active:shadow-none"),
							disabled && "opacity-60",
						)}
					>
						<Picha id={id} className="size-[62%] max-h-20" />
						<span className="font-mono text-[0.7rem] leading-none font-bold tracking-wide text-wino">{PICHA_MAJINA[id]}</span>
						{chosen && (
							<span className="absolute -top-2.5 -right-2.5 flex size-8 items-center justify-center rounded-full border-2 border-mstari bg-wino font-display text-base font-extrabold text-karatasi">
								{order + 1}
							</span>
						)}
					</button>
				);
			})}
		</div>
		</>
	);
}

/** Three slots showing the pictures picked so far. */
export function PichaSlots({ value }: { value: PichaId[] }) {
	return (
		<div className="flex items-center justify-center gap-2" aria-hidden>
			{Array.from({ length: PICHA_UREFU }, (_, i) => (
				<span
					key={i}
					className={cn(
						"flex size-12 items-center justify-center rounded-md border-2 border-mstari",
						value[i] ? "bg-card shadow-kivuli-sm" : "border-dashed bg-transparent",
					)}
				>
					{value[i] ? <Picha id={value[i]} className="size-9" /> : <span className="lebo text-muted-foreground">{i + 1}</span>}
				</span>
			))}
		</div>
	);
}
