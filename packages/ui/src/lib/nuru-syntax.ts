import { StreamLanguage } from "@codemirror/language";
import { simpleMode } from "@codemirror/legacy-modes/mode/simple-mode";
import type { Completion, CompletionContext, CompletionResult } from "@codemirror/autocomplete";

// Source of truth: packages/wasm/core/Nuru/token/token.go and evaluator/builtins*.go
export const NURU_KEYWORDS = [
	"fanya", "unda", "rudisha", "kweli", "sikweli", "tupu", "kama", "au", "sivyo",
	"wakati", "kwa", "ktk", "vunja", "endelea", "badili", "ikiwa", "kawaida", "tumia", "pakeji",
] as const;

export const NURU_BUILTINS = ["andika", "jaza", "aina", "fungua", "mfululizo", "namba", "tungo", "badilisha"] as const;

export const NURU_MODULES = ["kobe", "ubao", "hisabati", "muda", "jsoni", "os", "mtandao"] as const;

const kw = NURU_KEYWORDS.join("|");
const bi = NURU_BUILTINS.join("|");
const mods = NURU_MODULES.join("|");

export const nuruLanguage = StreamLanguage.define(
	simpleMode({
		start: [
			{ regex: /"(?:[^\\"]|\\.)*?(?:"|$)/, token: "string" },
			{ regex: /'(?:[^\\']|\\.)*?(?:'|$)/, token: "string" },
			{ regex: /\/\/.*/, token: "comment" },
			{ regex: /\/\*/, token: "comment", next: "comment" },
			{ regex: new RegExp(`\\b(?:kweli|sikweli|tupu)\\b`), token: "atom" },
			{ regex: new RegExp(`\\b(?:${kw})\\b`), token: "keyword" },
			{ regex: new RegExp(`\\b(?:${bi})(?=\\s*\\()`), token: "builtin" },
			{ regex: new RegExp(`\\b(?:${mods})\\b(?=\\s*\\.)`), token: "variable-2" },
			{ regex: /@/, token: "keyword" },
			{ regex: /0x[a-f\d]+|(?:\.\d+|\d+\.?\d*)(?:e[-+]?\d+)?/i, token: "number" },
			{ regex: /\./, token: "punctuation", next: "property" },
			{ regex: /[a-zA-Z_]\w*(?=\s*=\s*unda\b)/, token: "def" },
			{ regex: /[a-zA-Z_]\w*(?=\s*\()/, token: "def" },
			{ regex: /[-+/*%=<>!&|]+/, token: "operator" },
			{ regex: /[{}()[\],;:]/, token: "punctuation" },
			{ regex: /[a-zA-Z_]\w*/, token: "variable" },
		],
		property: [
			{ regex: /[a-zA-Z_]\w*/, token: "property", next: "start" },
			{ regex: /\s+/, token: null },
			{ regex: /(?=[^a-zA-Z_])/, next: "start" },
		],
		comment: [
			{ regex: /.*?\*\//, token: "comment", next: "start" },
			{ regex: /.*/, token: "comment" },
		],
		languageData: {
			commentTokens: { line: "//", block: { open: "/*", close: "*/" } },
			closeBrackets: { brackets: ["(", "[", "{", '"'] },
		},
		meta: {
			dontIndentStates: ["comment"],
			lineComment: "//",
		},
	} as any),
);

// ---- Autocomplete: Swahili documentation at the learner's fingertips ----

type Doc = { label: string; detail: string; info: string; apply?: string; type: string };

const keywordDocs: Doc[] = [
	{ label: "fanya", type: "keyword", detail: "tengeneza kibadilika", info: "fanya jina = \"Amani\"" },
	{ label: "unda", type: "keyword", detail: "unda kitendakazi", info: "fanya salimu = unda(jina) {\n    andika(\"Habari \" + jina)\n}", apply: "unda() {\n    \n}" },
	{ label: "rudisha", type: "keyword", detail: "rudisha thamani kutoka kitendakazi", info: "rudisha a + b" },
	{ label: "kama", type: "keyword", detail: "uamuzi: ikiwa hali ni kweli", info: "kama (umri >= 18) {\n    andika(\"Mtu mzima\")\n}", apply: "kama () {\n    \n}" },
	{ label: "au kama", type: "keyword", detail: "hali nyingine", info: "} au kama (umri >= 13) {" },
	{ label: "sivyo", type: "keyword", detail: "vinginevyo", info: "} sivyo {\n    andika(\"Mtoto\")\n}" },
	{ label: "wakati", type: "keyword", detail: "rudia wakati hali ni kweli", info: "wakati (i < 5) {\n    i++\n}", apply: "wakati () {\n    \n}" },
	{ label: "kwa", type: "keyword", detail: "pitia kila kipengele", info: "kwa tunda ktk matunda {\n    andika(tunda)\n}", apply: "kwa i ktk mfululizo(10) {\n    \n}" },
	{ label: "ktk", type: "keyword", detail: "ndani ya (in)", info: "kwa i ktk [1, 2, 3] { ... }" },
	{ label: "vunja", type: "keyword", detail: "toka kwenye kitanzi", info: "kama (i == 5) { vunja }" },
	{ label: "endelea", type: "keyword", detail: "ruka hadi mzunguko unaofuata", info: "kama (i % 2 == 0) { endelea }" },
	{ label: "badili", type: "keyword", detail: "chagua kati ya njia nyingi", info: "badili (siku) {\n    ikiwa \"Jumamosi\" { andika(\"Wikendi\") }\n    kawaida { andika(\"Kazini\") }\n}" },
	{ label: "ikiwa", type: "keyword", detail: "kesi ndani ya badili", info: "ikiwa 1, 2 { ... }" },
	{ label: "kawaida", type: "keyword", detail: "kesi ya kawaida ndani ya badili", info: "kawaida { ... }" },
	{ label: "tumia", type: "keyword", detail: "leta moduli", info: "tumia hisabati\nandika(hisabati.sqrt(16))" },
	{ label: "kweli", type: "constant", detail: "boolean: true", info: "fanya tayari = kweli" },
	{ label: "sikweli", type: "constant", detail: "boolean: false", info: "fanya tayari = sikweli" },
	{ label: "tupu", type: "constant", detail: "hakuna thamani (null)", info: "fanya jibu = tupu" },
];

const builtinDocs: Doc[] = [
	{ label: "andika", type: "function", detail: "chapisha kwenye skrini", info: "andika(\"Habari\", jina)", apply: "andika()" },
	{ label: "jaza", type: "function", detail: "omba ingizo kutoka kwa mtumiaji", info: "fanya jina = jaza(\"Jina lako? \")\n// jaza() hurudisha NENO kila mara", apply: "jaza()" },
	{ label: "aina", type: "function", detail: "aina ya thamani", info: "aina(5)  // NAMBA\naina(\"a\")  // NENO", apply: "aina()" },
	{ label: "mfululizo", type: "function", detail: "orodha ya namba", info: "mfululizo(5)  // [0, 1, 2, 3, 4]\nmfululizo(1, 10, 2)", apply: "mfululizo()" },
	{ label: "namba", type: "function", detail: "badilisha kuwa namba kamili", info: "namba(\"42\")  // 42", apply: "namba()" },
	{ label: "tungo", type: "function", detail: "badilisha kuwa neno", info: "tungo(42)  // \"42\"", apply: "tungo()" },
	{ label: "badilisha", type: "function", detail: "badilisha aina", info: "badilisha(\"3.5\", \"DESIMALI\")", apply: "badilisha()" },
];

const moduleDocs: Record<string, Doc[]> = {
	kobe: [
		["mbele", "nenda mbele hatua n", "kobe.mbele(100)"],
		["nyuma", "rudi nyuma hatua n", "kobe.nyuma(50)"],
		["kulia", "geuka kulia kwa digrii", "kobe.kulia(90)"],
		["kushoto", "geuka kushoto kwa digrii", "kobe.kushoto(90)"],
		["elekea", "elekea digrii fulani (0 = mashariki)", "kobe.elekea(90)"],
		["nenda", "ruka hadi mahali (x, y)", "kobe.nenda(0, 100)"],
		["nyumbani", "rudi katikati", "kobe.nyumbani()"],
		["kalamu_juu", "inua kalamu: sogea bila kuchora", "kobe.kalamu_juu()"],
		["kalamu_chini", "shusha kalamu: chora unaposogea", "kobe.kalamu_chini()"],
		["rangi", "rangi ya kalamu", "kobe.rangi(\"nyekundu\")"],
		["rangi_ya_ndani", "rangi ya kujaza umbo", "kobe.rangi_ya_ndani(\"njano\")"],
		["anza_kujaza", "anza kujaza umbo", "kobe.anza_kujaza()"],
		["maliza_kujaza", "maliza na paka rangi umbo", "kobe.maliza_kujaza()"],
		["unene", "unene wa mstari", "kobe.unene(4)"],
		["duara", "chora duara la nusukipenyo r", "kobe.duara(50)"],
		["nukta", "weka nukta", "kobe.nukta(10)"],
		["maandishi", "andika maneno kwenye turubai", "kobe.maandishi(\"Jambo!\")"],
		["mandhari", "rangi ya turubai", "kobe.mandhari(\"samawati\")"],
		["kasi", "kasi ya kobe: 0 (papo hapo) hadi 10", "kobe.kasi(7)"],
		["futa", "safisha turubai", "kobe.futa()"],
		["ficha", "ficha kobe", "kobe.ficha()"],
		["onyesha", "onyesha kobe", "kobe.onyesha()"],
		["mahali", "rudisha [x, y]", "andika(kobe.mahali())"],
		["mwelekeo", "rudisha mwelekeo kwa digrii", "andika(kobe.mwelekeo())"],
	].map(([l, d, i]) => ({ label: l, detail: d, info: i, type: "method" })),
	ubao: [
		["washa", "washa taa namba n (1 hadi 8)", "ubao.washa(1)"],
		["zima", "zima taa namba n", "ubao.zima(1)"],
		["geuza", "badilisha hali ya taa", "ubao.geuza(1)"],
		["washa_zote", "washa taa zote", "ubao.washa_zote()"],
		["zima_zote", "zima taa zote", "ubao.zima_zote()"],
		["imewaka", "je, taa imewaka?", "kama (ubao.imewaka(1)) { ... }"],
		["rangi", "rangi ya taa", "ubao.rangi(1, \"kijani\")"],
		["kengele", "piga kengele (Hz, milisekunde)", "ubao.kengele(440, 200)"],
		["skrini", "andika kwenye skrini ndogo", "ubao.skrini(\"Habari\")"],
		["subiri", "subiri milisekunde", "ubao.subiri(500)"],
	].map(([l, d, i]) => ({ label: l, detail: d, info: i, type: "method" })),
	hisabati: [
		["PI", "π ≈ 3.14159", "hisabati.PI()"],
		["sqrt", "kipeuo cha pili", "hisabati.sqrt(16)"],
		["abs", "thamani kamili", "hisabati.abs(-5)"],
		["round", "kadiria (DESIMALI tu)", "hisabati.round(2.6)"],
		["floor", "shusha hadi namba kamili", "hisabati.floor(2.9)"],
		["ceil", "panda hadi namba kamili", "hisabati.ceil(2.1)"],
		["max", "kubwa zaidi kwenye orodha", "hisabati.max([3, 9, 2])"],
		["min", "ndogo zaidi kwenye orodha", "hisabati.min([3, 9, 2])"],
		["random", "namba ya nasibu 0 hadi 1", "hisabati.random()"],
		["factorial", "n!", "hisabati.factorial(5)"],
		["sin", "sine (radiani, DESIMALI tu)", "hisabati.sin(0.0)"],
		["cos", "cosine (radiani, DESIMALI tu)", "hisabati.cos(0.0)"],
	].map(([l, d, i]) => ({ label: l, detail: d, info: i, type: "method" })),
	muda: [
		["hasahivi", "muda wa sasa", "muda.hasahivi()"],
		["leo", "tarehe ya leo", "muda.leo()"],
		["lala", "simama kwa sekunde", "muda.lala(1)"],
		["tangu", "sekunde tangu muda fulani", "muda.tangu(m)"],
	].map(([l, d, i]) => ({ label: l, detail: d, info: i, type: "method" })),
	jsoni: [
		["dikodi", "soma JSON kuwa kamusi", "jsoni.dikodi(\"{\\\"a\\\": 1}\")"],
		["enkodi", "andika kamusi kuwa JSON", "jsoni.enkodi({\"a\": 1})"],
	].map(([l, d, i]) => ({ label: l, detail: d, info: i, type: "method" })),
};

const methodDocs: Doc[] = [
	["idadi", "idadi ya vipengele/herufi", "[1, 2, 3].idadi()"],
	["sukuma", "ongeza mwishoni mwa orodha", "orodha.sukuma(4)"],
	["yamwisho", "kipengele cha mwisho", "orodha.yamwisho()"],
	["unga", "unganisha orodha kuwa neno", "[\"a\", \"b\"].unga(\", \")"],
	["chuja", "chuja kwa kitendakazi", "orodha.chuja(unda(x) { rudisha x > 2 })"],
	["map", "badilisha kila kipengele", "orodha.map(unda(x) { rudisha x * 2 })"],
	["tafuta", "rudisha kipengele kama kipo, sivyo tupu", "[4, 5].tafuta(5)  // 5"],
	["herufikubwa", "HERUFI KUBWA", "\"nuru\".herufikubwa()"],
	["herufindogo", "herufi ndogo", "\"NURU\".herufindogo()"],
	["gawa", "gawa neno kuwa orodha", "\"a,b,c\".gawa(\",\")"],
	["panga", "jaza nafasi {0}, {1} kwa hoja", "\"Habari {0}\".panga(jina)"],
].map(([l, d, i]) => ({ label: l, detail: d, info: i, type: "method" }));

function toCompletion(d: Doc, boost = 0): Completion {
	return { label: d.label, type: d.type, detail: d.detail, info: d.info, apply: d.apply, boost };
}

const topLevel = [
	...keywordDocs.map((d) => toCompletion(d, 2)),
	...builtinDocs.map((d) => toCompletion(d, 3)),
	...NURU_MODULES.map((m) => ({ label: m, type: "namespace", detail: "moduli", info: `tumia ${m}` }) as Completion),
];

export function nuruCompletions(context: CompletionContext): CompletionResult | null {
	const member = context.matchBefore(/([a-zA-Z_]\w*)\.(\w*)$/);
	if (member) {
		const [obj] = member.text.split(".");
		const docs = moduleDocs[obj] ?? methodDocs;
		return {
			from: member.from + obj.length + 1,
			options: docs.map((d) => toCompletion(d)),
			validFor: /^\w*$/,
		};
	}
	const word = context.matchBefore(/[a-zA-Z_]\w*/);
	if (!word || (word.from === word.to && !context.explicit)) return null;
	return { from: word.from, options: topLevel, validFor: /^\w*$/ };
}

export const nuruDocs = { keywords: keywordDocs, builtins: builtinDocs, modules: moduleDocs, methods: methodDocs };

/** Highlighting plus Swahili autocomplete. Pass as an editor extension. */
export const nuru = [nuruLanguage, nuruLanguage.data.of({ autocomplete: nuruCompletions })];
