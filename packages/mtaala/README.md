# Mtaala wa Nuru

[Kiswahili](#kiswahili) | [English](#english)

## Kiswahili

Mtaala wa Nuru ni masomo yote ya jukwaa, yaliyoandikwa kama faili za Markdown. Kila suluhisho la mfano linaendeshwa kwenye mfasiri halisi wa Nuru (wasm) kabla ya kuingia kwenye hifadhidata.

### Mpangilio wa faili

```text
moduli/
  01-misingi-ya-nuru/
    index.md          maelezo ya moduli
    sw/01-karibu.md   somo kwa Kiswahili (chanzo cha kodi na majaribio)
    en/01-karibu.md   tafsiri ya Kiingereza (kichwa, kazi na maelezo tu)
```

- Namba iliyo mbele ya jina (`01-`) inapanga moduli na masomo. Jina linalofuata ndilo **slug**. Usibadilishe slug ya somo lililopo: maendeleo ya wanafunzi yamehifadhiwa kwa slug.
- Kubadili mpangilio, badilisha namba tu.

### index.md ya moduli

```yaml
---
difficulty: "mwanzilishi"   # mwanzilishi | wa kati | wa juu
title:
  sw: "Sanaa ya Kobe"
  en: "Art with Kobe"
description:                # si lazima
  sw: "..."
  en: "..."
layout:                     # si lazima
  renderer:
    type: "kobe"            # kobe au ubao
---
```

### Faili la somo (sw/)

```yaml
---
title: "Mraba"
task: "Chora mraba wenye pande za hatua `120`..."
initialCode: |
  tumia kobe
solution: |
  tumia kobe
  kwa i ktk mfululizo(4) {
      kobe.mbele(120)
      kobe.kushoto(90)
  }
stdin: "500"               # si lazima: majibu ya jaza(), mstari mmoja kwa kila jibu
tests:                     # si lazima
  - type: match_code
    pattern: 'kwa\s+\w+\s+ktk'
    message: "Tumia kitanzi cha kwa."
  - type: kobe_picha
    message: "Mraba wako haufanani na unaotakiwa."
---
Maelezo ya somo kwa Markdown.
```

Ndani ya maelezo, tumia ` ```nuru ` kwa mifano ya kodi, na `+++hivi+++` kuangazia sehemu muhimu. Kila mfano una kitufe cha kuufungua kwenye Uwanja.

Faili la `en/` lina `title`, `task` na maelezo tu. Kodi, majibu na majaribio yanatoka kwenye faili la Kiswahili.

### Aina za majaribio

| Aina | Inakagua nini |
|---|---|
| `io` | Programu ikipewa `input` (majibu ya `jaza()`, mstari kwa jibu), matokeo yalingane na `expectedOutput` |
| `exact_output` | Matokeo ya `andika()` yalingane kabisa na `expectedOutput` |
| `match_output` | Matokeo yalingane na regex `pattern` (na `flags`) |
| `match_code` | Kodi ya mwanafunzi ilingane na regex `pattern` |
| `kobe_picha` | Mchoro wa kobe ufunike visanduku vilevile kama mchoro wa suluhisho. Njia yoyote inayochora picha ileile inapita |
| `ubao_mfuatano` | Taa za ubao ziwake na kuzima kwa mfuatano uleule kama suluhisho |

- Kila jaribio linahitaji `message` ya Kiswahili. Mwanafunzi akibonyeza **Dokezo**, anaona ujumbe wa jaribio la kwanza lililoshindwa, hivyo panga majaribio kwa mpangilio wa umuhimu.
- Kwa `kobe_picha`, `ubao_mfuatano`, `exact_output` na `io`, unaweza kuacha `expectedOutput`. Inajazwa kutoka kwa kile suluhisho linachofanya kweli.
- Somo lisilo na `tests` kabisa linapata majaribio yanayotengenezwa kutoka kwa suluhisho: `kobe_picha` kama linachora, `ubao_mfuatano` kama linawasha taa, na `io` (kama kuna `stdin`) au `exact_output` kama linaandika.
- Weka `ubao.subiri()` chini ya milisekunde 200 kwa kila hatua, na programu nzima chini ya sekunde 3.

### Kuhakiki na kupanda

```bash
cd packages/mtaala
pnpm exec tsx scripts/hakiki.ts                 # masomo yote
pnpm exec tsx scripts/hakiki.ts sanaa-ya-kobe   # moduli moja

DATABASE_URL=postgres://postgres:dev@localhost:5432/nuru pnpm exec tsx scripts/seed.ts
```

`hakiki` inakagua kwa kila somo kwamba:

- suluhisho linapita majaribio yote, bila kosa, ndani ya sekunde 4;
- kodi ya mwanzo **haipiti** majaribio;
- somo lina kazi, suluhisho, majaribio na faili la Kiingereza;
- mchoro au mfuatano wa taa wa suluhisho si mtupu.

`seed` inaingiza au kusasisha moduli na masomo. Utambulisho unatokana na slug, hivyo kupanda tena hakuvunji maendeleo ya wanafunzi. Somo lililoondolewa kwenye Markdown linaondolewa kwenye moduli yake pia.

## English

The Nuru curriculum: every lesson on the platform, written as Markdown. Each reference solution runs on the real Nuru interpreter (wasm) before it reaches the database.

### File layout

```text
moduli/
  01-misingi-ya-nuru/
    index.md          module metadata
    sw/01-karibu.md   Swahili lesson (source of truth for code and tests)
    en/01-karibu.md   English translation (title, task and body only)
```

- The number prefix (`01-`) orders modules and lessons. The name after it is the **slug**. Never rename the slug of an existing lesson: learner progress is keyed by slug.
- To reorder, change the number only.

### Module index.md

`difficulty` is `mwanzilishi`, `wa kati` or `wa juu`. `title` and the optional `description` take `sw` and `en`. The optional `layout.renderer.type` (`kobe` or `ubao`) opens the turtle canvas or the light board next to the editor. See the Swahili section for a full example.

### Lesson file (sw/)

Frontmatter fields: `title`, `task`, `initialCode`, `solution`, optional `stdin` (answers fed to `jaza()`, one per line, used when tests are generated) and optional `tests`. The body is Markdown. Use ` ```nuru ` for code examples and `+++like this+++` to highlight the part that matters. Every example gets a button that opens it in the playground (Uwanja).

The `en/` file holds only `title`, `task` and the body. Code, solutions and tests always come from the Swahili file. Keep Nuru keywords and identifiers in Swahili in both.

### Test types

| Type | Checks |
|---|---|
| `io` | Given `input` (answers to `jaza()`, one per line), stdout equals `expectedOutput` |
| `exact_output` | stdout equals `expectedOutput` |
| `match_output` | stdout matches the regex `pattern` (with `flags`) |
| `match_code` | the learner's source matches the regex `pattern` |
| `kobe_picha` | the turtle drawing covers the same grid cells as the reference drawing; any path that draws the same picture passes |
| `ubao_mfuatano` | the light board goes through the same sequence of LED states as the reference |

- Every test needs a Swahili `message`. The **Hint** button shows the message of the first failing test, so order tests by importance.
- For `kobe_picha`, `ubao_mfuatano`, `exact_output` and `io`, you may leave out `expectedOutput`. It is filled in from what the reference solution actually does.
- A lesson with no `tests` gets generated ones: `kobe_picha` if the solution draws, `ubao_mfuatano` if it switches LEDs, and `io` (with `stdin`) or `exact_output` if it prints.
- Keep `ubao.subiri()` at 200 ms or less per step, and the whole program under 3 seconds.

### Verify and seed

```bash
cd packages/mtaala
pnpm exec tsx scripts/hakiki.ts                 # every lesson
pnpm exec tsx scripts/hakiki.ts sanaa-ya-kobe   # one module

DATABASE_URL=postgres://postgres:dev@localhost:5432/nuru pnpm exec tsx scripts/seed.ts
```

For every lesson, `hakiki` checks that:

- the solution passes all tests, with no runtime error, within 4 seconds;
- the starter code does **not** pass;
- the lesson has a task, a solution, tests and an English file;
- a drawing or LED sequence produced by the solution is not empty.

`seed` upserts modules and lessons. Ids derive from slugs, so re-seeding never breaks learner progress. A lesson removed from the Markdown is removed from its module too.
