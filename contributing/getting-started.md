# Getting started

## Prerequisites

- **Node.js 22+** and **pnpm** (`corepack enable`).
- **Docker** for a local Postgres. Any Postgres 15+ works.
- Only to rebuild the interpreter: **TinyGo 0.39** and **Go 1.25**. The compiled `packages/wasm/worker/nuru.wasm` is committed, so app work does not need them.

## Setup

```bash
pnpm install
docker run -d --name nuru-pg -p 5432:5432 -e POSTGRES_PASSWORD=dev -e POSTGRES_DB=nuru postgres:17
```

Create `.env.local` in `apps/playground`, `apps/dashboard` and `packages/db`:

```bash
DATABASE_URL=postgres://postgres:dev@localhost:5432/nuru
NURU_DEV_AUTH=1   # dashboard and playground: fake signed-in teacher, dev builds only
```

`@nuru/db` uses Neon's HTTP driver when the URL points at `neon.tech` and `postgres-js` for everything else.

Apply migrations, then load the curriculum:

```bash
pnpm --filter @nuru/db db:migrate
pnpm --filter @nuru/mtaala seed
```

## Run

```bash
pnpm dev                                        # everything, through turbo + portless
pnpm --filter nuru-playground dev:plain         # playground only, http://localhost:3000
```

The playground copies the interpreter (`nuru-worker.js`, `wasm_exec.js`, `nuru.wasm`) into `public/nuru/` before `dev` and `build`. It serves every page with `Cross-Origin-Opener-Policy: same-origin` and `Cross-Origin-Embedder-Policy: credentialless`. That cross-origin isolation is what lets `jaza()` pause a running program and wait for the learner. Without it, the runtime falls back to re-running the program with the answers collected so far.

**Low-memory machines.** A Next.js dev server can take 4GB. On a small VM, prefer `next build && next start` (about 200MB) and run one app at a time.

## Rebuilding the interpreter

```bash
GOTOOLCHAIN=go1.25.8 go version                 # fetches Go 1.25 into the module cache
mkdir -p ~/.local/tinygo && curl -sL https://github.com/tinygo-org/tinygo/releases/download/v0.39.0/tinygo0.39.0.linux-amd64.tar.gz | tar xz -C ~/.local/tinygo
pnpm --filter @nuru/wasm build:wasm             # writes worker/nuru.wasm (~1.9MB)
pnpm --filter @nuru/wasm build && pnpm --filter @nuru/wasm test
```

`packages/wasm/core/Nuru` is the upstream interpreter, kept untouched as a submodule. Browser-only features live in `packages/wasm/web/`:

- the `kobe` turtle-graphics module;
- the `ubao` board module;
- a goroutine-based `runCode`, so `muda.lala` and `ubao.subiri` can sleep.

## Curriculum

See [packages/mtaala/README.md](../packages/mtaala/README.md). Before committing lesson changes, always run `pnpm --filter @nuru/mtaala hakiki`.
