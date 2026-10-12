// Code-in-the-URL sharing. A program travels in the URL fragment, so links work
// offline, are never sent to a server, and paste cleanly into WhatsApp.
//   /sw/uwanja#k=<base64url(utf-8 code)>&m=kobe
// `m` (optional) picks the output view: "terminal" | "kobe" | "ubao".

export type UwanjaMode = "terminal" | "kobe" | "ubao";

function toBase64Url(bytes: Uint8Array) {
	let bin = "";
	for (const b of bytes) bin += String.fromCharCode(b);
	return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function fromBase64Url(s: string) {
	const bin = atob(s.replace(/-/g, "+").replace(/_/g, "/"));
	return Uint8Array.from(bin, (c) => c.charCodeAt(0));
}

export function encodeShareHash(code: string, mode?: UwanjaMode) {
	const k = toBase64Url(new TextEncoder().encode(code));
	return `#k=${k}${mode ? `&m=${mode}` : ""}`;
}

export function decodeShareHash(hash: string): { code: string; mode?: UwanjaMode } | null {
	const params = new URLSearchParams(hash.replace(/^#/, ""));
	const k = params.get("k");
	if (!k) return null;
	try {
		const code = new TextDecoder().decode(fromBase64Url(k));
		const m = params.get("m");
		return { code, mode: m === "kobe" || m === "ubao" || m === "terminal" ? m : undefined };
	} catch {
		return null;
	}
}

/** Absolute uwanja link for a program, e.g. for the "Jaribu" buttons in kamusi. */
export function uwanjaHref(lang: string, code: string, mode?: UwanjaMode) {
	return `/${lang}/uwanja${encodeShareHash(code, mode)}`;
}

/** WhatsApp share URL for a link. */
export function whatsappHref(text: string, url: string) {
	return `https://wa.me/?text=${encodeURIComponent(`${text}\n${url}`)}`;
}
