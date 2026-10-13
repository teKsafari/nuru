// Kamusi ya Nuru: the language reference, as data.
//
// Every `mfano` (example) here is executed by hakiki-mifano.mts against the
// real Nuru wasm build, and its printed output must match `matokeo`:
//   pnpm --filter nuru-playground exec tsx "app/(main)/[lang]/kamusi/hakiki-mifano.mts"
// Source of truth for the language: packages/wasm/core/Nuru and packages/wasm/web.
//
// Text fields use `backticks` for inline code. Nuru code never gets translated.

export type L = { sw: string; en: string };

export type Mfano = {
	code: string;
	/** What the program prints (stdout and errors, in order). */
	matokeo: string;
	/** Output depends on time or chance: test with this pattern, label the output as a sample. */
	muundo?: RegExp;
	/** Lines may come out in any order (for example, looping over a kamusi). */
	mpangilioWowote?: boolean;
	/** Lines typed at jaza() prompts. */
	ingizo?: string[];
	/** Opens Uwanja with the kobe canvas or the ubao board. */
	mode?: "kobe" | "ubao";
};

export type Kipande =
	| { aina: "p"; maandishi: L }
	| { aina: "h3"; maandishi: L; id?: string }
	| { aina: "mfano"; mfano: Mfano; kichwa?: L }
	| { aina: "dokezo"; maandishi: L }
	| { aina: "jedwali"; vichwa: L[]; safu: (string | L)[][] };

export type Sehemu = { id: string; kichwa: L; utangulizi?: L; vipande: Kipande[] };

const p = (sw: string, en: string): Kipande => ({ aina: "p", maandishi: { sw, en } });
const h3 = (sw: string, en: string, id?: string): Kipande => ({ aina: "h3", maandishi: { sw, en }, id });
const dokezo = (sw: string, en: string): Kipande => ({ aina: "dokezo", maandishi: { sw, en } });
const mfano = (m: Mfano, kichwa?: L): Kipande => ({ aina: "mfano", mfano: m, kichwa });
const l = (sw: string, en: string): L => ({ sw, en });

export const sehemu: Sehemu[] = [
	{
		id: "utangulizi",
		kichwa: l("Utangulizi", "Introduction"),
		utangulizi: l(
			"Nuru ni lugha ya kiprogramu inayotumia maneno ya Kiswahili. Kamusi hii inaeleza kila sehemu ya lugha kwa mifano mifupi. Bonyeza **Jaribu** kwenye mfano wowote ili uufungue Uwanjani, uubadilishe na uuendeshe.",
			"Nuru is a programming language written with Swahili words. This reference walks through each part of the language with short examples. Press **Jaribu** (try it) on any example to open it in Uwanja, change it and run it.",
		),
		vipande: [
			mfano({ code: `andika("Habari, Dunia!")`, matokeo: "Habari, Dunia!" }),
			p(
				"`andika()` huchapisha thamani moja au zaidi. Ukiweka thamani kadhaa, Nuru huziweka nafasi katikati.",
				"`andika()` prints one or more values. Give it several and Nuru puts a space between them.",
			),
			mfano({ code: `andika("Nina miaka", 12)\nandika(3 + 4)`, matokeo: "Nina miaka 12\n7" }),
			h3("Maoni", "Comments"),
			p(
				"Maoni ni maelezo kwa ajili ya binadamu, na Nuru huyaruka. Tumia `//` kwa mstari mmoja na `/* ... */` kwa mistari mingi.",
				"Comments are notes for people; Nuru skips them. Use `//` for one line and `/* ... */` for several.",
			),
			mfano({
				code: `// Huu ni mstari wa maoni\nandika("Maoni hayachapishwi")\n\n/*\n  Maoni ya mistari\n  mingi\n*/`,
				matokeo: "Maoni hayachapishwi",
			}),
		],
	},
	{
		id: "vibadilika",
		kichwa: l("Vibadilika", "Variables"),
		utangulizi: l(
			"Kibadilika ni jina linalohifadhi thamani. Kiunde kwa `fanya`. Baadaye unaweza kukipa thamani mpya bila `fanya`.",
			"A variable is a name that holds a value. Create one with `fanya`. Later you can give it a new value without `fanya`.",
		),
		vipande: [
			mfano({
				code: `fanya jina = "Amani"\nfanya umri = 12\nandika(jina, "ana miaka", umri)\n\numri = 13\nandika(jina, "sasa ana miaka", umri)`,
				matokeo: "Amani ana miaka 12\nAmani sasa ana miaka 13",
			}),
			p(
				"Jina la kibadilika huanza na herufi au `_`, na linaweza kuwa na namba: `alama1`, `jina_kamili`. Herufi kubwa na ndogo ni tofauti, kwa hiyo `Jina` si sawa na `jina`. Usitumie maneno ya Nuru kama `kama` au `kwa` kuwa majina.",
				"A variable name starts with a letter or `_` and may contain digits: `alama1`, `jina_kamili`. Case matters, so `Jina` and `jina` are different names. Nuru's own words, such as `kama` or `kwa`, cannot be names.",
			),
			h3("Njia fupi", "Shortcuts"),
			p(
				"Kubadilisha thamani ya kibadilika kwa kutumia thamani yake ya zamani ni jambo la kawaida, kwa hiyo Nuru ina njia fupi: `+=`, `-=`, `*=`, `++` na `--`.",
				"Updating a variable from its old value is common, so Nuru has shortcuts: `+=`, `-=`, `*=`, `++` and `--`.",
			),
			mfano({
				code: `fanya alama = 10\nalama += 5   // 15\nalama++      // 16\nalama -= 2   // 14\nalama *= 2   // 28\nandika(alama)`,
				matokeo: "28",
			}),
		],
	},
	{
		id: "aina-za-data",
		kichwa: l("Aina za data", "Data types"),
		utangulizi: l(
			"Kila thamani ina aina. Ukitaka kujua aina ya thamani, iulize Nuru kwa `aina()`.",
			"Every value has a type. To find out a value's type, ask Nuru with `aina()`.",
		),
		vipande: [
			{
				aina: "jedwali",
				vichwa: [l("Aina", "Type"), l("Mfano", "Example"), l("Maana", "Meaning")],
				safu: [
					["`NAMBA`", "`42`, `-7`", l("namba kamili", "a whole number")],
					["`DESIMALI`", "`3.14`, `0.5`", l("namba yenye nukta", "a number with a decimal point")],
					["`NENO`", '`"Habari"`', l("maandishi ndani ya alama za nukuu", "text inside quotes")],
					["`BOOLEAN`", "`kweli`, `sikweli`", l("ndiyo au hapana", "yes or no (true or false)")],
					["`TUPU`", "`tupu`", l("hakuna thamani", "no value")],
					["`ORODHA`", "`[1, 2, 3]`", l("vitu vilivyopangwa kwa mfuatano", "items kept in order")],
					["`KAMUSI`", '`{"jina": "Amani"}`', l("funguo na thamani zake", "keys and their values")],
				],
			},
			mfano({
				code: `andika(aina(42))\nandika(aina(3.14))\nandika(aina("Habari"))\nandika(aina(kweli))\nandika(aina(tupu))\nandika(aina([1, 2, 3]))\nandika(aina({"jina": "Amani"}))`,
				matokeo: "NAMBA\nDESIMALI\nNENO\nBOOLEAN\nTUPU\nORODHA\nKAMUSI",
			}),
			h3("Kubadilisha aina", "Converting between types"),
			p(
				"`namba()` hugeuza thamani kuwa NAMBA, `tungo()` huigeuza kuwa NENO, na `badilisha(thamani, \"AINA\")` huigeuza kuwa `NAMBA`, `DESIMALI`, `NENO` au `BOOLEAN`.",
				"`namba()` turns a value into a NAMBA, `tungo()` turns it into a NENO, and `badilisha(value, \"TYPE\")` converts to `NAMBA`, `DESIMALI`, `NENO` or `BOOLEAN`.",
			),
			mfano({
				code: `andika(namba("42") + 1)\nandika(tungo(42) + "!")\nandika(badilisha("3.5", "DESIMALI"))\nandika(namba(3.9))   // sehemu ya desimali inaondolewa`,
				matokeo: "43\n42!\n3.5\n3",
			}),
			dokezo(
				"Ukichapisha `tupu`, Nuru huonyesha `null`.",
				"When you print `tupu`, Nuru shows `null`.",
			),
		],
	},
	{
		id: "waendeshaji",
		kichwa: l("Waendeshaji", "Operators"),
		utangulizi: l(
			"Waendeshaji hufanya hesabu, hulinganisha thamani na huunganisha masharti.",
			"Operators do arithmetic, compare values and combine conditions.",
		),
		vipande: [
			h3("Hesabu", "Arithmetic"),
			{
				aina: "jedwali",
				vichwa: [l("Mwendeshaji", "Operator"), l("Kazi", "Does"), l("Mfano", "Example")],
				safu: [
					["`+`", l("jumlisha", "add"), "`2 + 3` → `5`"],
					["`-`", l("toa", "subtract"), "`9 - 4` → `5`"],
					["`*`", l("zidisha", "multiply"), "`3 * 4` → `12`"],
					["`/`", l("gawanya", "divide"), "`7 / 2` → `3.5`"],
					["`%`", l("baki ya kugawanya", "remainder"), "`7 % 2` → `1`"],
					["`**`", l("kipeo", "power"), "`2 ** 3` → `8`"],
				],
			},
			mfano({
				code: `andika(7 / 2)\nandika(8 / 2)\nandika(7 % 2)\nandika(2 ** 3)\nandika(2 + 3 * 4)\nandika((2 + 3) * 4)`,
				matokeo: "3.5\n4\n1\n8\n14\n20",
			}),
			p(
				"Kuzidisha na kugawanya hufanyika kabla ya kujumlisha na kutoa. Tumia mabano `( )` ukitaka mpangilio mwingine.",
				"Multiplication and division happen before addition and subtraction. Use brackets `( )` to change the order.",
			),
			h3("Kulinganisha", "Comparison"),
			{
				aina: "jedwali",
				vichwa: [l("Mwendeshaji", "Operator"), l("Maana", "Meaning"), l("Mfano", "Example")],
				safu: [
					["`==`", l("ni sawa na", "equal to"), "`5 == 5` → `kweli`"],
					["`!=`", l("si sawa na", "not equal to"), "`5 != 3` → `kweli`"],
					["`<`  `>`", l("ndogo kuliko, kubwa kuliko", "less than, greater than"), "`3 < 5` → `kweli`"],
					["`<=`  `>=`", l("ndogo au sawa, kubwa au sawa", "at most, at least"), "`5 >= 6` → `sikweli`"],
				],
			},
			h3("Mantiki", "Logic"),
			{
				aina: "jedwali",
				vichwa: [l("Mwendeshaji", "Operator"), l("Maana", "Meaning"), l("Mfano", "Example")],
				safu: [
					["`&&`", l("na: zote mbili ni kweli", "and: both are true"), "`kweli && sikweli` → `sikweli`"],
					["`||`", l("au: moja wapo ni kweli", "or: at least one is true"), "`kweli || sikweli` → `kweli`"],
					["`!`", l("si: hugeuza jibu", "not: flips the answer"), "`!kweli` → `sikweli`"],
				],
			},
			mfano({
				code: `fanya umri = 14\nandika(umri >= 13 && umri <= 19)\nandika(umri < 5 || umri > 60)\nandika(!(umri == 14))`,
				matokeo: "kweli\nsikweli\nsikweli",
			}),
			h3("Maneno na ktk", "Text and ktk"),
			p(
				"`+` huunganisha maneno mawili, na `*` hurudia neno. `ktk` (yaani \"katika\") huuliza kama kitu kipo ndani ya orodha, neno au kamusi.",
				"`+` joins two pieces of text and `*` repeats text. `ktk` (short for \"katika\", in) asks whether something is inside an orodha, a neno or a kamusi.",
			),
			mfano({
				code: `andika("Nuru" + " " + "Programu")\nandika("ha" * 3)\nandika(2 ktk [1, 2, 3])\nandika("jina" ktk {"jina": "Amani"})`,
				matokeo: "Nuru Programu\nhahaha\nkweli\nkweli",
			}),
			dokezo(
				"Huwezi kujumlisha NENO na NAMBA moja kwa moja. Geuza namba kuwa neno kwanza: `\"Umri: \" + tungo(12)`.",
				"You cannot add a NENO and a NAMBA directly. Turn the number into text first: `\"Umri: \" + tungo(12)`.",
			),
		],
	},
	{
		id: "maamuzi",
		kichwa: l("Maamuzi", "Decisions"),
		utangulizi: l(
			"Programu hufanya maamuzi kwa `kama`. Ongeza `au kama` kwa hali nyingine, na `sivyo` kwa kila kitu kilichobaki.",
			"Programs decide with `kama` (if). Add `au kama` (or if) for another condition and `sivyo` (otherwise) for everything left.",
		),
		vipande: [
			mfano({
				code: `fanya alama = 72\n\nkama (alama >= 80) {\n    andika("Daraja A")\n} au kama (alama >= 60) {\n    andika("Daraja B")\n} sivyo {\n    andika("Jaribu tena")\n}`,
				matokeo: "Daraja B",
			}),
			p(
				"Hali huandikwa ndani ya mabano `( )`, na kila tawi ndani ya `{ }`. Nuru hukagua hali moja baada ya nyingine na huendesha tawi la kwanza lililo kweli tu.",
				"The condition goes inside `( )` and each branch inside `{ }`. Nuru checks the conditions in order and runs only the first branch that is true.",
			),
			h3("badili, ikiwa, kawaida", "badili, ikiwa, kawaida"),
			p(
				"Ukilinganisha thamani moja na chaguo nyingi, `badili` husomeka vizuri kuliko `kama` nyingi. Kila `ikiwa` inaweza kuwa na thamani kadhaa zilizotenganishwa kwa koma, na `kawaida` hushika kila kitu kingine.",
				"When you compare one value against many choices, `badili` (switch) reads better than a chain of `kama`. Each `ikiwa` (case) can list several values separated by commas, and `kawaida` (default) catches the rest.",
			),
			mfano({
				code: `fanya siku = "Jumamosi"\n\nbadili (siku) {\n    ikiwa "Jumamosi", "Jumapili" {\n        andika("Ni wikendi!")\n    }\n    ikiwa "Ijumaa" {\n        andika("Wikendi inakaribia")\n    }\n    kawaida {\n        andika("Siku ya shule")\n    }\n}`,
				matokeo: "Ni wikendi!",
			}),
		],
	},
	{
		id: "vitanzi",
		kichwa: l("Vitanzi", "Loops"),
		utangulizi: l(
			"Vitanzi hurudia kazi. `wakati` hurudia maadamu hali ni kweli. `kwa ... ktk` hupitia kila kitu ndani ya orodha, neno au kamusi.",
			"Loops repeat work. `wakati` (while) repeats as long as a condition is true. `kwa ... ktk` (for ... in) visits each item of an orodha, a neno or a kamusi.",
		),
		vipande: [
			h3("wakati", "wakati"),
			mfano({
				code: `fanya i = 0\nwakati (i < 5) {\n    i++\n    andika(i)\n}`,
				matokeo: "1\n2\n3\n4\n5",
			}),
			dokezo(
				"Hakikisha hali itakuwa `sikweli` siku moja, la sivyo kitanzi hakitaisha. Uwanjani, bonyeza Simamisha kusimamisha programu iliyokwama.",
				"Make sure the condition becomes `sikweli` at some point, or the loop never ends. In Uwanja, press Simamisha (stop) to halt a stuck program.",
			),
			h3("kwa ... ktk", "kwa ... ktk"),
			mfano({
				code: `fanya matunda = ["embe", "papai", "nanasi"]\n\nkwa tunda ktk matunda {\n    andika("Napenda", tunda)\n}`,
				matokeo: "Napenda embe\nNapenda papai\nNapenda nanasi",
			}),
			p(
				"Ukiweka majina mawili, la kwanza hupata nafasi (kuanzia `0`) na la pili hupata kitu chenyewe.",
				"With two names, the first gets the position (counting from `0`) and the second gets the item.",
			),
			mfano({
				code: `fanya matunda = ["embe", "papai", "nanasi"]\n\nkwa i, tunda ktk matunda {\n    andika(i, tunda)\n}`,
				matokeo: "0 embe\n1 papai\n2 nanasi",
			}),
			mfano({ code: `kwa herufi ktk "Nuru" {\n    andika(herufi)\n}`, matokeo: "N\nu\nr\nu" }, l("Kupitia herufi za neno", "Walking through the letters of a word")),
			h3("mfululizo", "mfululizo"),
			p(
				"`mfululizo()` hutengeneza orodha ya namba, na ni rafiki mkubwa wa `kwa`. Namba ya mwisho haihusishwi.",
				"`mfululizo()` builds a list of numbers and pairs well with `kwa`. The end number is not included.",
			),
			{
				aina: "jedwali",
				vichwa: [l("Mwito", "Call"), l("Matokeo", "Result")],
				safu: [
					["`mfululizo(5)`", "`[0, 1, 2, 3, 4]`"],
					["`mfululizo(1, 6)`", "`[1, 2, 3, 4, 5]`"],
					["`mfululizo(0, 10, 3)`", "`[0, 3, 6, 9]`"],
					["`mfululizo(5, 0, -1)`", "`[5, 4, 3, 2, 1]`"],
				],
			},
			mfano({
				code: `kwa i ktk mfululizo(1, 6) {\n    andika(i, "x", i, "=", i * i)\n}`,
				matokeo: "1 x 1 = 1\n2 x 2 = 4\n3 x 3 = 9\n4 x 4 = 16\n5 x 5 = 25",
			}),
			h3("vunja na endelea", "vunja and endelea"),
			p(
				"`vunja` hutoka nje ya kitanzi mara moja. `endelea` huruka sehemu iliyobaki ya mzunguko huu na kwenda mzunguko unaofuata.",
				"`vunja` (break) leaves the loop at once. `endelea` (continue) skips the rest of this round and moves to the next one.",
			),
			mfano({
				code: `kwa n ktk mfululizo(1, 11) {\n    kama (n % 2 == 0) { endelea }   // ruka namba shufwa\n    kama (n > 7) { vunja }          // simama baada ya 7\n    andika(n)\n}`,
				matokeo: "1\n3\n5\n7",
			}),
		],
	},
	{
		id: "vitendakazi",
		kichwa: l("Vitendakazi", "Functions"),
		utangulizi: l(
			"Kitendakazi ni kipande cha kodi chenye jina, unachoweza kukiita tena na tena. Kiunde kwa `unda`, na tumia `rudisha` kurudisha jibu.",
			"A function is a named piece of code you can call again and again. Create one with `unda` and send back an answer with `rudisha` (return).",
		),
		vipande: [
			mfano({
				code: `fanya jumlisha = unda(a, b) {\n    rudisha a + b\n}\n\nandika(jumlisha(2, 3))\nandika(jumlisha(10, 32))`,
				matokeo: "5\n42",
			}),
			h3("Hoja zenye thamani ya kawaida", "Default arguments"),
			p(
				"Hoja inaweza kuwa na thamani ya kawaida. Ikiachwa wakati wa kuita, thamani hiyo hutumika.",
				"An argument can have a default value, used when the caller leaves it out.",
			),
			mfano({
				code: `fanya salimu = unda(jina, salamu = "Habari") {\n    andika(salamu + ", " + jina + "!")\n}\n\nsalimu("Amani")\nsalimu("Neema", "Mambo")`,
				matokeo: "Habari, Amani!\nMambo, Neema!",
			}),
			h3("Vitendakazi ndani ya vitendakazi", "Functions that make functions"),
			p(
				"Kitendakazi ni thamani kama nyingine: unaweza kukihifadhi kwenye kibadilika au kukirudisha. Kitendakazi cha ndani hukumbuka vibadilika vya mahali kilipoundwa (closure).",
				"A function is a value like any other: you can store it in a variable or return it. An inner function remembers the variables of the place where it was made (a closure).",
			),
			mfano({
				code: `fanya zidishaKwa = unda(n) {\n    rudisha unda(x) {\n        rudisha x * n\n    }\n}\n\nfanya mara2 = zidishaKwa(2)\nfanya mara10 = zidishaKwa(10)\nandika(mara2(7), mara10(7))`,
				matokeo: "14 70",
			}),
			dokezo(
				"Kitendakazi cha ndani kinaweza kusoma vibadilika vya nje, lakini kukipa kibadilika cha nje thamani mpya hakubadilishi kile cha nje.",
				"An inner function can read outer variables, but assigning a new value to an outer variable does not change the outer one.",
			),
			h3("Kujirudia", "Recursion"),
			p(
				"Kitendakazi kinaweza kujiita chenyewe. Kila mara kinatatua tatizo dogo zaidi hadi kifike kwenye hali ya msingi.",
				"A function can call itself. Each call solves a smaller problem until it reaches the base case.",
			),
			mfano({
				code: `fanya kipeo = unda(n) {\n    kama (n <= 1) { rudisha 1 }\n    fanya kabla = kipeo(n - 1)\n    rudisha n * kabla\n}\n\nandika(kipeo(5))`,
				matokeo: "120",
			}),
			dokezo(
				"Hifadhi jibu la mwito wa kujirudia kwenye kibadilika kwanza, kama `kabla` hapo juu. Toleo la kivinjari bado lina hitilafu inayosimamisha programu ukiandika `rudisha n * kipeo(n - 1)` moja kwa moja.",
				"Store the result of the recursive call in a variable first, like `kabla` above. The browser build still has a bug that stops the program when you write `rudisha n * kipeo(n - 1)` directly.",
			),
		],
	},
	{
		id: "orodha",
		kichwa: l("Orodha", "Lists (orodha)"),
		utangulizi: l(
			"Orodha huhifadhi vitu vingi kwa mpangilio. Kitu cha kwanza kiko nafasi `0`.",
			"An orodha holds many items in order. The first item is at position `0`.",
		),
		vipande: [
			mfano({
				code: `fanya rangi = ["nyekundu", "kijani", "bluu"]\n\nandika(rangi[0])\nrangi[1] = "njano"\nandika(rangi)\nandika(rangi[10])   // nafasi isiyokuwepo`,
				matokeo: "nyekundu\n[nyekundu, njano, bluu]\nnull",
			}),
			h3("Vitendakazi vya orodha", "Orodha methods"),
			{
				aina: "jedwali",
				vichwa: [l("Kitendakazi", "Method"), l("Kazi", "Does"), l("Mfano", "Example")],
				safu: [
					["`idadi()`", l("idadi ya vitu", "number of items"), "`[4, 5, 6].idadi()` → `3`"],
					["`sukuma(x, ...)`", l("ongeza kitu kimoja au zaidi mwishoni", "add one or more items at the end"), "`o.sukuma(7)`"],
					["`yamwisho()`", l("kitu cha mwisho", "the last item"), "`[4, 5, 6].yamwisho()` → `6`"],
					["`unga(kitenganishi)`", l("unganisha vitu kuwa NENO moja", "join the items into one NENO"), '`[1, 2].unga("-")` → `1-2`'],
					["`tafuta(x)`", l("rudisha `x` kama kipo, sivyo `tupu`", "return `x` if present, else `tupu`"), "`[4, 5].tafuta(5)` → `5`"],
					["`chuja(unda(x) {...})`", l("baki na vitu ambavyo kitendakazi kinarudisha `kweli`", "keep the items for which the function returns `kweli`"), "`o.chuja(unda(x) { rudisha x > 2 })`"],
					["`map(unda(x) {...})`", l("orodha mpya yenye jibu la kitendakazi kwa kila kitu", "a new orodha with the function's answer for each item"), "`o.map(unda(x) { rudisha x * 2 })`"],
				],
			},
			mfano({
				code: `fanya alama = [70, 85, 40, 92]\n\nandika(alama.idadi())\nalama.sukuma(66)\nandika(alama)\nandika(alama.yamwisho())\nandika(alama.unga(" | "))\nandika(alama.tafuta(85))\nandika(alama.tafuta(100))`,
				matokeo: "4\n[70, 85, 40, 92, 66]\n66\n70 | 85 | 40 | 92 | 66\n85\nnull",
			}),
			mfano({
				code: `fanya alama = [70, 85, 40, 92]\n\nfanya waliofaulu = alama.chuja(unda(a) { rudisha a >= 50 })\nfanya zaidi = alama.map(unda(a) { rudisha a + 5 })\n\nandika(waliofaulu)\nandika(zaidi)`,
				matokeo: "[70, 85, 92]\n[75, 90, 45, 97]",
			}, l("chuja na map", "chuja and map")),
			dokezo(
				"Kitendakazi unachokipa `chuja` au `map` kinaona hoja yake tu, si vibadilika vya nje. Andika namba unazohitaji ndani yake moja kwa moja.",
				"The function you pass to `chuja` or `map` sees only its own argument, not outer variables. Write the numbers it needs directly inside it.",
			),
			h3("Kujumlisha orodha", "Combining and summing"),
			mfano({
				code: `fanya a = [1, 2]\nfanya b = [3, 4]\nandika(a + b)\n\nfanya jumla = 0\nkwa x ktk a + b {\n    jumla += x\n}\nandika("Jumla:", jumla)`,
				matokeo: "[1, 2, 3, 4]\nJumla: 10",
			}),
		],
	},
	{
		id: "neno",
		kichwa: l("Neno", "Text (neno)"),
		utangulizi: l(
			"NENO ni maandishi ndani ya alama za nukuu, `\"hivi\"` au `'hivi'`. Neno lina vitendakazi vyake.",
			"A NENO is text inside quotes, `\"like this\"` or `'like this'`. Text has its own methods.",
		),
		vipande: [
			{
				aina: "jedwali",
				vichwa: [l("Kitendakazi", "Method"), l("Kazi", "Does"), l("Mfano", "Example")],
				safu: [
					["`idadi()`", l("idadi ya herufi", "number of characters"), '`"Nuru".idadi()` → `4`'],
					["`herufikubwa()`", l("HERUFI KUBWA", "UPPER CASE"), '`"nuru".herufikubwa()` → `NURU`'],
					["`herufindogo()`", l("herufi ndogo", "lower case"), '`"NURU".herufindogo()` → `nuru`'],
					["`gawa(kitenganishi)`", l("gawa neno kuwa orodha (kwa kawaida kwenye nafasi)", "split into an orodha (on spaces by default)"), '`"a,b".gawa(",")` → `[a, b]`'],
					["`panga(...)`", l("jaza nafasi `{0}`, `{1}` ... kwa hoja", "fill the slots `{0}`, `{1}` ... with the arguments"), '`"Habari {0}".panga("Amani")`'],
				],
			},
			mfano({
				code: `fanya jina = "Nuru Programu"\n\nandika(jina.idadi())\nandika(jina.herufikubwa())\nandika(jina.herufindogo())\nandika(jina.gawa())\nandika("embe,papai,nanasi".gawa(","))`,
				matokeo: "13\nNURU PROGRAMU\nnuru programu\n[Nuru, Programu]\n[embe, papai, nanasi]",
			}),
			mfano({
				code: `fanya ujumbe = "Habari {0}, una miaka {1}.".panga("Amani", 12)\nandika(ujumbe)`,
				matokeo: "Habari Amani, una miaka 12.",
			}, l("panga", "panga")),
			dokezo(
				"`{0}` ni hoja ya kwanza na `{1}` ni ya pili. Kila hoja unayoipa `panga` lazima itumike.",
				"`{0}` is the first argument and `{1}` the second. Every argument you pass to `panga` must be used.",
			),
			h3("Herufi maalum", "Special characters"),
			p(
				"Ndani ya neno, `\\n` huanzisha mstari mpya na `\\t` huweka nafasi ya tab.",
				"Inside text, `\\n` starts a new line and `\\t` inserts a tab.",
			),
			mfano({ code: `andika("Mstari wa kwanza\\nMstari wa pili")`, matokeo: "Mstari wa kwanza\nMstari wa pili" }),
			dokezo(
				"Huwezi kuchukua herufi moja kwa `neno[0]`. Pitia herufi kwa `kwa herufi ktk neno`.",
				"You cannot take a single character with `neno[0]`. Walk the characters with `kwa herufi ktk neno`.",
			),
		],
	},
	{
		id: "kamusi",
		kichwa: l("Kamusi", "Dictionaries (kamusi)"),
		utangulizi: l(
			"KAMUSI huhifadhi jozi za ufunguo na thamani. Ufunguo unaweza kuwa NENO, NAMBA, DESIMALI au BOOLEAN.",
			"A KAMUSI stores key and value pairs. A key can be a NENO, NAMBA, DESIMALI or BOOLEAN.",
		),
		vipande: [
			mfano({
				code: `fanya mwanafunzi = {"jina": "Amani", "darasa": 5}\n\nandika(mwanafunzi["jina"])\nmwanafunzi["shule"] = "Uhuru"\nmwanafunzi["darasa"] += 1\nandika(mwanafunzi["shule"], mwanafunzi["darasa"])\nandika(mwanafunzi["simu"])   // ufunguo usiokuwepo\nandika("jina" ktk mwanafunzi)`,
				matokeo: "Amani\nUhuru 6\nnull\nkweli",
			}),
			h3("Kupitia kamusi", "Looping over a kamusi"),
			mfano({
				code: `fanya bei = {"embe": 500, "papai": 1500, "nanasi": 2000}\n\nkwa tunda, shilingi ktk bei {\n    andika(tunda, "ni shilingi", shilingi)\n}`,
				matokeo: "embe ni shilingi 500\nnanasi ni shilingi 2000\npapai ni shilingi 1500",
				mpangilioWowote: true,
			}),
			dokezo(
				"Usitegemee mpangilio wa funguo. Ukichapisha kamusi nzima au kuipitia, funguo zinaweza kutoka kwa mpangilio tofauti na ulivyoziandika.",
				"Do not rely on key order. When you print or loop over a whole kamusi, the keys may come out in a different order from how you wrote them.",
			),
			p(
				"Kamusi mbili huunganishwa kwa `+`: `a + b` hutoa kamusi mpya yenye funguo za zote mbili.",
				"Join two dictionaries with `+`: `a + b` gives a new kamusi with the keys of both.",
			),
		],
	},
	{
		id: "ingizo",
		kichwa: l("Ingizo: jaza", "Input: jaza"),
		utangulizi: l(
			"`jaza()` huuliza swali na kusubiri mtumiaji aandike jibu. Uwanjani, jibu huandikwa kwenye terminali chini ya programu.",
			"`jaza()` asks a question and waits for the user to type an answer. In Uwanja, you type the answer in the terminal under the program.",
		),
		vipande: [
			mfano({
				code: `fanya jina = jaza("Jina lako ni nani? ")\nandika("Karibu, " + jina + "!")`,
				matokeo: "Karibu, Amani!",
				ingizo: ["Amani"],
			}),
			p(
				"`jaza()` hurudisha NENO kila mara, hata ukiandika namba. Tumia `namba()` kabla ya kufanya hesabu.",
				"`jaza()` always returns a NENO, even when you type a number. Use `namba()` before doing arithmetic.",
			),
			mfano({
				code: `fanya umri = namba(jaza("Una miaka mingapi? "))\nandika("Mwakani utakuwa na miaka", umri + 1)`,
				matokeo: "Mwakani utakuwa na miaka 13",
				ingizo: ["12"],
			}),
		],
	},
	{
		id: "moduli",
		kichwa: l("Moduli", "Modules"),
		utangulizi: l(
			"Moduli ni maktaba ya vitendakazi vya ziada. Ileta kwa `tumia`, kisha iite kwa nukta: `hisabati.sqrt(16)`.",
			"A module is a library of extra functions. Bring it in with `tumia`, then call into it with a dot: `hisabati.sqrt(16)`.",
		),
		vipande: [
			h3("hisabati", "hisabati", "hisabati"),
			p("Hesabu za kina: vipeuo, pembe, logi na namba za nasibu.", "Deeper maths: roots, angles, logarithms and random numbers."),
			{
				aina: "jedwali",
				vichwa: [l("Kitendakazi", "Function"), l("Kazi", "Does"), l("Mfano", "Example")],
				safu: [
					["`PI()`, `e()`, `phi()`", l("namba maalum", "special constants"), "`hisabati.PI()` → `3.141592653589793`"],
					["`sqrt(x)`, `cbrt(x)`", l("kipeuo cha pili, cha tatu", "square root, cube root"), "`hisabati.sqrt(16)` → `4`"],
					["`root(x, n)`", l("kipeuo cha n", "nth root"), "`hisabati.root(27, 3)` → `3`"],
					["`abs(x)`", l("thamani bila alama ya hasi", "absolute value"), "`hisabati.abs(-5)` → `5`"],
					["`sign(x)`", l("`-1`, `0` au `1`", "`-1`, `0` or `1`"), "`hisabati.sign(-3)` → `-1`"],
					["`round(x)`", l("kadiria DESIMALI hadi namba kamili", "round a DESIMALI to a whole number"), "`hisabati.round(2.6)` → `3`"],
					["`floor(x)`, `ceil(x)`", l("shusha, pandisha hadi namba kamili", "round down, round up"), "`hisabati.floor(2.9)` → `2`"],
					["`max(orodha)`, `min(orodha)`", l("kubwa zaidi, ndogo zaidi", "largest, smallest"), "`hisabati.max([3, 9, 2])` → `9`"],
					["`factorial(n)`", l("n! (n × ... × 1)", "n! (n × ... × 1)"), "`hisabati.factorial(5)` → `120`"],
					["`hypot(a, b)`", l("upande mrefu wa pembetatu", "hypotenuse"), "`hisabati.hypot(3, 4)` → `5`"],
					["`random()`", l("namba ya nasibu kati ya 0 na 1", "a random number from 0 to 1"), "`hisabati.random()`"],
					["`sin`, `cos`, `tan`, `asin`, `acos`, `atan`", l("pembe (kwa radiani, DESIMALI)", "trigonometry (radians, DESIMALI)"), "`hisabati.cos(0.0)` → `1`"],
					["`exp`, `log`, `log10`, `log2`", l("vipeo na logi (DESIMALI)", "exponent and logarithms (DESIMALI)"), "`hisabati.log2(8)` → `3`"],
				],
			},
			mfano({
				code: `tumia hisabati\n\nandika(hisabati.sqrt(16))\nandika(hisabati.PI())\nandika(hisabati.max([3, 9, 2]))\nandika(hisabati.round(2.6))\nandika(hisabati.factorial(5))\nandika(hisabati.cos(0.0))`,
				matokeo: "4\n3.141592653589793\n9\n3\n120\n1",
			}),
			mfano({
				code: `tumia hisabati\n\nfanya kete = hisabati.floor(hisabati.random() * 6) + 1\nandika("Kete imeonyesha", kete)`,
				matokeo: "Kete imeonyesha 4",
				muundo: /^Kete imeonyesha [1-6]$/,
			}, l("Kurusha kete", "Rolling a die")),
			dokezo(
				"`PI()` na `e()` ni vitendakazi, kwa hiyo weka mabano. Vitendakazi vya pembe, `round`, `exp` na `log` vinapokea DESIMALI tu: andika `hisabati.cos(0.0)`, si `hisabati.cos(0)`.",
				"`PI()` and `e()` are functions, so include the brackets. The angle functions, `round`, `exp` and `log` accept only a DESIMALI: write `hisabati.cos(0.0)`, not `hisabati.cos(0)`.",
			),

			h3("muda", "muda", "muda"),
			p("Saa, tarehe na kusubiri. Muda huandikwa kama `saa:dakika:sekunde siku-mwezi-mwaka`.", "Time, dates and waiting. Times look like `hour:minute:second day-month-year`."),
			{
				aina: "jedwali",
				vichwa: [l("Kitendakazi", "Function"), l("Kazi", "Does"), l("Mfano", "Example")],
				safu: [
					["`hasahivi()`", l("muda wa sasa", "the current time"), "`muda.hasahivi()`"],
					["`leo()`", l("tarehe ya leo", "today's date"), "`muda.leo()` → `12-10-2026`"],
					["`lala(sekunde)`", l("subiri kwa sekunde kadhaa", "wait a number of seconds"), "`muda.lala(1)`"],
					["`tangu(m)`", l("sekunde zilizopita tangu muda `m`", "seconds since time `m`"), "`muda.tangu(mwanzo)`"],
					["`baada_ya(sekunde)`", l("muda baada ya sekunde kadhaa kuanzia sasa", "the time some seconds from now"), "`muda.baada_ya(60)`"],
					["`tofauti(a, b)`", l("sekunde kati ya nyakati mbili", "seconds between two times"), "`muda.tofauti(b, a)`"],
					["`ongeza(m, dakika=5)`", l("ongeza `sekunde`, `dakika`, `masaa`, `siku`, `wiki`, `miezi` au `miaka`", "add `sekunde`, `dakika`, `masaa`, `siku`, `wiki`, `miezi` or `miaka`"), "`muda.ongeza(m, siku=1)`"],
				],
			},
			mfano({
				code: `tumia muda\n\nfanya mwanzo = muda.hasahivi()\nandika("Leo ni", muda.leo())\nmuda.lala(1)\nandika("Sekunde zilizopita:", muda.tangu(mwanzo))`,
				matokeo: "Leo ni 12-10-2026\nSekunde zilizopita: 1",
				muundo: /^Leo ni \d\d-\d\d-\d{4}\nSekunde zilizopita: [12]$/,
			}),

			h3("jsoni", "jsoni", "jsoni"),
			p("Soma na uandike data ya JSON, muundo unaotumiwa na tovuti nyingi.", "Read and write JSON, the data format most websites use."),
			{
				aina: "jedwali",
				vichwa: [l("Kitendakazi", "Function"), l("Kazi", "Does")],
				safu: [
					["`dikodi(neno)`", l("geuza JSON kuwa kamusi au orodha", "turn JSON text into a kamusi or orodha")],
					["`enkodi(thamani)`", l("geuza kamusi au orodha kuwa JSON", "turn a kamusi or orodha into JSON text")],
				],
			},
			mfano({
				code: `tumia jsoni\n\nfanya data = jsoni.dikodi("{\\"jina\\": \\"Amani\\", \\"alama\\": [90, 85]}")\nandika(data["jina"])\nandika(data["alama"])\nandika(jsoni.enkodi({"somo": "Nuru"}))`,
				matokeo: 'Amani\n[90, 85]\n{"somo":"Nuru"}',
			}),

			h3("kobe", "kobe", "kobe"),
			p(
				"Kobe ni kasa mdogo anayechora kwenye turubai ya 600 × 600. Anaanzia katikati `(0, 0)` akielekea mashariki (kulia). `y` huongezeka kwenda juu. Programu yenye `tumia kobe` hufunguka Uwanjani pamoja na turubai.",
				"Kobe is a small turtle that draws on a 600 × 600 canvas. It starts in the middle at `(0, 0)` facing east (right), and `y` grows upwards. A program with `tumia kobe` opens in Uwanja next to the canvas.",
			),
			{
				aina: "jedwali",
				vichwa: [l("Kitendakazi", "Function"), l("Kazi", "Does")],
				safu: [
					["`mbele(n)`, `nyuma(n)`", l("sogea mbele au nyuma hatua `n`", "move forward or back `n` steps")],
					["`kulia(digrii)`, `kushoto(digrii)`", l("geuka kulia au kushoto", "turn right or left")],
					["`elekea(digrii)`", l("elekea upande fulani: `0` mashariki, `90` kaskazini", "face a direction: `0` east, `90` north")],
					["`nenda(x, y)`", l("nenda moja kwa moja hadi `(x, y)`", "go straight to `(x, y)`")],
					["`nyumbani()`", l("rudi katikati ukielekea mashariki", "return to the middle, facing east")],
					["`kalamu_juu()`, `kalamu_chini()`", l("inua kalamu (sogea bila kuchora), ishushe", "lift the pen (move without drawing), put it down")],
					["`rangi(r)`", l("rangi ya kalamu", "pen colour")],
					["`rangi_ya_ndani(r)`", l("rangi ya kujaza maumbo", "fill colour")],
					["`anza_kujaza()`, `maliza_kujaza()`", l("anza umbo, kisha lipake rangi ya ndani", "start a shape, then fill it")],
					["`unene(n)`", l("unene wa mstari", "line width")],
					["`duara(r)`", l("chora duara lenye nusukipenyo `r` kuzunguka kobe", "draw a circle of radius `r` around the turtle")],
					["`nukta(ukubwa)`", l("weka nukta", "draw a dot")],
					["`maandishi(neno, ukubwa)`", l("andika maneno kwenye turubai", "write text on the canvas")],
					["`mandhari(r)`", l("rangi ya turubai", "background colour")],
					["`kasi(n)`", l("kasi ya kuchora: `0` papo hapo hadi `10`", "drawing speed: `0` instant to `10`")],
					["`futa()`", l("safisha turubai", "clear the canvas")],
					["`ficha()`, `onyesha()`", l("ficha au onyesha kobe", "hide or show the turtle")],
					["`mahali()`", l("rudisha `[x, y]`", "return `[x, y]`")],
					["`mwelekeo()`", l("rudisha mwelekeo kwa digrii", "return the heading in degrees")],
				],
			},
			p(
				"Rangi: `nyeusi`, `nyeupe`, `nyekundu`, `kijani`, `bluu`, `samawati`, `njano`, `machungwa`, `zambarau`, `waridi`, `kahawia`, `kijivu`, `dhahabu`, `fedha`, au msimbo kama `\"#ff8800\"`.",
				"Colours: `nyeusi` (black), `nyeupe` (white), `nyekundu` (red), `kijani` (green), `bluu` (blue), `samawati` (sky blue), `njano` (yellow), `machungwa` (orange), `zambarau` (purple), `waridi` (pink), `kahawia` (brown), `kijivu` (grey), `dhahabu` (gold), `fedha` (silver), or a code such as `\"#ff8800\"`.",
			),
			mfano({
				code: `tumia kobe\n\nkobe.rangi("bluu")\nkobe.unene(4)\nkwa i ktk mfululizo(4) {\n    kobe.mbele(150)\n    kobe.kulia(90)\n}\nandika(kobe.mahali())`,
				matokeo: "[0, 0]",
				mode: "kobe",
			}, l("Mraba", "A square")),
			mfano({
				code: `tumia kobe\n\nkobe.rangi("nyekundu")\nkobe.rangi_ya_ndani("njano")\nkobe.nenda(-100, 30)\nkobe.anza_kujaza()\nkwa i ktk mfululizo(5) {\n    kobe.mbele(200)\n    kobe.kulia(144)\n}\nkobe.maliza_kujaza()`,
				matokeo: "",
				mode: "kobe",
			}, l("Nyota iliyojazwa", "A filled star")),
			mfano({
				code: `tumia kobe\n\nfanya rangi = ["nyekundu", "machungwa", "njano", "kijani", "bluu", "zambarau"]\nkobe.kalamu_juu()\nkwa i, r ktk rangi {\n    kobe.nyumbani()\n    kobe.elekea(i * 60)\n    kobe.mbele(120)\n    kobe.rangi(r)\n    kobe.nukta(50)\n}\nkobe.nyumbani()\nkobe.rangi("nyeusi")\nkobe.maandishi("Nuru", 28)`,
				matokeo: "",
				mode: "kobe",
			}, l("Duara la rangi", "A ring of colours")),

			h3("ubao", "ubao", "ubao"),
			p(
				"Ubao ni bodi ya elektroniki ya kuigiza: taa 8 (namba `1` hadi `8`), kengele na skrini ndogo ya mistari 2 yenye herufi 16 kila mstari. Ni hatua ya kwanza kabla ya kushika vifaa halisi.",
				"Ubao is a simulated electronics board: 8 lights (numbered `1` to `8`), a buzzer and a small screen of 2 lines with 16 characters each. It is the first step before real hardware.",
			),
			{
				aina: "jedwali",
				vichwa: [l("Kitendakazi", "Function"), l("Kazi", "Does")],
				safu: [
					["`washa(n)`, `zima(n)`", l("washa au zima taa namba `n`", "turn light `n` on or off")],
					["`geuza(n)`", l("badilisha hali ya taa", "toggle a light")],
					["`washa_zote()`, `zima_zote()`", l("washa au zima taa zote", "turn every light on or off")],
					["`imewaka(n)`", l("rudisha `kweli` kama taa imewaka", "return `kweli` if the light is on")],
					["`rangi(n, r)`", l("rangi ya taa `n`", "colour of light `n`")],
					["`kengele(hz, ms)`", l("piga kengele: sauti kwa Hz, muda kwa milisekunde", "sound the buzzer: pitch in Hz, length in milliseconds")],
					["`skrini(neno)`", l("andika kwenye skrini ndogo", "write on the small screen")],
					["`subiri(ms)`", l("subiri milisekunde kadhaa", "wait some milliseconds")],
				],
			},
			mfano({
				code: `tumia ubao\n\nubao.skrini("Taa zinawaka")\nkwa i ktk mfululizo(1, 9) {\n    ubao.washa(i)\n    ubao.subiri(150)\n}\nubao.kengele(880, 300)\nubao.zima_zote()`,
				matokeo: "",
				mode: "ubao",
			}, l("Taa moja baada ya nyingine", "One light after another")),
			mfano({
				code: `tumia ubao\n\nubao.rangi(1, "nyekundu")\nubao.rangi(2, "njano")\nubao.rangi(3, "kijani")\n\nkwa taa ktk [1, 2, 3] {\n    ubao.washa(taa)\n    ubao.subiri(700)\n    ubao.zima(taa)\n}\nandika(ubao.imewaka(3))`,
				matokeo: "sikweli",
				mode: "ubao",
			}, l("Taa za barabarani", "Traffic lights")),
		],
	},
	{
		id: "makosa",
		kichwa: l("Makosa ya kawaida", "Common errors"),
		utangulizi: l(
			"Nuru hueleza makosa kwa Kiswahili na hutaja mstari ulipotokea. Haya ndiyo utakayoyaona mara nyingi.",
			"Nuru explains errors in Swahili and names the line where they happened. These are the ones you will meet most often.",
		),
		vipande: [
			{
				aina: "jedwali",
				vichwa: [l("Ujumbe", "Message"), l("Maana yake", "What it means"), l("Rekebisha", "Fix")],
				safu: [
					["`Neno Halifahamiki: x`", l("umetumia jina ambalo halijaundwa", "you used a name that was never created"), l("liunde kwa `fanya` kwanza, au angalia tahajia", "create it with `fanya` first, or check the spelling")],
					["`Aina Hazilingani: NENO + NAMBA`", l("umechanganya aina mbili zisizoendana", "you mixed two types that do not go together"), l("geuza kwa `tungo()` au `namba()`", "convert with `tungo()` or `namba()`")],
					["`Operesheni Haieleweki: NENO < NENO`", l("mwendeshaji huu haufanyi kazi na aina hii", "this operator does not work on this type"), l("tumia mwendeshaji mwingine", "use a different operator")],
					["`Tulitegemea kupata ), badala yake tumepata MWISHO`", l("mabano hayajafungwa; `MWISHO` ni mwisho wa kodi", "a bracket was not closed; `MWISHO` is the end of the code")],
					["`Hukufunga Mabano '}'`", l("`{` haina `}` yake", "a `{` has no matching `}`"), l("ongeza `}`", "add the `}`")],
					["`Tulitegemea kupata (, badala yake tumepata KITAMBULISHI`", l("`kama` au `wakati` bila mabano `( )`", "`kama` or `wakati` without `( )`"), l("andika `kama (x > 3) { ... }`", "write `kama (x > 3) { ... }`")],
					["`Hiki sio kiendesha: NAMBA`", l("umeita kitu ambacho si kitendakazi", "you called something that is not a function")],
					["`Tumekosa Hoja`", l("kitendakazi kimeitwa na hoja chache kuliko inavyohitaji", "a function was called with too few arguments")],
					["`Samahani, kiendesha hiki hakitumiki na tungo (Neno)`", l("kitendakazi hicho hakipo kwa orodha au neno hili", "that method does not exist on this orodha or neno"), l("angalia majedwali ya Orodha na Neno", "check the Orodha and Neno tables")],
					["`Haiwezi kubadilisha 'abc' kuwa NAMBA`", l("`namba()` imepewa maandishi yasiyo namba", "`namba()` got text that is not a number")],
					["`Moduli sayari haipo`", l("hakuna moduli yenye jina hilo", "there is no module with that name"), l("angalia sehemu ya Moduli", "see the Moduli section")],
					["`Hoja lazima iwe desimali`", l("kitendakazi cha `hisabati` kinahitaji DESIMALI", "a `hisabati` function needs a DESIMALI"), l("andika `0.0` badala ya `0`", "write `0.0` instead of `0`")],
				],
			},
			p(
				"Maneno machache yanajirudia kwenye ujumbe: **Mstari** ni namba ya mstari, **Hoja** ni thamani unayokipa kitendakazi, **KITAMBULISHI** ni jina, na **HARAMU** ni herufi ambayo Nuru haiijui.",
				"A few words come up again and again: **Mstari** is the line number, **Hoja** is a value you pass to a function, **KITAMBULISHI** is a name, and **HARAMU** is a character Nuru does not know.",
			),
			mfano({ code: `fanya jina = "Amani"\nandika(Jina)`, matokeo: "Kosa: Mstari 2: Neno Halifahamiki: Jina" }, l("Herufi kubwa na ndogo", "Upper and lower case")),
			mfano({ code: `fanya umri = 12\nandika("Umri: " + umri)`, matokeo: "Kosa: Mstari 2: Aina Hazilingani: NENO + NAMBA" }, l("Kuchanganya aina", "Mixing types")),
			mfano({
				code: `fanya x = 5\nkama x > 3 {\n    andika("kubwa")\n}`,
				matokeo: "Kuna makosa yafuatayo:\n\tMstari 2: Tulitegemea kupata (, badala yake tumepata KITAMBULISHI\n\tMstari 3: Tulitegemea kupata :, badala yake tumepata }\n\tMstari 4: Tumeshindwa kuparse }",
			}, l("Mabano yaliyosahaulika", "Forgotten brackets")),
			dokezo(
				"Kosa moja la sintaksia linaweza kuleta jumbe kadhaa. Rekebisha ujumbe wa kwanza, kisha endesha tena.",
				"One syntax mistake can produce several messages. Fix the first message, then run again.",
			),
		],
	},
];
