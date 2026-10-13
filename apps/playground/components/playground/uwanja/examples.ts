// Curated programs for the Mifano menu in Uwanja. Code and titles stay in
// Swahili; only the one-line description is translated.
import type { UwanjaMode } from "@/lib/share";

export interface Mfano {
	id: string;
	title: string;
	desc: { sw: string; en: string };
	mode: UwanjaMode;
	code: string;
}

export const WELCOME = `// Karibu Uwanjani!
// Andika kodi yako hapa, kisha bonyeza Endesha (Ctrl + Enter).

andika("Habari, Dunia!")

fanya jina = jaza("Unaitwa nani? ")
andika("Karibu Nuru, " + jina + "!")
`;

export const MIFANO: Mfano[] = [
	{
		id: "salamu",
		title: "Salamu",
		desc: { sw: "Programu inakuuliza jina lako na kukusalimu", en: "Asks for your name and greets you" },
		mode: "terminal",
		code: `// Salamu: programu inazungumza nawe
fanya jina = jaza("Unaitwa nani? ")
fanya mji = jaza("Unaishi mji gani? ")

andika("Mambo " + jina + "!")
andika("Salamu nyingi kwa watu wote wa " + mji + ".")
`,
	},
	{
		id: "jedwali",
		title: "Jedwali la kuzidisha",
		desc: { sw: "Jedwali la kuzidisha la namba yoyote", en: "A times table for any number" },
		mode: "terminal",
		code: `// Jedwali la kuzidisha
fanya n = namba(jaza("Jedwali la namba gani? "))

kwa i ktk mfululizo(1, 13) {
    andika(n, "x", i, "=", n * i)
}
`,
	},
	{
		id: "kuku-bata",
		title: "Kuku na Bata",
		desc: { sw: "FizzBuzz kwa Kiswahili: 3 ni Kuku, 5 ni Bata", en: "FizzBuzz in Swahili: 3 is Kuku, 5 is Bata" },
		mode: "terminal",
		code: `// Kuku na Bata (FizzBuzz ya Kiswahili)
// Namba inayogawanyika kwa 3 ni "Kuku", kwa 5 ni "Bata",
// na kwa zote mbili ni "Kuku Bata!"

kwa i ktk mfululizo(1, 31) {
    kama (i % 15 == 0) {
        andika("Kuku Bata!")
    } au kama (i % 3 == 0) {
        andika("Kuku")
    } au kama (i % 5 == 0) {
        andika("Bata")
    } sivyo {
        andika(i)
    }
}
`,
	},
	{
		id: "nyota",
		title: "Nyota ya kobe",
		desc: { sw: "Kobe anachora nyota ya dhahabu", en: "The tortoise draws a golden star" },
		mode: "kobe",
		code: `// Nyota ya kobe
tumia kobe

kobe.mandhari("#1c2541")
kobe.rangi("dhahabu")
kobe.rangi_ya_ndani("njano")
kobe.unene(3)

kobe.kalamu_juu()
kobe.nenda(-120, 40)
kobe.kalamu_chini()

kobe.anza_kujaza()
kwa i ktk mfululizo(5) {
    kobe.mbele(240)
    kobe.kulia(144)
}
kobe.maliza_kujaza()
kobe.ficha()
`,
	},
	{
		id: "ua",
		title: "Ua la kobe",
		desc: { sw: "Miraba 36 inazunguka na kuwa ua", en: "36 turning squares become a flower" },
		mode: "kobe",
		code: `// Ua la kobe: mraba mmoja, ukizungushwa mara 36
tumia kobe

fanya rangi = ["nyekundu", "machungwa", "njano", "kijani", "bluu", "zambarau"]
kobe.kasi(9)
kobe.unene(2)

fanya mraba = unda(upande) {
    kwa j ktk mfululizo(4) {
        kobe.mbele(upande)
        kobe.kulia(90)
    }
}

kwa i ktk mfululizo(36) {
    kobe.rangi(rangi[i % 6])
    mraba(130)
    kobe.kulia(10)
}

kobe.rangi("kahawia")
kobe.nukta(24)
`,
	},
	{
		id: "ond",
		title: "Ond ya rangi",
		desc: { sw: "Mstari unaozunguka na kukua", en: "A growing, turning spiral" },
		mode: "kobe",
		code: `// Ond: kila hatua ni ndefu kidogo kuliko iliyopita
tumia kobe

fanya rangi = ["samawati", "zambarau", "waridi"]
kobe.kasi(8)

kwa i ktk mfululizo(120) {
    kobe.rangi(rangi[i % 3])
    kobe.mbele(i * 2)
    kobe.kushoto(91)
}
`,
	},
	{
		id: "taa-barabarani",
		title: "Taa za barabarani",
		desc: { sw: "Nyekundu, njano, kijani: kama makutano ya barabara", en: "Red, amber, green, like a road junction" },
		mode: "ubao",
		code: `// Taa za barabarani kwenye ubao
tumia ubao

ubao.rangi(1, "nyekundu")
ubao.rangi(2, "njano")
ubao.rangi(3, "kijani")

kwa mzunguko ktk mfululizo(3) {
    ubao.zima_zote()
    ubao.washa(1)
    ubao.skrini("SIMAMA\\nSubiri kidogo")
    ubao.subiri(1500)

    ubao.washa(2)
    ubao.skrini("JIANDAE")
    ubao.subiri(700)

    ubao.zima(1)
    ubao.zima(2)
    ubao.washa(3)
    ubao.skrini("NENDA\\nVuka kwa makini")
    ubao.kengele(880, 150)
    ubao.subiri(1500)

    ubao.zima(3)
    ubao.washa(2)
    ubao.skrini("JIANDAE KUSIMAMA")
    ubao.subiri(700)
}
ubao.zima_zote()
ubao.skrini("Safari njema!")
`,
	},
	{
		id: "mbio-za-taa",
		title: "Mbio za taa",
		desc: { sw: "Taa inakimbia kushoto na kulia", en: "A light that races left and right" },
		mode: "ubao",
		code: `// Mbio za taa: mwanga unakimbia huku na huko
tumia ubao

kwa i ktk mfululizo(1, 9) {
    ubao.rangi(i, "samawati")
}
ubao.skrini("MBIO ZA TAA")

kwa mzunguko ktk mfululizo(4) {
    kwa i ktk mfululizo(1, 9) {
        ubao.washa(i)
        ubao.subiri(70)
        ubao.zima(i)
    }
    kwa i ktk mfululizo(7, 1, -1) {
        ubao.washa(i)
        ubao.subiri(70)
        ubao.zima(i)
    }
}
ubao.washa_zote()
ubao.kengele(660, 300)
ubao.skrini("Mwisho!")
`,
	},
	{
		id: "nadhani",
		title: "Nadhani namba",
		desc: { sw: "Mchezo: kompyuta imeficha namba kati ya 1 na 50", en: "A game: guess the hidden number from 1 to 50" },
		mode: "terminal",
		code: `// Nadhani namba
tumia hisabati

fanya siri = hisabati.floor(hisabati.random() * 50) + 1
fanya majaribio = 0

andika("Nimeficha namba kati ya 1 na 50. Inaweza kuwa ipi?")

wakati (kweli) {
    fanya jibu = namba(jaza("Nadhani: "))
    majaribio = majaribio + 1

    kama (jibu < siri) {
        andika("Juu zaidi!")
    } au kama (jibu > siri) {
        andika("Chini zaidi!")
    } sivyo {
        andika("Hongera! Ni " + tungo(siri) + ". Umepata kwa majaribio " + tungo(majaribio) + ".")
        vunja
    }
}
`,
	},
	{
		id: "wimbo",
		title: "Wimbo wa kengele",
		desc: { sw: "Kengele ya ubao inapiga wimbo mfupi", en: "The board's buzzer plays a short tune" },
		mode: "ubao",
		code: `// Wimbo wa kengele: kila noti inawasha taa yake
tumia ubao

fanya noti = [523, 587, 659, 698, 784, 880, 988, 1047]
fanya wimbo = [1, 1, 5, 5, 6, 6, 5, 4, 4, 3, 3, 2, 2, 1]

ubao.skrini("Sikiliza...")
kwa n ktk wimbo {
    ubao.washa(n)
    ubao.kengele(noti[n - 1], 260)
    ubao.zima(n)
    ubao.subiri(40)
}
ubao.skrini("Asante!")
`,
	},
];
