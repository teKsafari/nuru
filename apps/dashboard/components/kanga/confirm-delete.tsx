"use client";

import { useEffect, useState, useTransition } from "react";
import { Trash2 } from "lucide-react";
import { Button } from "@nuru/ui/components/button";
import { cn } from "@nuru/ui/lib/utils";

/** Two-step delete: the first press arms it, the second within 4s runs the action. */
export function ConfirmDelete({ action, label, confirmLabel, className }: { action: () => Promise<unknown>; label: string; confirmLabel: string; className?: string }) {
	const [armed, setArmed] = useState(false);
	const [pending, start] = useTransition();

	useEffect(() => {
		if (!armed) return;
		const id = setTimeout(() => setArmed(false), 4000);
		return () => clearTimeout(id);
	}, [armed]);

	return (
		<Button
			type="button"
			variant={armed ? "destructive" : "ghost"}
			size={armed ? "default" : "icon"}
			disabled={pending}
			aria-label={armed ? confirmLabel : label}
			title={armed ? confirmLabel : label}
			className={cn(!armed && "size-10 text-muted-foreground hover:text-pilipili", className)}
			onClick={() => {
				if (!armed) return setArmed(true);
				start(async () => {
					await action();
				});
			}}
		>
			<Trash2 />
			{armed && confirmLabel}
		</Button>
	);
}
