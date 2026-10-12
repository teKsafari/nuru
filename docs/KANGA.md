# Kanga: the Nuru design language

Tokens and utilities live in `packages/ui/src/styles/kanga.css`. Both apps import it.

## Where it comes from

Two sources shaped it.

- **Dribbble research.** Neubrutalist learning products (for example "Shaytoon" by Viola Kazemi) pair an off-white paper ground with black 2px rules, hard offset shadows, flat saturated fills and mono labels. Kids read them fast, and they render crisply on cheap Android screens where soft gradients turn to mud.
- **The kanga cloth.** Every kanga printed in East Africa has three parts:
  - the **pindo**, a patterned border;
  - the **mji**, the central field;
  - the **jina**, a printed Swahili saying.

  Nuru screens use the same structure: patterned edges, one heavy-bordered field of focus, and a methali where the product speaks to the learner.

## Vocabulary

| Token / utility | Swahili | Use |
|---|---|---|
| `bg-karatasi` | paper | page ground (cream `#fff8e7`; ink in Usiku mode) |
| `text-wino` | ink | text, rules, shadows |
| `bg-jua` | sun | Nuru yellow `#ffc93c`. Primary action, highlights. One per view |
| `pilipili`, `bahari`, `mwani`, `zambarau`, `chungwa`, `udongo` | chili, ocean, seaweed, purple, orange, earth | category fills: errors, info, success, modules |
| `mji` | the central field | card: 2px ink border, 14px radius, 4px hard shadow |
| `bonyeza` | press | pressable surface: lifts on hover, sinks on press |
| `lebo` | label | mono uppercase sticker text: `HATUA 3 / 12` |
| `alama-jua` | sun mark | highlighter swipe behind a key word |
| `pindo` / `pindo-nukta` | border | kanga border band of triangles or dots, coloured with `text-*` |
| `gridi` | grid | graph-paper ground for canvases and empty states |
| `shadow-kivuli(-sm/-lg)` | shadow | hard offset shadow |

Modes are **Mchana** (day, default) and **Usiku** (night, `.dark`).

## Type

- **Bricolage Grotesque** (`font-display`): headings, the wordmark, big numbers.
- **Lexend** (`font-sans`): body. It was designed to reduce visual stress for new readers.
- **JetBrains Mono** (`font-mono`): code, `lebo` labels, the terminal.

## Rules

1. **Borders are ink and 2px.** Hairlines appear only inside dense tables.
2. **Shadows are hard and offset down-right.** No blur, no glow.
3. **One `jua` element per view** is the thing to do next: Endesha (run), Wasilisha (submit), Anza (start).
4. **Fills are flat.** Gradients only appear in the `alama-jua` highlighter.
5. **Swahili comes first.**
   - UI copy is written in Swahili, then translated, never the other way round.
   - Nuru keywords are never translated in code samples or UI labels.
   - Technical loanwords keep their Swahili form (`kitendakazi`, `kibadilika`, `orodha`).
6. **The methali is the voice.** Feedback moments carry a proverb:

   | Moment | Methali |
   |---|---|
   | Success | *Haba na haba hujaza kibaba* |
   | Failure | *Kuteleza si kuanguka* |
   | Empty state | *Safari ya maili elfu huanza na hatua moja* |

7. **Motion is short and physical** (100 to 150ms). Everything respects `prefers-reduced-motion`.
8. **Phones come first.** Targets are 44px or larger. Layouts must work at 360px wide, because most learners share an Android phone.
