# @nuru/wasm

A WebAssembly (Wasm) interpreter for [Nuru](https://github.com/NuruProgramming/Nuru), a Swahili-based programming language. This package compiles the Go-based Nuru interpreter to WebAssembly and ships a TypeScript wrapper, so Nuru code can run in the browser. It is used by the [Nuru Playground](https://github.com/Heracraft/nuru-playground).

## Overview

The interpreter is [NuruProgramming/Nuru](https://github.com/NuruProgramming/Nuru) — that is the canonical upstream project and where you should file issues or read the language docs.

This package builds Nuru to WebAssembly. The browser entry point (`main_wasm.go`) and WASM-specific built-ins (`builtins_wasm.go`, guarded by a `//go:build wasm && js` tag) redirect interpreter output through a JavaScript callback and read `stdin` from a buffer supplied by JS. That WASM code was upstreamed into Nuru long ago.

> **Submodule note:** the `core/Nuru` submodule currently points to the [`Heracraft/Nuru`](https://github.com/Heracraft/Nuru) fork rather than upstream. This is a temporary arrangement to allow rapid iteration; **all changes made to the fork are meant to be upstreamed to [NuruProgramming/Nuru](https://github.com/NuruProgramming/Nuru)**, after which the submodule can point back at upstream.

The package exposes a TypeScript API (and a React hook) that loads the compiled `.wasm` binary, registers an output receiver, and executes Nuru code.

## Features

- **In-browser execution**: Run Nuru code client-side without a backend server.
- **JavaScript interop**: API to send code to the interpreter and receive output via a callback.
- **`stdin` support**: Feed input to programs through a buffer of strings.
- **React hook**: A `useNuru` hook for React apps.

## Getting Started

Install from npm:

```bash
npm i @nuru/wasm
# or: pnpm add @nuru/wasm
```

```javascript
import init from '@nuru/wasm';

const nuru = await init({
    outputReceiver: (text, isError) => console.log(text),
});

nuru.execute('andika("Niadje")');
```

By default the WASM binary is fetched from jsDelivr. See [Usage](#usage) for the full API, `stdin` support, self-hosting the binary, and the React hook.

The sections below (Prerequisites onward) cover building and developing this package itself.

## Prerequisites

To build and develop this package you need:

- **Go** — for the local-dev WASM build (`go build`). Use the version declared in `core/Nuru/go.mod`.
- **TinyGo** — for the production binary (`tinygo build`). Development is currently on `0.40.x`.
- **[air](https://github.com/air-verse/air)** — for the dev rebuild loop (`go install github.com/air-verse/air@latest`).
- **Node.js** — version 22 (see the repo root `engines`).
- **pnpm** — package manager.

```shell
# Install pnpm if not already installed
npm install -g pnpm
```

## Installation & Setup

> **Note:** This package is part of a monorepo managed by [Turborepo](https://turbo.build/). Prefer running tasks with `turbo run <task> --filter=@nuru/wasm` from the repo root so caching and cross-package dependencies are handled correctly.

1. **Check out the interpreter submodule.** Clone the monorepo with submodules, or initialize it after the fact:

   ```bash
   git submodule update --init --recursive
   ```

   This populates `packages/wasm/core/Nuru` from the `Heracraft/Nuru` fork (see the submodule note in [Overview](#overview)).

2. **Install Node dependencies** (from the repo root):

   ```bash
   pnpm install
   ```

To pull the latest interpreter changes from the submodule's remote later:

```bash
git -C packages/wasm/core/Nuru pull origin main
# then commit the updated submodule pointer, and rebuild main.wasm (see below)
```

## Building the WASM Binary

**Production binary (TinyGo):**

```bash
pnpm run build:wasm
# = cd core/Nuru && GOOS=js GOARCH=wasm tinygo build -o ../../main.wasm
```

**TypeScript wrapper:**

```bash
pnpm run build      # tsc -> dist/
```

`prepublishOnly` runs both (`build:wasm` then `build`) so a published package ships a rebuilt binary.

### Two binaries: `main_go.wasm` (dev) vs `main.wasm` (prod)

This package keeps two WASM outputs, distinguished by toolchain:

| File | Toolchain | Size | Tracked in git? | Used by |
| --- | --- | --- | --- | --- |
| `main_go.wasm` | **Go** (`go build`) | ~11 MB | **No** — gitignored | local dev (rebuild loop via `air`) |
| `main.wasm` | **TinyGo** (`tinygo build`) | ~3.5 MB | **Yes** — committed | production / published package |

Why the split:

- **Dev uses Go** because it compiles faster, which suits `air`'s rebuild loop (`dev:wasm` builds `main_go.wasm`). Its output is **gitignored** so a dev-only binary can't be committed and shipped.
- **Prod uses TinyGo** for a smaller download. `main.wasm` is the only committed binary, and by convention it is always the TinyGo build.

Since `main_go.wasm` is never committed, deploys can only pick up the TinyGo `main.wasm`. That keeps the wrong type of binary out of production.

> ⚠️ **Caveat — staleness is not enforced.** The convention prevents the *wrong kind* of binary from shipping, but nothing forces the committed `main.wasm` to be *rebuilt* after a change to the `core/Nuru` submodule or the `wasm_exec_*.js` shims. After such a change, remember to run `pnpm run build:wasm` and commit the refreshed `main.wasm`.

#### Dev server fallback

`scripts/serve.js` (run via `dev:serve`) serves the dev binary at `/main.wasm`:

1. It first looks for `main_go.wasm` and serves that.
2. If `main_go.wasm` is missing, it logs a notice and falls back to the committed TinyGo `main.wasm`.

So in local development you get the Go build when it exists, and the production binary otherwise. The matching JS runtime shim is selected through the `#wasm_exec` import map (`development → wasm_exec_go.js`, `default → wasm_exec_tinygo.js`).

## Usage

This package exports a TypeScript wrapper that handles WASM initialization and execution.

### Installation

From npm:

```bash
npm i @nuru/wasm
```

Within this monorepo, depend on the workspace version instead:

```json
{
  "dependencies": {
    "@nuru/wasm": "workspace:*"
  }
}
```

### JavaScript API

#### `init(config): Promise<NuruInstance>`

Initializes the Nuru interpreter: registers the output receiver, fetches the WASM binary, and starts the Go runtime.

- **`config`** (object):
  - `outputReceiver` (function, **required**): Callback for interpreter output — `(text: string, isError: boolean) => void`.
  - `xssProtection` (boolean, optional): Sanitize output with `xss` before handing it to `outputReceiver`. Default `true`.
  - `version` (string, optional): Version of the published binary to load from the CDN. Default `"latest"`.
  - `wasmURL` (string, optional): Explicit URL to load the binary from. Overrides `version`.

> **Where the binary comes from:** by default `init` fetches `https://cdn.jsdelivr.net/npm/@nuru/wasm@<version>/main.wasm`. To use a self-hosted/local binary instead (e.g. a copy served from your app's `public/` at `/main.wasm`), pass `wasmURL: "/main.wasm"`.

#### `NuruInstance`

The object returned by `init`:

- `config`: The resolved configuration.
- `initialized`: Boolean indicating whether the WASM runtime is ready.
- `execute(code: string, stdinBuffer?: string[])`: Executes Nuru code. Pass `stdinBuffer` (an array of strings) for programs that read input.

### Example

```javascript
import init from '@nuru/wasm';

// 1. Initialize the interpreter (loads the binary from the CDN by default)
const nuru = await init({
    outputReceiver: (text, isError) => {
        if (isError) {
            console.error("Nuru Error:", text);
        } else {
            console.log("Nuru Output:", text);
        }
    },
    // wasmURL: "/main.wasm", // <- to load a self-hosted binary instead
});

// 2. Execute code
nuru.execute('andika("Hujambo Dunia!")');

// 3. Execute code that reads input
nuru.execute('jina = jaza("Jina lako? ")', ["Asha"]);
```

### React

A hook is published under the `@nuru/wasm/react` subpath. It calls `init` for you, handles unmount, and keeps the output receiver current across renders:

```tsx
import { useNuru } from '@nuru/wasm/react';

function Playground() {
    const nuru = useNuru(
        (output, isError) => { /* render output */ },
        { wasmURL: "/main.wasm" }, // optional: any InterpreterConfig except outputReceiver
    );

    return (
        <button
            disabled={!nuru.initialized}
            onClick={() => nuru.execute('andika("Habari!")')}
        >
            Run
        </button>
    );
}
```

Before the binary finishes loading, `useNuru` returns a placeholder instance with `initialized: false`, so guard interactions on `nuru.initialized`.

## Scripts

Prefer running these via `turbo` from the repo root (e.g. `turbo run build --filter=@nuru/wasm`); the raw `pnpm` scripts also work but bypass Turborepo caching and orchestration.

| Script | What it does |
| --- | --- |
| `build:wasm` | Build the production binary with TinyGo → `main.wasm`. |
| `build` | Compile the TypeScript wrapper with `tsc` → `dist/`. |
| `dev` | Run `dev:wasm`, `dev:ts`, and `dev:serve` together (via turbo). |
| `dev:wasm` | `air` watch loop: rebuild `main_go.wasm` with full Go on change. |
| `dev:ts` | `tsc --watch` for the wrapper. |
| `dev:serve` | Serve the dev binary at `http://localhost:7070/main.wasm` (`scripts/serve.js`). |
| `test` | Placeholder test (mock). |

## Contributing

Contributions are welcome. The interpreter itself is [NuruProgramming/Nuru](https://github.com/NuruProgramming/Nuru):

- Interpreter changes (including the browser-specific `main_wasm.go` / `builtins_wasm.go` behind the `wasm && js` build tag) belong upstream in NuruProgramming/Nuru. The `core/Nuru` submodule points at the `Heracraft/Nuru` fork only as a temporary staging point for rapid iteration — **upstream your changes** so the submodule can eventually track upstream directly.
- After updating the `core/Nuru` submodule pointer (or the `wasm_exec_*.js` shims), **rebuild and commit `main.wasm`** with `pnpm run build:wasm` so production picks up your changes.
- When changing the TypeScript wrapper, run `pnpm run build` and verify `dist/` output.
