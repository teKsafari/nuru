import { Fragment } from "react";
import { cn } from "@nuru/ui/lib/utils";

/**
 * Renders a short string with `code` and **bold** marks. Used for dictionary
 * copy and Kamusi prose so Nuru words stand out from the sentence around them.
 */
export function Inline({ text, codeClassName }: { text: string; codeClassName?: string }) {
	const parts = text.split(/(`[^`]+`|\*\*[^*]+\*\*)/g);
	return (
		<>
			{parts.map((part, i) => {
				if (part.startsWith("`") && part.endsWith("`") && part.length > 1)
					return (
						<code
							key={i}
							className={cn(
								"rounded-[5px] border border-current/25 bg-karatasi-2 px-1 py-px font-mono [font-variant-ligatures:none] text-[0.88em] font-medium text-foreground",
								codeClassName,
							)}
						>
							{part.slice(1, -1)}
						</code>
					);
				if (part.startsWith("**") && part.endsWith("**"))
					return (
						<strong key={i} className="font-semibold">
							{part.slice(2, -2)}
						</strong>
					);
				return <Fragment key={i}>{part}</Fragment>;
			})}
		</>
	);
}
