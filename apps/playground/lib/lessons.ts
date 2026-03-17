import { Lesson } from "@/types/playground";

export const initialLesson: Lesson = {
	id: "misingi-ya-nuru",
	title: {
		sw: "Misingi ya Nuru",
		en: "Nuru Basics",
	},
	steps: [
		{
			id: "karibu",
			title: {
				sw: "1. Karibu katika Nuru!",
				en: "1. Welcome to Nuru!",
			},
			description: {
				sw: `Nuru ni lugha ya programu iliyoundwa mahsusi kwa ajili ya wazungumzaji wa Kiswahili. Inakuwezesha kuandika programu kwa kutumia maneno unayoyafahamu badala ya Kiingereza pekee.

Lengo letu ni kuvunja kizuizi cha lugha katika ulimwengu wa teknolojia. Katika mafunzo haya, utajifunza misingi yote ya programu hatua kwa hatua.

Programu ni mfululizo wa amri unazompa kompyuta. Hebu tuanze kwa kuona jinsi programu inavyofanya kazi!`,
				en: `Nuru is a programming language designed specifically for Swahili speakers. It allows you to write code using words you already know instead of just English.

Our goal is to break the language barrier in the tech world. In this tutorial, you will learn all the basics of programming step by step.

A program is a series of commands you give to the computer. Let's start by seeing how a program works!`,
			},
			task: {
				sw: "Bonyeza kitufe cha 'Run' (kile cha kijani chenye alama ya play) kuona matokeo ya programu hii kwenye sehemu ya 'Output'.",
				en: "Click the 'Run' button (the green one with the play icon) to see the results of this program in the 'Output' section.",
			},
			initialCode: `// Huu ni mwanzo wa safari yako!\nandika("Habari Nuru!")`,
			solution: `andika("Habari Nuru!")`,
		},
		{
			id: "andika",
			title: {
				sw: "2. Kutoa Matokeo (andika)",
				en: "2. Outputting Results (andika)",
			},
			description: {
				sw: `Kitendakazi cha \`andika()\` kinatumika kutoa taarifa au matokeo kwenye skrini. Ni njia yetu kuu ya kuzungumza na mtumiaji.

### Sifa za andika():
1. Inachukua kitu chochote (namba, maandishi, n.k.) na kukichapisha.
2. Unaweza kuandika vitu vingi kwa pamoja ukivigawa kwa mkwaju (comma \`,\`).
3. Kwa maandishi (tungo), lazima uyaweke ndani ya alama za nukuu \`" "\`.

### Mfano:
\`\`\`s
andika("Mambo", "vipi?") // Itachapisha: Mambo vipi?
andika(2024)             // Itachapisha: 2024
\`\`\`

Unaweza pia kutumia herufi maalum kama \`/n\` kuanza mstari mpya:
\`\`\`s
andika("Mstari wa kwanza /n Mstari wa pili")
\`\`\`
`,
				en: `The \`andika()\` function is used to display information or results on the screen. It is our main way of talking to the user.

### Features of andika():
1. It takes anything (numbers, text, etc.) and prints it.
2. You can print multiple things at once by separating them with a comma (\`,\`).
3. For text (strings), you must place them inside double quotes (\`" "\`).

### Example:
\`\`\`s
andika("Hello", "World") // Prints: Hello World
andika(2024)             // Prints: 2024
\`\`\`

You can also use special characters like \`/n\` to start a new line:
\`\`\`s
andika("First line /n Second line")
\`\`\`
`,
			},
			task: {
				sw: "Tumia `andika()` kuchapisha jina lako na mji unaoishi katika mistari miwili tofauti ukitumia `/n`.",
				en: "Use `andika()` to print your name and the city you live in on two different lines using `/n`.",
			},
			initialCode: `andika("Jina langu ni ... /n Naishi ...")`,
			solution: `andika("Jina langu ni Amani /n Naishi Dar es Salaam")`,
		},
		{
			id: "maoni",
			title: {
				sw: "3. Maoni (Comments)",
				en: "3. Comments",
			},
			description: {
				sw: `Maoni ni mistari ya maandishi ambayo mfasiri wa Nuru anairuka. Yanatumika kutoa maelezo kwa binadamu wanaosoma msimbo wako.

### Aina za Maoni:
1. **Mstari mmoja**: Tumia \`//\`. Kila kitu baada ya alama hii kitarukwa.
2. **Mistari mingi**: Tumia \`/*\` kuanza na \`*/\` kumaliza.

### Mfano:
\`\`\`s
// Hii ni namba ya siri
fanya siri = 1234

/* 
   Hapa tunaandika
   maelezo marefu
   sana...
*/
andika("Tayari")
\`\`\`
`,
				en: `Comments are lines of text that the Nuru interpreter ignores. They are used to provide explanations for humans reading your code.

### Types of Comments:
1. **Single line**: Use \`//\`. Everything after this symbol will be ignored.
2. **Multi-line**: Use \`/*\` to start and \`*/\` to end.

### Example:
\`\`\`s
// This is a secret number
fanya secret = 1234

/* 
   Here we write
   very long 
   explanations...
*/
andika("Ready")
\`\`\`
`,
			},
			task: {
				sw: "Ongeza maoni ya mstari mmoja juu ya amri ya `andika()` inayofuata.",
				en: "Add a single-line comment above the following `andika()` command.",
			},
			initialCode: `// Andika maoni yako hapa\nandika("Maoni hayataonekana!")`,
			solution: `// Hii ni programu yangu\nandika("Maoni hayataonekana!")`,
		},
		{
			id: "vibadilika",
			title: {
				sw: "4. Vibadilika (Variables)",
				en: "4. Variables",
			},
			description: {
				sw: `Kibadilika ni kama sanduku ambalo unatumia kuhifadhi taarifa. Unakipa sanduku hilo jina ili uweze kulitumia baadaye.

Tunatumia alama ya \`=\` kumpa kibadilika thamani. Unaweza kutumia neno \`fanya\` kuanzisha kibadilika kipya kwa mara ya kwanza.

### Sheria za majina:
- Lazima lianze na herufi.
- Lisianze na namba.
- Herufi kubwa na ndogo ni tofauti (\`jina\` ni tofauti na \`Jina\`).

### Mfano:
\`\`\`s
fanya mwaka = 2024
jina = "Nuru"
andika(jina, "ilikuwepo tangu", mwaka)
\`\`\`
`,
				en: `A variable is like a box that you use to store information. You give that box a name so you can use it later.

We use the \`=\` sign to assign a value to a variable. You can use the word \`fanya\` to initialize a new variable for the first time.

### Naming rules:
- It must start with a letter.
- It must not start with a number.
- Case sensitivity matters (\`name\` is different from \`Name\`).

### Example:
\`\`\`s
fanya year = 2024
name = "Nuru"
andika(name, "existed since", year)
\`\`\`
`,
			},
			task: {
				sw: "Tengeneza vibadilika viwili: `mwanzo = 10` na `mwisho = 20`, kisha andika jumla yao.",
				en: "Create two variables: `mwanzo = 10` and `mwisho = 20`, then print their sum.",
			},
			initialCode: `fanya mwanzo = 10\nmwisho = 20\nandika(mwanzo + mwisho)`,
			solution: `fanya mwanzo = 10\nmwisho = 20\nandika(mwanzo + mwisho)`,
		},
		{
			id: "aina-za-data",
			title: {
				sw: "5. Aina za Data na Hisabati",
				en: "5. Data Types and Math",
			},
			description: {
				sw: `Katika Nuru, kuna aina mbalimbali za taarifa:
1. **Namba (Integers)**: Namba nzima kama \`10\`, \`-5\`.
2. **Desimali (Floats)**: Namba zenye nukta kama \`3.14\`, \`0.5\`.
3. **Tungo (Strings)**: Maandishi yaliyo ndani ya \`" "\`.
4. **Buliani (Booleans)**: Thamani za \`kweli\` au \`sikweli\`.

### Alama za Hisabati:
- \`+\` (Jumla), \`-\` (Kutoa), \`*\` (Kuzidisha), \`/\` (Kugawanya), \`%\` (Baki).

### Mfano:
\`\`\`s
andika(10 + 5.5)  // 15.5
andika("Nuru" + " ni " + "nzuri") // Kuunganisha maandishi
andika(10 % 3)    // 1 (baki la kugawa 10 kwa 3)
\`\`\`
`,
				en: `In Nuru, there are different types of information:
1. **Numbers (Integers)**: Whole numbers like \`10\`, \`-5\`.
2. **Floats**: Decimal numbers like \`3.14\`, \`0.5\`.
3. **Strings**: Text inside \`" "\`.
4. **Booleans**: Values of \`kweli\` (true) or \`sikweli\` (false).

### Math Operators:
- \`+\` (Add), \`-\` (Subtract), \`*\` (Multiply), \`/\` (Divide), \`%\` (Modulo/Remainder).

### Example:
\`\`\`s
andika(10 + 5.5)  // 15.5
andika("Nuru" + " is " + "great") // Combining text
andika(10 % 3)    // 1 (remainder of 10 divided by 3)
\`\`\`
`,
			},
			task: {
				sw: "Andika programu inayozidisha 12 kwa 12 na kuionyesha.",
				en: "Write a program that multiplies 12 by 12 and displays it.",
			},
			initialCode: `andika(12 * 12)`,
			solution: `andika(12 * 12)`,
		},
		{
			id: "logic",
			title: {
				sw: "6. Ulinganifu na Mantiki",
				en: "6. Comparisons and Logic",
			},
			description: {
				sw: `Unapotaka kulinganisha thamani, unatumia viendeshaji hivi:

### Alama za Ulinganifu:
- \`==\` (Sawa), \`!=\` (Si sawa), \`>\` (Kubwa), \`<\` (Ndogo), \`>=\` (Kubwa au sawa), \`<=\` (Ndogo au sawa).

### Mantiki (Logic):
- \`&&\` (**Na**): Kweli kama zote ni kweli.
- \`||\` (**Au**): Kweli kama angalau moja ni kweli.
- \`!\` (**Siyo**): Inageuza \`kweli\` kuwa \`sikweli\`.

### Mfano:
\`\`\`s
andika(10 > 5)          // kweli
andika(5 == 5 && 2 > 3) // sikweli (kwa sababu 2 si zaidi ya 3)
andika(5 == 5 || 2 > 3) // kweli (kwa sababu upande mmoja ni kweli)
\`\`\`
`,
				en: `When you want to compare values, you use these operators:

### Comparison Operators:
- \`==\` (Equal), \`!=\` (Not equal), \`>\` (Greater), \`<\` (Less), \`>=\` (Greater or equal), \`<=\` (Less or equal).

### Logic Operators:
- \`&&\` (**And**): True if both are true.
- \`||\` (**Or**): True if at least one is true.
- \`!\` (**Not**): Inverts \`kweli\` to \`sikweli\`.

### Example:
\`\`\`s
andika(10 > 5)          // true
andika(5 == 5 && 2 > 3) // false (because 2 is not more than 3)
andika(5 == 5 || 2 > 3) // true (because one side is true)
\`\`\`
`,
			},
			task: {
				sw: "Linganisha kama `50` ni kubwa kuliko `20` **NA** `10` ni sawa na `10`.",
				en: "Compare if `50` is greater than `20` **AND** `10` is equal to `10`.",
			},
			initialCode: `andika(50 > 20 && 10 == 10)`,
			solution: `andika(50 > 20 && 10 == 10)`,
		},
		{
			id: "kama",
			title: {
				sw: "7. Maamuzi (kama/au kama/sivyo)",
				en: "7. Conditionals (kama/else if/sivyo)",
			},
			description: {
				sw: `Programu inaweza kufanya maamuzi kulingana na hali fulani kwa kutumia \`kama\`.

### Muundo:
\`\`\`s
kama (hali) {
    // fanya hapa ikiwa hali ni kweli
} au kama (hali_nyingine) {
    // fanya ikiwa hali ya kwanza ni sikweli na hii ni kweli
} sivyo {
    // fanya ikiwa zote hapo juu ni sikweli
}
\`\`\`

### Mfano:
\`\`\`s
saatisa = 14
kama (saatisa < 12) {
    andika("Habari ya asubuhi")
} au kama (saatisa < 18) {
    andika("Habari ya mchana")
} sivyo {
    andika("Habari ya jioni")
}
\`\`\`
`,
				en: `A program can make decisions based on certain conditions using \`kama\`.

### Structure:
\`\`\`s
kama (condition) {
    // do this if condition is true
} au kama (other_condition) {
    // do this if first condition is false and this one is true
} sivyo {
    // do this if all above are false
}
\`\`\`

### Example:
\`\`\`s
time = 14
kama (time < 12) {
    andika("Good morning")
} au kama (time < 18) {
    andika("Good afternoon")
} sivyo {
    andika("Good evening")
}
\`\`\`
`,
			},
			task: {
				sw: "Badili `alama = 40` na uone kama programu itakuambia \"Ufeli\".",
				en: "Change `alama = 40` and see if the program tells you \"You failed\".",
			},
			initialCode: `alama = 85\nkama (alama >= 50) {\n    andika("Umefaulu!")\n} sivyo {\n    andika("Ufeli, jaribu tena.")\n}`,
			solution: `alama = 40\nkama (alama >= 50) {\n    andika("Umefaulu!")\n} sivyo {\n    andika("Ufeli, jaribu tena.")\n}`,
		},
		{
			id: "jaza",
			title: {
				sw: "8. Kupata Ingizo (Input)",
				en: "8. Getting Input (jaza)",
			},
			description: {
				sw: `Kitendakazi cha \`jaza()\` kinakuwezesha kupata taarifa kutoka kwa mtumiaji. Kompyuta itasimama na kusubiri mpaka mtumiaji aandike kitu.

**Muhimu**: Thamani inayorudishwa na \`jaza()\` kila mara ni **Tungo** (maandishi).

### Mfano:
\`\`\`s
fanya jina = jaza("Unaitwa nani? ")
andika("Karibu sana,", jina)
\`\`\`

Ikiwa unataka namba, itabidi uibadilishe (tutajifunza hili baadaye).`,
				en: `The \`jaza()\` function allows you to get information from the user. The computer will pause and wait until the user types something.

**Important**: The value returned by \`jaza()\` is always a **String** (text).

### Example:
\`\`\`s
fanya name = jaza("What is your name? ")
andika("Welcome,", name)
\`\`\`

If you want a number, you will have to convert it (we'll learn this later).`,
			},
			task: {
				sw: "Tumia `jaza()` kuuliza mtumiaji chakula anachopenda, kisha kichapishe.",
				en: "Use `jaza()` to ask the user for their favorite food, then print it.",
			},
			initialCode: `chakula = jaza("Unapenda kula nini? ")\nandika("Wow, nami napenda " + chakula)`,
			solution: `chakula = jaza("Wali"); andika(chakula)`,
		},
		{
			id: "safu",
			title: {
				sw: "9. Orodha (Safu)",
				en: "9. Lists (Arrays)",
			},
			description: {
				sw: `Safu ni mkusanyiko wa vitu vingi katika sanduku moja. Vitu hivi huwekwa ndani ya mabano mraba \`[ ]\`.

### Mambo ya Muhimu:
- Nafasi ya kwanza ni **0**.
- Nafasi ya pili ni **1**, na kuendelea.
- \`idadi()\` inakupa idadi ya vitu.
- \`sukuma(kitu)\` inaongeza kitu mwishoni.

### Mfano:
\`\`\`s
fanya wanafunzi = ["Juma", "Asha"]
wanafunzi.sukuma("Baraka")
andika(wanafunzi[0])      // Juma
andika(wanafunzi.idadi()) // 3
\`\`\`
`,
				en: `An array is a collection of many things in a single box. These things are placed inside square brackets \`[ ]\`.

### Key Facts:
- The first position is **0**.
- The second position is **1**, and so on.
- \`idadi()\` gives you the number of items.
- \`sukuma(item)\` adds an item to the end.

### Example:
\`\`\`s
fanya students = ["Juma", "Asha"]
students.sukuma("Baraka")
andika(students[0])      // Juma
andika(students.idadi()) // 3
\`\`\`
`,
			},
			task: {
				sw: "Tengeneza safu ya `rangi` yenye \"nyekundu\" na \"kijani\", ongeza \"bluu\" ukitumia `sukuma`, kisha andika idadi ya rangi.",
				en: "Create an array of `colors` with \"red\" and \"green\", add \"blue\" using `sukuma`, then print the number of colors.",
			},
			initialCode: `rangi = ["nyekundu", "kijani"]\nrangi.sukuma("bluu")\nandika(rangi.idadi())`,
			solution: `rangi = ["nyekundu", "kijani"]\nrangi.sukuma("bluu")\nandika(rangi.idadi())`,
		},
		{
			id: "kwa",
			title: {
				sw: "10. Vitanzi vya Kwa (Loops)",
				en: "10. Kwa Loops",
			},
			description: {
				sw: `Vitanzi vinatumiwa kurudia jambo mara nyingi. Neno \`kwa\` linatusaidia kupita kwenye kila kitu katika safu au tungo.

### Kupita kwenye Safu:
\`\`\`s
matunda = ["Embe", "Papai", "Nanasi"]
kwa t ktk matunda {
    andika("Napenda", t)
}
\`\`\`

### Kutumia mfululizo():
\`\`\`s
kwa i katika mfululizo(1, 6) {
    andika("Namba:", i) // Itachapisha 1, 2, 3, 4, 5
}
\`\`\`
`,
				en: `Loops are used to repeat an action many times. The word \`kwa\` helps us iterate through everything in an array or string.

### Iterating through an Array:
\`\`\`s
fruits = ["Mango", "Papaya", "Pineapple"]
kwa f ktk fruits {
    andika("I like", f)
}
\`\`\`

### Using mfululizo():
\`\`\`s
kwa i katika mfululizo(1, 6) {
    andika("Number:", i) // Prints 1, 2, 3, 4, 5
}
\`\`\`
`,
			},
			task: {
				sw: "Andika kitanzi kinachochapisha namba kutoka 0 mpaka 4 ukitumia `mfululizo(5)`.",
				en: "Write a loop that prints numbers from 0 to 4 using `mfululizo(5)`.",
			},
			initialCode: `kwa i katika mfululizo(5) {\n    andika(i)\n}`,
			solution: `kwa i katika mfululizo(5) {\n    andika(i)\n}`,
		},
		{
			id: "wakati",
			title: {
				sw: "11. Vitanzi vya Wakati (While)",
				en: "11. While Loops (wakati)",
			},
			description: {
				sw: `Kitanzi cha \`wakati\` kinaendelea kurudia mradi tu hali fulani iwe kweli.

**Onyo**: Hakikisha hali hiyo itakuja kuwa sikweli wakati fulani, vinginevyo programu itajirudia milele!

### Mfano:
\`\`\`s
fanya hesabu = 1
wakati (hesabu <= 3) {
    andika("Hesabu ni:", hesabu)
    hesabu = hesabu + 1
}
\`\`\`
`,
				en: `A \`wakati\` loop continues to repeat as long as a certain condition is true.

**Warning**: Make sure that condition will eventually become false, otherwise the program will loop forever!

### Example:
\`\`\`s
fanya count = 1
wakati (count <= 3) {
    andika("Count is:", count)
    count = count + 1
}
\`\`\`
`,
			},
			task: {
				sw: "Andika kitanzi cha `wakati` kinachoanza na `n = 5` na kupungua mpaka `1` (n = n - 1).",
				en: "Write a `wakati` loop that starts with `n = 5` and decreases down to `1` (n = n - 1).",
			},
			initialCode: `n = 5\nwakati (n > 0) {\n    andika(n)\n    n = n - 1\n}`,
			solution: `n = 5\nwakati (n > 0) {\n    andika(n)\n    n = n - 1\n}`,
		},
		{
			id: "badili-aina",
			title: {
				sw: "12. Kubadili Aina ya Data",
				en: "12. Type Conversion",
			},
			description: {
				sw: `Kama unakumbuka, \`jaza()\` inatoa maandishi. Kama unataka kufanya hesabu na ingizo hilo, lazima ulibadilishe kuwa namba.

### Visaidia-kazi vya Kubadili:
- \`namba(kitu)\`: Hugeuza kuwa namba nzima.
- \`tungo(kitu)\`: Hugeuza kuwa maandishi.

### Mfano:
\`\`\`s
fanya ingizo = jaza("Weka namba: ") // "10"
fanya x = namba(ingizo)            // 10 (sasa ni namba)
andika(x + 5)                      // 15
\`\`\`
`,
				en: `As you remember, \`jaza()\` returns text. If you want to do math with that input, you must convert it to a number.

### Conversion Helpers:
- \`namba(thing)\`: Converts to an integer.
- \`tungo(thing)\`: Converts to a string.

### Example:
\`\`\`s
fanya input = jaza("Enter a number: ") // "10"
fanya x = namba(input)                 // 10 (now it's a number)
andika(x + 5)                          // 15
\`\`\`
`,
			},
			task: {
				sw: "Chukua namba kutoka kwa mtumiaji, iongezee 10 na uonyeshe tokeo.",
				en: "Take a number from the user, add 10 to it, and display the result.",
			},
			initialCode: `n = jaza("Weka namba: ")\nandika(namba(n) + 10)`,
			solution: `n = jaza("10"); andika(namba(n) + 10)`,
		},
		{
			id: "unda",
			title: {
				sw: "13. Vitendakazi (Functions)",
				en: "13. Functions",
			},
			description: {
				sw: `Vitendakazi ni mapande ya msimbo unayoweza kuyaita wakati wowote. Tunatumia neno \`unda\` kutengeneza kitendakazi.

### Kwa nini tutumie vitendakazi?
1. Kurahisisha kazi inayojirudia.
2. Kufanya msimbo uwe nadhifu.

### Mfano:
\`\`\`s
fanya mraba = unda(n) {
    rudisha n * n
}

andika(mraba(5)) // 25
andika(mraba(10)) // 100
\`\`\`
`,
				en: `Functions are pieces of code that you can call at any time. We use the word \`unda\` to create a function.

### Why use functions?
1. To simplify repetitive tasks.
2. To make code cleaner.

### Example:
\`\`\`s
fanya square = unda(n) {
    rudisha n * n
}

andika(square(5))  // 25
andika(square(10)) // 100
\`\`\`
`,
			},
			task: {
				sw: "Tengeneza kitendakazi `jumla` kinachochukua `a` na `b` na kurudisha jumla yao.",
				en: "Create a function `jumla` that takes `a` and `b` and returns their sum.",
			},
			initialCode: `jumla = unda(a, b) {\n    rudisha a + b\n}\n\nandika(jumla(5, 7))`,
			solution: `jumla = unda(a, b) {\n    rudisha a + b\n}\n\nandika(jumla(5, 7))`,
		},
		{
			id: "hitimisho",
			title: {
				sw: "14. Hongera!",
				en: "14. Congratulations!",
			},
			description: {
				sw: `Umemaliza mafunzo ya misingi ya Nuru! Sasa unaweza:
- Kuandika na kutoa taarifa.
- Kutumia vibadilika na kufanya hisabati.
- Kufanya maamuzi na kutumia vitanzi.
- Kutengeneza vitendakazi vyako.

### Nini kinafuata?
Jaribu kuandika programu zako mwenyewe! Unaweza kujaribu kutengeneza:
1. Kikokotoo rahisi.
2. Mchezo wa kukisia namba.
3. Programu ya kusimamia orodha ya kazi (To-do list).

Asante kwa kuanza safari yako ya teknolojia na Nuru!`,
				en: `You have completed the Nuru basics tutorial! Now you can:
- Write and display information.
- Use variables and do math.
- Make decisions and use loops.
- Create your own functions.

### What's next?
Try writing your own programs! You could try building:
1. A simple calculator.
2. A number guessing game.
3. A to-do list manager.

Thank you for starting your tech journey with Nuru!`,
			},
			task: {
				sw: "Andika programu yoyote unayotaka hapa kama sherehe ya kuhitimu kwako!",
				en: "Write any program you want here as a celebration of your graduation!",
			},
			initialCode: `// Hongera sana mwanateknolojia!\nandika("Nimefanikiwa!")`,
			solution: `andika("Hongera!")`,
		},
	],
};
