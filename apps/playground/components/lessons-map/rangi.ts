// Module colours on the Safari Yako map and in the menu. Each module keeps the
// same colour wherever it appears. Jua stays free for the one next action.
export const MODULE_RANGI = [
	{ bg: "bg-bahari", text: "text-bahari", fg: "text-white", border: "border-bahari" },
	{ bg: "bg-mwani", text: "text-mwani", fg: "text-white", border: "border-mwani" },
	{ bg: "bg-zambarau", text: "text-zambarau", fg: "text-wino", border: "border-zambarau" },
	{ bg: "bg-chungwa", text: "text-chungwa", fg: "text-wino", border: "border-chungwa" },
	{ bg: "bg-pilipili", text: "text-pilipili", fg: "text-wino", border: "border-pilipili" },
	{ bg: "bg-udongo", text: "text-udongo", fg: "text-white", border: "border-udongo" },
] as const;

export const rangiYaModuli = (index: number) => MODULE_RANGI[index % MODULE_RANGI.length];

export const moduleHref = (lang: string, slug: string) => `/${lang}/anza/${slug}`;
