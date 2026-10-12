import "server-only";

// Dictionaries are split by feature so they can grow independently:
//   msingi  shared strings (header, nav, lesson panel, ...)
//   uwanja  the code playground / IDE
//   tovuti  marketing pages: landing, kamusi, about
//   darasa  classrooms
// Each file holds one top-level key per feature; they are merged here.
import swMsingi from "./dictionaries/sw/msingi.json";
import swUwanja from "./dictionaries/sw/uwanja.json";
import swTovuti from "./dictionaries/sw/tovuti.json";
import swDarasa from "./dictionaries/sw/darasa.json";

const sw = { ...swMsingi, ...swUwanja, ...swTovuti, ...swDarasa };

export type Dictionary = typeof sw;

const dictionaries = {
	sw: async () => sw,
	en: async (): Promise<Dictionary> => {
		const [msingi, uwanja, tovuti, darasa] = await Promise.all([
			import("./dictionaries/en/msingi.json"),
			import("./dictionaries/en/uwanja.json"),
			import("./dictionaries/en/tovuti.json"),
			import("./dictionaries/en/darasa.json"),
		]);
		// English falls back to Swahili for any key not yet translated.
		return deepMerge(sw, { ...msingi.default, ...uwanja.default, ...tovuti.default, ...darasa.default });
	},
};

function deepMerge<T>(base: T, over: unknown): T {
	if (Array.isArray(base) || typeof base !== "object" || base === null) return (over ?? base) as T;
	const out: any = { ...base };
	for (const [k, v] of Object.entries((over as object) ?? {})) {
		out[k] = k in out ? deepMerge(out[k], v) : v;
	}
	return out;
}

export type Locale = keyof typeof dictionaries;

export const hasLocale = (locale: string): locale is Locale => locale in dictionaries;

export const getDictionary = async (locale: Locale): Promise<Dictionary> => dictionaries[locale]();
