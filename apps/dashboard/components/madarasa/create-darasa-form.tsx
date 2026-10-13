"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Plus } from "lucide-react";

import { Button } from "@nuru/ui/components/button";
import { createDarasa, type AssignableModule } from "@/app/actions/madarasa";
import { useDict } from "@/components/providers/lang-provider";
import { ModulePicker } from "./module-picker";
import { madarasaStrings } from "./strings";

export function CreateDarasaForm({ modules }: { modules: AssignableModule[] }) {
	const { lang } = useDict();
	const s = madarasaStrings(lang);
	const router = useRouter();
	const [name, setName] = useState("");
	const [moduleIds, setModuleIds] = useState<string[]>([]);
	const [error, setError] = useState<string | null>(null);
	const [pending, start] = useTransition();

	return (
		<form
			id="fungua"
			className="mji scroll-mt-24 p-5 sm:p-6"
			onSubmit={(e) => {
				e.preventDefault();
				setError(null);
				start(async () => {
					try {
						const res = await createDarasa({ name, moduleIds });
						if ("error" in res) return setError(res.error ?? s.errorGeneric);
						router.push(`/educator/madarasa/${res.id}`);
					} catch {
						setError(s.errorGeneric);
					}
				});
			}}
		>
			<h2 className="font-display text-2xl font-extrabold tracking-tight">{s.createTitle}</h2>
			<p className="mt-1 text-sm text-muted-foreground">{s.createLead}</p>

			<label htmlFor="darasa-jina" className="lebo mt-5 block">
				{s.name}
			</label>
			<input
				id="darasa-jina"
				value={name}
				onChange={(e) => setName(e.target.value)}
				required
				minLength={2}
				maxLength={60}
				placeholder={s.namePlaceholder}
				className="mt-2 h-12 w-full rounded-md border-2 border-mstari bg-card px-3 text-base font-semibold shadow-kivuli-sm placeholder:font-normal placeholder:text-muted-foreground focus-visible:ring-3 focus-visible:ring-ring focus-visible:outline-none"
			/>

			<fieldset className="mt-5">
				<legend className="lebo">{s.modules}</legend>
				<p className="mt-1 mb-3 text-sm text-muted-foreground">{s.modulesHint}</p>
				<ModulePicker modules={modules} value={moduleIds} onChange={setModuleIds} lang={lang} lessonsLabel={s.lessons} />
			</fieldset>

			{error && (
				<p role="alert" className="mt-4 rounded-md border-2 border-mstari bg-pilipili/15 px-3 py-2 text-sm font-semibold">
					{error}
				</p>
			)}

			<Button type="submit" size="lg" className="mt-6 h-12 w-full" disabled={pending || name.trim().length < 2}>
				{pending ? <Loader2 className="animate-spin" /> : <Plus />}
				{pending ? s.creating : s.create}
			</Button>
		</form>
	);
}
