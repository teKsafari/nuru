"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { isLang, LANG_COOKIE } from "@/lib/dict";

export async function setLangAction(lang: string) {
	if (!isLang(lang)) return;
	(await cookies()).set(LANG_COOKIE, lang, { path: "/", maxAge: 60 * 60 * 24 * 365, sameSite: "lax" });
	revalidatePath("/", "layout");
}
