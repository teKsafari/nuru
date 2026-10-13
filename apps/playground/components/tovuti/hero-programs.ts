// Programs the landing page "types" in its live code card. They never run in the
// browser; hakiki-mifano.mts runs them against the real wasm build to keep the
// shown output honest.
export type HeroProgram = { faili: string; code: string; matokeo: string };

export const heroPrograms: HeroProgram[] = [
	{
		faili: "salamu.nr",
		code: `fanya marafiki = ["Amani", "Neema", "Baraka"]\n\nkwa jina ktk marafiki {\n    andika("Mambo, " + jina + "!")\n}`,
		matokeo: "Mambo, Amani!\nMambo, Neema!\nMambo, Baraka!",
	},
	{
		faili: "hesabu.nr",
		code: `fanya mraba = unda(n) {\n    rudisha n * n\n}\n\nkwa i ktk mfululizo(1, 5) {\n    andika(i, "->", mraba(i))\n}`,
		matokeo: "1 -> 1\n2 -> 4\n3 -> 9\n4 -> 16",
	},
	{
		faili: "hali.nr",
		code: `fanya joto = 31\n\nkama (joto > 28) {\n    andika("Kuna jua kali, kunywa maji")\n} sivyo {\n    andika("Hali ni shwari leo")\n}`,
		matokeo: "Kuna jua kali, kunywa maji",
	},
];
