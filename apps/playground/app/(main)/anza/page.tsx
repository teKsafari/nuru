"use client";

import { useRef, useMemo } from "react";

import { useNuru } from "@nuru/wasm/react";

import { Playground } from "@/components/playground/playground";
import { Executor } from "@/lib/executor";
// import { executeNuru } from "@/lib/nuru";

import { useTheme } from "next-themes";

import { LessonContent } from "@/types/playground";

export default function Home() {
	const { theme, forcedTheme } = useTheme();

	const nuruExecutor = new Executor("nuru", useNuru)

	return (
		<Playground
			theme={(forcedTheme || theme) as "light" | "dark"}
			lesson={nuruDemo}
			executor={nuruExecutor}
		/>
	);
}

const nuruDemo: LessonContent = {
	title: "Nuru - jifunze programu kwa Kiswahili",
	initialCode: `// Programu ya kwanza - Salamu!

jina = jaza("Ingiza jina lako")

andika("Habari " + jina + "!")
`,
	description: (
		//  maelekezo kuhusu nuru kwa lugha ya Kiswahili
		<div className="space-y-6 leading-relaxed text-muted-foreground">
			<p>
				Nuru ni lugha ya programu na mfumo wa kujifunzia ulioundwa mahsusi kwa
				ajili ya wazungumzaji wa Kiswahili. Lengo letu kuu ni kuwawezesha vijana
				kujifunza, kuunda, na kujaribu mambo mapya katika lugha wanayoizungumza
				nyumbani.
			</p>

			<div className="mt-6 rounded-lg border border-border bg-secondary/50 p-4">
				<p className="break-words text-sm text-muted-foreground">
					<span className="font-semibold text-foreground">Kidokezo:</span> Tumia{" "}
					<code className="rounded bg-background px-1 py-0.5 font-mono text-xs">
						andika()
					</code>{" "}
					kuona matokeo.
				</p>
			</div>
		</div>
	),
};
