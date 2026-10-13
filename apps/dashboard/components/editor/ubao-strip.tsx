import { cn } from "@nuru/ui/lib/utils";

/** An ubao_mfuatano expectation ("10000000 11000000 ...") drawn as rows of 8 LEDs. */
export function UbaoStrip({ sequence, className, max = 12 }: { sequence: string; className?: string; max?: number }) {
	const states = sequence.trim().split(/\s+/).filter((s) => /^[01]{8}$/.test(s));
	if (states.length === 0) return null;
	const shown = states.slice(0, max);
	return (
		<div className={cn("space-y-1 rounded-md border-2 border-mstari bg-[#1f1a16] p-2", className)}>
			{shown.map((s, i) => (
				<div key={i} className="flex items-center gap-1.5">
					<span className="w-5 text-right font-mono text-[10px] text-[#fff3d6]/50">{i + 1}</span>
					{s.split("").map((b, j) => (
						<span key={j} className={cn("size-3.5 rounded-full border border-black/60", b === "1" ? "bg-jua" : "bg-[#3a322a]")} />
					))}
				</div>
			))}
			{states.length > max && <p className="pl-6 font-mono text-[10px] text-[#fff3d6]/50">+{states.length - max}</p>}
		</div>
	);
}
