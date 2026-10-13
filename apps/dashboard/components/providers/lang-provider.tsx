"use client";

import { createContext, useContext, useTransition, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { getDict, type Dict, type Lang } from "@/lib/dict";
import { setLangAction } from "@/app/actions/lang";

const LangContext = createContext<{ lang: Lang; t: Dict }>({ lang: "sw", t: getDict("sw") });

export function LangProvider({ lang, children }: { lang: Lang; children: ReactNode }) {
	return <LangContext.Provider value={{ lang, t: getDict(lang) }}>{children}</LangContext.Provider>;
}

export function useDict() {
	return useContext(LangContext);
}

/** Switches the room language and re-renders server components with it. */
export function useSetLang() {
	const router = useRouter();
	const [pending, start] = useTransition();
	const setLang = (lang: Lang) =>
		start(async () => {
			await setLangAction(lang);
			router.refresh();
		});
	return { setLang, pending };
}
