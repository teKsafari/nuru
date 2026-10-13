import "server-only";

import { cookies } from "next/headers";
import { getDict, isLang, LANG_COOKIE, type Lang } from "@/lib/dict";

/** The teacher's chosen language, Swahili unless they switched. */
export async function getLang(): Promise<Lang> {
	const v = (await cookies()).get(LANG_COOKIE)?.value;
	return isLang(v) ? v : "sw";
}

export async function getServerDict() {
	const lang = await getLang();
	return { lang, t: getDict(lang) };
}
