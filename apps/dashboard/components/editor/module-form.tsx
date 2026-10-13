"use client";

import { useTransition } from "react";
import Link from "next/link";
import { useForm, Controller } from "react-hook-form";
import { ArrowLeft, Loader2 } from "lucide-react";
import { Label } from "@nuru/ui/components/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@nuru/ui/components/select";
import { Input } from "@nuru/ui/components/input";
import { Button } from "@nuru/ui/components/button";
import { useDict } from "@/components/providers/lang-provider";
import { difficultyKey } from "@/lib/dict";
import { DifficultySticker, VisibilitySticker } from "@/components/shared/stickers";

export type ModuleFormInputs = {
	title: { sw: string; en: string };
	difficulty: string;
	visibility: string;
};

export default function ModuleForm({
	onSubmit,
	initialData,
	isUpdate = false,
	backHref,
	backLabel,
}: {
	onSubmit: (data: ModuleFormInputs) => Promise<unknown> | void;
	initialData?: Partial<ModuleFormInputs>;
	isUpdate?: boolean;
	backHref: string;
	backLabel?: string;
}) {
	const { t } = useDict();
	const [pending, start] = useTransition();
	const {
		register,
		control,
		handleSubmit,
		formState: { errors },
	} = useForm<ModuleFormInputs>({
		defaultValues: {
			title: { sw: initialData?.title?.sw ?? "", en: initialData?.title?.en ?? "" },
			difficulty: difficultyKey(initialData?.difficulty ?? "mwanzilishi"),
			visibility: initialData?.visibility || "private",
		},
	});

	return (
		<form onSubmit={handleSubmit((d) => start(async () => void (await onSubmit(d))))} className="mx-auto w-full max-w-2xl space-y-6">
			<Link href={backHref} className="lebo inline-flex min-h-10 items-center gap-1.5 text-muted-foreground hover:text-foreground">
				<ArrowLeft className="size-4" />
				{backLabel ?? t.modules.back}
			</Link>
			<div className="kadi overflow-hidden">
				<div className="space-y-6 p-5 sm:p-7">
					<h1 className="font-display text-3xl font-extrabold">{isUpdate ? t.moduleForm.editTitle : t.moduleForm.createTitle}</h1>

					<fieldset className="space-y-3">
						<legend className="mb-3 font-semibold">{t.moduleForm.titleLabel}</legend>
						<div className="grid gap-4 sm:grid-cols-2">
							<div className="space-y-1.5">
								<Label htmlFor="title-sw" className="lebo">
									{t.moduleForm.titleSw}
								</Label>
								<Input id="title-sw" placeholder="Misingi ya Nuru" {...register("title.sw", { validate: (v) => v.trim().length > 0 || t.moduleForm.titleRequired })} />
								{errors.title?.sw && <p className="text-sm font-semibold text-pilipili">{errors.title.sw.message}</p>}
							</div>
							<div className="space-y-1.5">
								<Label htmlFor="title-en" className="lebo text-muted-foreground">
									{t.moduleForm.titleEn}
								</Label>
								<Input id="title-en" placeholder="Nuru basics" {...register("title.en")} />
							</div>
						</div>
					</fieldset>

					<div className="grid gap-4 sm:grid-cols-2">
						<div className="space-y-1.5">
							<Label className="font-semibold">{t.modules.difficulty}</Label>
							<Controller
								control={control}
								name="difficulty"
								render={({ field }) => (
									<Select value={field.value} onValueChange={field.onChange}>
										<SelectTrigger aria-label={t.modules.difficulty}>
											<SelectValue />
										</SelectTrigger>
										<SelectContent>
											{["mwanzilishi", "wa kati", "wa juu"].map((d) => (
												<SelectItem key={d} value={d}>
													<DifficultySticker value={d} t={t} />
												</SelectItem>
											))}
										</SelectContent>
									</Select>
								)}
							/>
							<p className="text-xs text-muted-foreground">{t.moduleForm.difficultyHelp}</p>
						</div>
						<div className="space-y-1.5">
							<Label className="font-semibold">{t.modules.visibility}</Label>
							<Controller
								control={control}
								name="visibility"
								render={({ field }) => (
									<Select value={field.value} onValueChange={field.onChange}>
										<SelectTrigger aria-label={t.modules.visibility}>
											<SelectValue />
										</SelectTrigger>
										<SelectContent>
											{["private", "public", "organization"].map((v) => (
												<SelectItem key={v} value={v}>
													<VisibilitySticker value={v} t={t} />
												</SelectItem>
											))}
										</SelectContent>
									</Select>
								)}
							/>
							<p className="text-xs text-muted-foreground">{t.moduleForm.visibilityHelp}</p>
						</div>
					</div>

					<div className="flex justify-end border-t-2 border-dashed border-mstari/30 pt-5">
						<Button type="submit" size="lg" disabled={pending}>
							{pending && <Loader2 className="animate-spin" />}
							{pending && !isUpdate ? t.moduleForm.creating : isUpdate ? t.moduleForm.save : t.moduleForm.create}
						</Button>
					</div>
				</div>
			</div>
		</form>
	);
}
