/** URL slug from a (Swahili) title plus a short random suffix so slugs never collide. */
export function slugify(title: string) {
	const base =
		title
			.normalize("NFKD")
			.replace(/[̀-ͯ]/g, "")
			.toLowerCase()
			.replace(/[^a-z0-9]+/g, "-")
			.replace(/^-+|-+$/g, "")
			.slice(0, 48) || "somo";
	return `${base}-${Math.random().toString(36).slice(2, 6)}`;
}
