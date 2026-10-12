# Maono: what Nuru is and what this platform delivers

## What teKsafari says Nuru is

- "Nuru: the first-ever Turing-complete programming language in Swahili."
- "Nuru changes where the learner starts. It removes the translation layer between thought and expression."
- The commitment: "scale Nuru into more classrooms and training programs, from kindergarten to bibi's house."
- The roadmap: "simulation-first playgrounds" and "a hardware/electronics extension."
- The audience: young East Africans, Tanzania first. Swahili is the language of instruction through primary school, and English is often a third language. Most students share a device.

## What the platform delivers

| Promise | Delivery |
|---|---|
| Remove the translation layer | Swahili-first UI and default locale. Swahili error messages. Swahili autocomplete with in-editor docs. A Swahili language reference (**Kamusi**). |
| Zero install, any device | Nuru compiled to WebAssembly (1.5MB with TinyGo) and run in a Web Worker. Works on low-end Android. Cached for offline use. |
| Real programs, not toys | Interactive `jaza()` in the terminal. A Stop button for runaway loops. Programs share as a link with no server round-trip. |
| Simulation-first | **`tumia kobe`**: turtle graphics on a canvas. **`tumia ubao`**: a virtual electronics board with 8 LEDs, a buzzer and an LCD. This is the bridge to teKsafari's hardware kits. |
| Classrooms | **Darasa**: a teacher opens a class and gets a join code. Learners join with code, name and a picture password, with no email (built for shared devices). The teacher sees a live progress grid. |
| A curriculum that stays correct | **Mtaala** lives as Markdown in `packages/mtaala`. Every reference solution is executed against its tests on every check (`pnpm --filter @nuru/mtaala hakiki`). |

## Surfaces (playground app, `/[lang]/...`)

| Route | Name | What it is |
|---|---|---|
| `/` | Tovuti | landing page |
| `/anza/[module]/[lesson]` | Masomo | guided lessons with tests |
| `/masomo` | Ramani | curriculum map |
| `/uwanja` | Uwanja | free playground: terminal, kobe canvas, ubao board; share links |
| `/kamusi` | Kamusi | language reference with runnable examples |
| `/darasa` | Darasa | join a class; a learner's class home |

The dashboard app, the teachers' room (*Chumba cha Walimu*), adds `/educator/madarasa` for classes and progress, next to the existing module and lesson editor.
