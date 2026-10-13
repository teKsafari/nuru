/** "{n} / {jumla}" with { n: 2, jumla: 5 } -> "2 / 5". */
export function fmt(template: string, vars: Record<string, string | number>) {
	return template.replace(/\{(\w+)\}/g, (m, k) => (k in vars ? String(vars[k]) : m));
}
