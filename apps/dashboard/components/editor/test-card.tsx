"use client";

import { Controller, type Control, type UseFormRegister } from "react-hook-form";
import { Camera, Check, Eye, EyeOff, Loader2, Trash2, X } from "lucide-react";
import { Label } from "@nuru/ui/components/label";
import { Input } from "@nuru/ui/components/input";
import { Button } from "@nuru/ui/components/button";
import { Textarea } from "@nuru/ui/components/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@nuru/ui/components/select";
import { TEST_TYPES, type TestCaseV1, type TestType } from "@nuru/ui/validation/test-cases";
import type { GradeResult } from "@nuru/ui/validation/grader";
import { cn } from "@nuru/ui/lib/utils";
import type { Dict } from "@/lib/dict";
import { SignatureCells, signatureSize } from "./kobe-still";
import { UbaoStrip } from "./ubao-strip";
import type { LessonFormValues } from "./lesson-editor";

// One accent per test type, so a long list scans by colour and by label.
export const TYPE_ACCENT: Record<TestType, string> = {
	io: "bg-bahari text-white",
	exact_output: "bg-mwani text-white",
	match_output: "bg-zambarau text-[#15120f]",
	match_code: "bg-chungwa text-[#15120f]",
	kobe_picha: "bg-jua text-[#15120f]",
	ubao_mfuatano: "bg-udongo text-white",
};

const CAPTURABLE: TestType[] = ["io", "exact_output", "kobe_picha", "ubao_mfuatano"];

function regexError(pattern?: string, flags?: string) {
	try {
		new RegExp(pattern ?? "", flags ?? "");
		return null;
	} catch (e) {
		return e instanceof Error ? e.message : "regex";
	}
}

export function TestCard({
	index,
	value,
	control,
	register,
	onRemove,
	onCapture,
	capturing,
	canCapture,
	result,
	t,
}: {
	index: number;
	value: TestCaseV1;
	control: Control<LessonFormValues>;
	register: UseFormRegister<LessonFormValues>;
	onRemove: () => void;
	onCapture: () => void;
	capturing: boolean;
	canCapture: boolean;
	result?: GradeResult;
	t: Dict;
}) {
	const type = value.type;
	const e = t.editor;
	const reErr = type === "match_output" || type === "match_code" ? regexError(value.pattern, value.flags) : null;

	return (
		<div className={cn("overflow-hidden rounded-lg border-2 border-mstari bg-card shadow-kivuli-sm", result && !result.passed && "outline-3 outline-pilipili outline-offset-2")}>
			<div className="flex flex-wrap items-center gap-2 border-b-2 border-mstari bg-karatasi-2 px-3 py-2">
				<span className={cn("lebo rounded-sm border-2 border-mstari px-1.5 py-0.5", TYPE_ACCENT[type])}>
					{e.test} {index + 1}
				</span>
				<Controller
					control={control}
					name={`tests.${index}.type`}
					render={({ field }) => (
						<Select value={field.value} onValueChange={field.onChange}>
							<SelectTrigger className="h-9 w-auto min-w-[12rem] flex-1 sm:flex-none" aria-label={e.type}>
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								{TEST_TYPES.map((tt) => (
									<SelectItem key={tt} value={tt}>
										<span className="flex items-center gap-2">
											<span className={cn("size-2.5 rounded-full border border-mstari", TYPE_ACCENT[tt].split(" ")[0])} />
											{t.testTypes[tt]}
										</span>
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					)}
				/>
				{result && (
					<span className={cn("lebo inline-flex items-center gap-1 rounded-sm border-2 border-mstari px-1.5 py-0.5", result.passed ? "bg-mwani text-white" : "bg-pilipili text-[#15120f]")}>
						{result.passed ? <Check className="size-3" /> : <X className="size-3" />}
						{result.passed ? t.verify.pass : t.verify.fail}
						{typeof result.score === "number" && ` · ${Math.round(result.score * 100)}%`}
					</span>
				)}
				<div className="ml-auto flex items-center gap-1">
					<Controller
						control={control}
						name={`tests.${index}.isPublic`}
						render={({ field }) => (
							<button
								type="button"
								aria-pressed={!!field.value}
								onClick={() => field.onChange(!field.value)}
								title={e.public}
								className={cn(
									"flex h-9 items-center gap-1.5 rounded-md border-2 px-2 text-xs font-semibold transition-colors",
									field.value ? "border-mstari bg-card text-foreground" : "border-dashed border-mstari/40 text-muted-foreground",
								)}
							>
								{field.value ? <Eye className="size-4" /> : <EyeOff className="size-4" />}
								<span className="hidden sm:inline">{e.public}</span>
							</button>
						)}
					/>
					<Button type="button" variant="ghost" size="icon" className="size-9 text-muted-foreground hover:text-pilipili" onClick={onRemove} aria-label={e.remove} title={e.remove}>
						<Trash2 />
					</Button>
				</div>
			</div>

			<div className="space-y-4 p-3 sm:p-4">
				<p className="text-xs text-muted-foreground">{t.testTypeHelp[type]}</p>

				{type === "io" && (
					<div className="grid gap-4 md:grid-cols-2">
						<div className="space-y-1.5">
							<Label className="lebo">{e.input}</Label>
							<Textarea rows={3} {...register(`tests.${index}.input`)} className="font-mono text-sm" placeholder={"Asha\n12"} />
						</div>
						<div className="space-y-1.5">
							<Label className="lebo">{e.expected}</Label>
							<Textarea rows={3} {...register(`tests.${index}.expectedOutput`)} className="font-mono text-sm" />
						</div>
					</div>
				)}

				{type === "exact_output" && (
					<div className="space-y-1.5">
						<Label className="lebo">{e.expected}</Label>
						<Textarea rows={3} {...register(`tests.${index}.expectedOutput`)} className="font-mono text-sm" placeholder="Habari Nuru!" />
					</div>
				)}

				{(type === "match_output" || type === "match_code") && (
					<div className="grid gap-4 sm:grid-cols-[1fr_7rem]">
						<div className="space-y-1.5">
							<Label className="lebo">{e.pattern}</Label>
							<Input {...register(`tests.${index}.pattern`)} className={cn("font-mono text-sm", reErr && "border-pilipili")} placeholder={type === "match_code" ? "kwa\\s+\\w+\\s+ktk" : "jina langu ni .+"} />
							{reErr && <p className="font-mono text-xs text-pilipili">{reErr}</p>}
						</div>
						<div className="space-y-1.5">
							<Label className="lebo">{e.flags}</Label>
							<Input {...register(`tests.${index}.flags`)} className="font-mono text-sm" placeholder="i" />
						</div>
					</div>
				)}

				{type === "kobe_picha" && (
					<div className="flex flex-col gap-3 sm:flex-row sm:items-start">
						<SignatureCells signature={value.expectedOutput} className="w-full max-w-[160px]" />
						<div className="space-y-2 text-sm">
							{signatureSize(value.expectedOutput) > 0 ? (
								<p className="font-mono font-semibold">
									{signatureSize(value.expectedOutput)} {e.kobeCells}
								</p>
							) : (
								<p className="text-muted-foreground">{e.kobeEmpty}</p>
							)}
						</div>
					</div>
				)}

				{type === "ubao_mfuatano" && (
					<div className="space-y-2">
						<Label className="lebo">{e.ubaoStates}</Label>
						<Input {...register(`tests.${index}.expectedOutput`)} className="font-mono text-sm" placeholder="10000000 11000000 11100000" />
						<UbaoStrip sequence={value.expectedOutput ?? ""} className="max-w-xs" />
					</div>
				)}

				{CAPTURABLE.includes(type) && (
					<Button type="button" variant="outline" size="sm" disabled={!canCapture || capturing} onClick={onCapture}>
						{capturing ? <Loader2 className="animate-spin" /> : <Camera />}
						{e.capture}
					</Button>
				)}

				<div className="space-y-1.5">
					<Label className="lebo">{e.message}</Label>
					<Input {...register(`tests.${index}.message`)} placeholder={e.messagePlaceholder} />
				</div>

				{result && !result.passed && (result.actualOutput || result.error) && (
					<div className="rounded-md border-2 border-dashed border-pilipili bg-tint-pilipili p-2">
						<p className="lebo mb-1 text-pilipili">{t.verify.got}</p>
						<pre className="max-h-32 overflow-auto whitespace-pre-wrap font-mono text-xs">{result.actualOutput || result.error}</pre>
					</div>
				)}
			</div>
		</div>
	);
}
