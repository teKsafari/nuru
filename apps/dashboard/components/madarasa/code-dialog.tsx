"use client";

import { useEffect, useState } from "react";
import { useTheme } from "@wrksz/themes/client";
import { CheckCircle2, CircleDot } from "lucide-react";

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@nuru/ui/components/dialog";
import { CodeEditor } from "@nuru/ui/components/code-editor";
import { nuru } from "@nuru/ui/lib/nuru-syntax";
import { getLastCode } from "@/app/actions/madarasa";
import type { MadarasaStrings } from "./strings";

const extensions = [nuru];

export type CodeTarget = { mwanafunziId: string; learnerName: string; lessonId: string; lessonTitle: string } | null;

/** Read-only viewer for a learner's last submitted code on one lesson. */
export function CodeDialog({ target, onClose, s }: { target: CodeTarget; onClose: () => void; s: MadarasaStrings }) {
	const { resolvedTheme } = useTheme();
	const [state, setState] = useState<{ loading: boolean; code: string | null; attempts: number; passed: boolean }>({
		loading: false,
		code: null,
		attempts: 0,
		passed: false,
	});

	useEffect(() => {
		if (!target) return;
		let live = true;
		setState({ loading: true, code: null, attempts: 0, passed: false });
		getLastCode(target.mwanafunziId, target.lessonId)
			.then((r) => live && setState({ loading: false, code: r?.lastCode ?? null, attempts: r?.attempts ?? 0, passed: !!r?.passed }))
			.catch(() => live && setState({ loading: false, code: null, attempts: 0, passed: false }));
		return () => {
			live = false;
		};
	}, [target]);

	return (
		<Dialog open={!!target} onOpenChange={(o) => !o && onClose()}>
			<DialogContent className="max-w-2xl">
				<DialogHeader>
					<DialogTitle className="pr-10 font-display text-xl">
						{target?.learnerName} · {target?.lessonTitle}
					</DialogTitle>
					<DialogDescription className="flex items-center gap-2">
						{state.passed ? <CheckCircle2 className="size-4 text-mwani" aria-hidden /> : <CircleDot className="size-4 text-chungwa" aria-hidden />}
						{s.lastCode} · {state.passed ? s.passed : s.tried} · {state.attempts} {state.attempts === 1 ? s.attempt : s.attempts}
					</DialogDescription>
				</DialogHeader>
				<div className="max-h-[60dvh] overflow-auto rounded-md border-2 border-mstari">
					{state.loading ? (
						<p className="p-4 text-sm text-muted-foreground">{s.loading}</p>
					) : state.code ? (
						<CodeEditor code={state.code} readOnly extensions={extensions} theme={resolvedTheme === "dark" ? "dark" : "light"} />
					) : (
						<p className="p-4 text-sm text-muted-foreground">{s.noCode}</p>
					)}
				</div>
			</DialogContent>
		</Dialog>
	);
}
