## Structure
### 1. Applications (`/apps`)

- **`apps/playground`**: The public-facing learning app. It uses `localStorage` (via the `AnzaClient` component) to persist user code. It consumes data primarily via direct server-side Drizzle queries in `lib/lessons.server.ts`.
- **`apps/dashboard`**: The educator portal. It relies on **Logto** for layout-level route protection (`getLogtoContext`). All data mutations (create/update/delete modules and lessons) are handled via **Next.js Server Actions** located in `app/actions/`.

### 2. UI & Styling (`packages/ui`)
We use Tailwind CSS v4 and Radix UI. typical shadcn/ui in a monorepo setup.

### 3. Data Layer (`packages/db`)
Our database is managed centrally via **Drizzle ORM** connected to **Neon Postgres**.
- **Bilingual Schema**: Content localization is handled at the database level. Text fields (like lesson titles and descriptions) use a custom `jsonb` type structure: `{ en: string; sw: string; }`.
- **Migrations**: Always generate migrations via `pnpm db:generate` in the `packages/db` directory if you modify `schema.ts`. 

> [!WARNING]
> Only use `pnpm db:push` for local rapid prototyping.

### 4. WASM Execution Engine (`packages/wasm`)
The Nuru interpreter is written in Go and compiled to WASM.
- **The JS Bridge**: The `index.ts` file acts as the bridge. Code is executed synchronously. Standard Go output (`stdout`/`stderr`) is intercepted by a global JS callback (`nuruOutputReceiver`) and explicitly sanitized to prevent XSS.
- **Execution Safeguards**: Because WASM runs on the main thread, the Go engine employs an execution limit (e.g., `MAX_ITERATIONS` in `while.go` is capped at 1,000,000) to prevent infinite loops from freezing the browser.
- **TinyGo**: Ensure your Go code compiles with TinyGo, as it is used for production builds. Avoid reflection or heavy standard libraries that TinyGo does not fully support.

## Pull Request Workflow

1. Branch from `staging` (`feature/name` or `fix/name`).
2. Adhere strictly to the TypeScript and Go type systems. Do not use `any` or disable warnings.
3. Ensure any Server Action changes are properly permission-checked against Logto roles.
