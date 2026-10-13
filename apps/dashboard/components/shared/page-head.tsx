import type { ReactNode } from "react";
import { cn } from "@nuru/ui/lib/utils";

/** Page title block: a mono sticker above a display heading, actions on the right. */
export function PageHead({ eyebrow, title, lead, actions, className }: { eyebrow?: ReactNode; title: ReactNode; lead?: ReactNode; actions?: ReactNode; className?: string }) {
	return (
		<div className={cn("flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between", className)}>
			<div className="min-w-0">
				{eyebrow && <div className="lebo mb-2 text-muted-foreground">{eyebrow}</div>}
				<h1 className="font-display text-3xl font-extrabold leading-tight tracking-tight text-balance sm:text-4xl">{title}</h1>
				{lead && <p className="mt-2 max-w-2xl text-base text-muted-foreground">{lead}</p>}
			</div>
			{actions && <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div>}
		</div>
	);
}

/** Empty state on graph paper. */
export function EmptyState({ icon, title, body, action }: { icon: ReactNode; title: ReactNode; body?: ReactNode; action?: ReactNode }) {
	return (
		<div className="gridi flex flex-col items-center rounded-lg border-2 border-dashed border-mstari px-6 py-14 text-center">
			<div className="kadi mb-5 flex size-16 items-center justify-center bg-jua text-[#15120f] [&_svg]:size-8">{icon}</div>
			<h3 className="font-display text-xl font-bold">{title}</h3>
			{body && <p className="mt-2 max-w-sm text-muted-foreground">{body}</p>}
			{action && <div className="mt-6">{action}</div>}
		</div>
	);
}
