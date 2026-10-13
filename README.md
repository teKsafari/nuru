![Nuru](./mawio.jpeg)

# Nuru

**Lugha ya kwanza ya kiprogramu ya Kiswahili, kwenye kivinjari chochote.**
The first Swahili programming language, running in any browser.

teKsafari describes Nuru as the language that "changes where the learner starts. It removes the translation layer between thought and expression." This repository is the platform that carries that promise from a single phone to a whole classroom:

- **Masomo**: 66 guided lessons in 8 modules, every one auto-graded. Each reference solution is executed against its tests on every check.
- **Uwanja**: a free playground with an interactive terminal (`jaza()` really waits for you), a **Kobe** turtle-graphics canvas and an **Ubao** virtual electronics board. Programs share as a link, ready for WhatsApp.
- **Kamusi**: a Swahili-first language reference. Every example is runnable and verified.
- **Darasa**: classrooms for shared devices. A teacher opens a class and gets a join code. Learners sign in with code, name and a picture password, no email needed. The teacher watches a live progress grid.
- **Chumba cha Walimu**: the teachers' dashboard. It holds classes, a bilingual lesson editor, and in-browser verification of lessons.

Swahili is the default everywhere. English is a translation.

Read [docs/MAONO.md](./docs/MAONO.md) for the product vision and [docs/KANGA.md](./docs/KANGA.md) for the design language.

## Layout

| Path | What it is |
|---|---|
| `apps/playground` | Learner app (Next.js 15): landing page, lessons, Uwanja, Kamusi, Darasa, API routes. |
| `apps/dashboard` | Teachers' app (Next.js 15): modules, lesson editor, madarasa. |
| `packages/wasm` | `@nuru/wasm`, the interpreter. `core/Nuru` (upstream submodule, untouched), `web/` (Go entrypoint adding the `kobe` and `ubao` modules), `worker/` (TinyGo build + Web Worker host), `runtime.ts` (browser client), `node/` (Node runner for tests and tools). |
| `packages/ui` | `@nuru/ui`: Kanga tokens (`kanga.css`), components, the Nuru editor grammar with Swahili autocomplete, and the shared lesson grader. |
| `packages/db` | `@nuru/db`: Drizzle schema and migrations (Neon in production, any Postgres locally). |
| `packages/mtaala` | `@nuru/mtaala`: the curriculum as Markdown, plus `hakiki` (verify) and `seed`. |

## Quick start

```bash
pnpm install
docker run -d --name nuru-pg -p 5432:5432 -e POSTGRES_PASSWORD=dev -e POSTGRES_DB=nuru postgres:17
export DATABASE_URL=postgres://postgres:dev@localhost:5432/nuru   # also put it in apps/*/.env.local
pnpm --filter @nuru/db db:migrate
pnpm --filter @nuru/mtaala seed
pnpm dev
```

Set `NURU_DEV_AUTH=1` in `apps/dashboard/.env.local` to sign in to the dashboard locally as a fake teacher, because Logto cannot redirect to a dev machine. The bypass is ignored in production builds.

More detail: [contributing/getting-started.md](./contributing/getting-started.md).

## Checks

```bash
pnpm --filter @nuru/wasm test        # interpreter runtime: jaza, kobe, ubao, timeouts
pnpm --filter @nuru/mtaala hakiki    # every lesson: solution passes, starter code does not
```

---

*Imeundwa na [teKsafari](https://teksafari.org). Nuru lugha: [NuruProgramming](https://github.com/NuruProgramming).*
