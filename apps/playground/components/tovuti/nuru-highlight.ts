// A tiny Nuru tokenizer for static code (Kamusi, landing page). It follows the
// rules of the CodeMirror mode in packages/ui/src/lib/nuru-syntax.ts but ships
// no editor, so a page full of examples stays light on slow connections.
// The word lists are copied (not imported) so CodeMirror stays out of the bundle.
const NURU_KEYWORDS = [
	"fanya", "unda", "rudisha", "kama", "au", "sivyo", "wakati", "kwa", "ktk",
	"vunja", "endelea", "badili", "ikiwa", "kawaida", "tumia", "pakeji",
];
const NURU_BUILTINS = ["andika", "jaza", "aina", "fungua", "mfululizo", "namba", "tungo", "badilisha"];
const NURU_MODULES = ["kobe", "ubao", "hisabati", "muda", "jsoni", "os", "mtandao"];

export type TokenKind = "kw" | "atom" | "str" | "com" | "bi" | "mod" | "num" | "def" | "op" | "punc" | "prop" | "var" | "ws";
export type Token = { k: TokenKind; v: string };

const kw = NURU_KEYWORDS.join("|");
const bi = NURU_BUILTINS.join("|");
const mods = NURU_MODULES.join("|");

const rules: [RegExp, TokenKind][] = [
	[/^\s+/, "ws"],
	[/^"(?:[^\\"\n]|\\.)*"?/, "str"],
	[/^'(?:[^\\'\n]|\\.)*'?/, "str"],
	[/^\/\/[^\n]*/, "com"],
	[/^\/\*[\s\S]*?(?:\*\/|$)/, "com"],
	[/^(?:kweli|sikweli|tupu)\b/, "atom"],
	[new RegExp(`^(?:${kw})\\b`), "kw"],
	[new RegExp(`^(?:${bi})(?=\\s*\\()`), "bi"],
	[new RegExp(`^(?:${mods})\\b(?=\\s*\\.)`), "mod"],
	[/^@/, "kw"],
	[/^(?:0x[a-f\d]+|(?:\.\d+|\d+\.?\d*)(?:e[-+]?\d+)?)/i, "num"],
	[/^[a-zA-Z_]\w*(?=\s*=\s*unda\b)/, "def"],
	[/^[a-zA-Z_]\w*(?=\s*\()/, "def"],
	[/^[-+/*%=<>!&|]+/, "op"],
	[/^[{}()[\],;:.]/, "punc"],
	[/^[a-zA-Z_]\w*/, "var"],
];

export function tokenize(code: string): Token[] {
	const out: Token[] = [];
	let rest = code;
	let afterDot = false;
	while (rest.length) {
		let matched = false;
		if (afterDot) {
			const m = /^[a-zA-Z_]\w*/.exec(rest);
			afterDot = false;
			if (m) {
				out.push({ k: "prop", v: m[0] });
				rest = rest.slice(m[0].length);
				continue;
			}
		}
		for (const [re, k] of rules) {
			const m = re.exec(rest);
			if (m && m[0].length) {
				out.push({ k, v: m[0] });
				rest = rest.slice(m[0].length);
				if (k === "punc" && m[0] === ".") afterDot = true;
				matched = true;
				break;
			}
		}
		if (!matched) {
			out.push({ k: "var", v: rest[0] });
			rest = rest.slice(1);
		}
	}
	return out;
}

// Same palette as the editor themes in code-editor.tsx (Mchana / Usiku).
export const tokenClass: Record<TokenKind, string> = {
	kw: "font-bold text-[#c8553d] dark:text-[#ffc93c]",
	atom: "font-semibold text-[#b4530a] dark:text-[#ff9a3c]",
	str: "text-[#18804d] dark:text-[#3ccf86]",
	com: "italic text-[#8f8270] dark:text-[#8a7d6b]",
	bi: "font-semibold text-[#d0342a] dark:text-[#ff6f63]",
	mod: "font-semibold text-[#245fd6] dark:text-[#6e9bff]",
	num: "text-[#245fd6] dark:text-[#6e9bff]",
	def: "text-[#6a43d9] dark:text-[#b39cff]",
	op: "text-[#6b6257] dark:text-[#b8ab95]",
	punc: "text-[#6b6257] dark:text-[#b8ab95]",
	prop: "text-[#b4530a] dark:text-[#ffad5c]",
	var: "",
	ws: "",
};

// Fixed dark palette, for code shown on an ink panel in both modes.
export const tokenClassOnInk: Record<TokenKind, string> = {
	kw: "font-bold text-[#ffc93c]",
	atom: "font-semibold text-[#ff9a3c]",
	str: "text-[#3ccf86]",
	com: "italic text-[#8a7d6b]",
	bi: "font-semibold text-[#ff6f63]",
	mod: "font-semibold text-[#6e9bff]",
	num: "text-[#6e9bff]",
	def: "text-[#b39cff]",
	op: "text-[#b8ab95]",
	punc: "text-[#b8ab95]",
	prop: "text-[#ffad5c]",
	var: "",
	ws: "",
};
