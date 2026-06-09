# Getting Started with Nuru Monorepo

Welcome to the Nuru Monorepo! This guide details the setup and workflows for developing across our Next.js applications and Go-based WASM engine.

## Prerequisites

- **Node.js**: Version `^22.0.0` is strictly required for compatibility with Next.js 15.
- **pnpm**: Our package manager of choice (`npm install -g pnpm`).
- **Go**: Version `^1.19.0` for developing the core interpreter.
- **TinyGo**: Version `^0.27.0` is required for compiling the production-optimized WebAssembly binary.

## Local Setup & Development

1. **Clone and Install:**
   ```bash
   gh repo clone teKsafari/nuru
   cd nuru
   pnpm install
   ```

2. **Environment Variables:**
   You will need to set up local environment variables for Authentication (Logto) and the Database (Neon Postgres). 
   - Copy `apps/dashboard/.env.example` to `.env` (and do the same for `apps/playground` and `packages/db` if available).
   - Configure your `DATABASE_URL` for Drizzle and Logto OIDC variables.

3. **Database Setup:**
   We use Drizzle ORM with Neon Postgres. Before running the apps, ensure your schema is synced:
   ```bash
   # From the root, run the db package scripts
   pnpm --filter @nuru/db run db:push
   ```

5. **Start the Development Servers:**
   ```bash
   turbo run dev
   ```
   This command starts the Next.js apps (`playground`, `dashboard`) and any background compilation watchers like `air` for Go.

## Monorepo Tooling

- **Turborepo**: Orchestrates our build and dev pipelines.
- **Air**: Runs inside `packages/wasm` to provide hot-reloading for Go code.
- **Drizzle Kit**: Used for database schema migrations (`pnpm db:generate`, `pnpm db:migrate`, `pnpm db:studio`).
