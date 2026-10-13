import { cn } from "@nuru/ui/lib/utils";
import { tokenize, tokenClass, tokenClassOnInk } from "./nuru-highlight";

/** Statically highlighted Nuru code. Renders on the server; ships no JS. */
export function NuruCode({
	code,
	onInk = false,
	className,
}: {
	code: string;
	/** Use the fixed night palette, for code on an ink panel. */
	onInk?: boolean;
	className?: string;
}) {
	const palette = onInk ? tokenClassOnInk : tokenClass;
	return (
		<pre className={cn("overflow-x-auto font-mono [font-variant-ligatures:none] text-[13px] leading-6 sm:text-sm", className)}>
			<code>
				{tokenize(code).map((t, i) =>
					palette[t.k] ? (
						<span key={i} className={palette[t.k]}>
							{t.v}
						</span>
					) : (
						t.v
					),
				)}
			</code>
		</pre>
	);
}
