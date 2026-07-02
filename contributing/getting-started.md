# Getting Started with Nuru Monorepo

Welcome to the Nuru Monorepo! This guide details the setup and workflows for developing across our Next.js applications and Go-based WASM engine.

## Prerequisites

- **Node.js**: Version `^22.0.0` is strictly required for compatibility with Next.js 15.
- **pnpm**: Our package manager of choice (`npm install -g pnpm`).
- **Go**: Version `^1.19.0` for developing the core interpreter.
- **TinyGo**: Version `^0.27.0` is required for compiling the production-optimized WebAssembly binary.
- **Docker**: Required to run the local Postgres database. No `sudo` should be needed on Linux, add yourself to the `docker` group (`sudo usermod -aG docker $USER`, then re-login). 

## Local Setup & Development

1. **Clone and Install:**
   ```bash
   gh repo clone teKsafari/nuru
   cd nuru
   pnpm install
   ```

2. **Environment Variables:**
   You will need to set up local environment variables for Authentication (Logto) and the Database.
   - Copy each `.env.example` to `.env` — for `apps/dashboard`, `apps/playground`, and `packages/db`.
   - Configure the Logto OIDC variables in the apps.
   - For the database, `packages/db/.env` drives everything (the container, migrations, and seeding all read it). For **local development you only need `DEV_POSTGRES_PASSWORD`** — leave `DATABASE_URL` unset. Set `DATABASE_URL` to the Neon connection string only when you intentionally want to point at the remote/prod database.

     ```dotenv
     # packages/db/.env — local development
     DEV_POSTGRES_PASSWORD=some-local-password
     # DATABASE_URL is left unset for local dev
     ```

3. **Local Database (recommended):**
   To run the local Postgres in Docker for development:
   ```bash
   # 1. Start the container (compose file lives in packages/db)
   cd packages/db && docker compose up -d && cd ../..

   # 2. Create the schema, then load seed data (db scripts are hoisted to the root)
   pnpm db:migrate
   pnpm db:seed
   ```
   See the [Local Database](#local-database) section below for the full workflow

5. **Start the Development Servers:**
   ```bash
   turbo run dev
   ```
   This command starts the Next.js apps (`playground`, `dashboard`) and any background compilation watchers like `air` for Go.

## Local Database

For local development we run **Postgres 18 in Docker** .

### How connection selection works

Both the app runtime (`packages/db/src/index.ts`) and Drizzle Kit (`packages/db/drizzle.config.ts`) resolve their connection through `getConntectionString()` in `packages/db/src/connection.ts`:

- If `DATABASE_URL` is set and contains `neondb_owner` → treat it as the remote Neon database and use it as-is. At runtime this also selects the Neon HTTP driver (`drizzle-orm/neon-http`).
- Otherwise → build a local URL from `DEV_POSTGRES_PASSWORD`: `postgres://postgres:<password>@localhost:5432/postgres`. At runtime this selects the standard Postgres driver (`drizzle-orm/node-postgres`). This split is required because the Neon HTTP driver cannot talk to a plain local Postgres.

### The database scripts

All `db:*` scripts are hoisted into `turbo.json` and the root `package.json`, so you can run them from anywhere in the repo. Turbo executes each one with its working directory set to `packages/db` (where the compose file, `drizzle.config.ts`, `seed.sql`, and `.env` all live).

| Command | What it does |
| --- | --- |
| `pnpm db:generate` | Generate a new migration from `src/schema.ts`. |
| `pnpm db:migrate`  | Apply pending migrations (creates the schema + records them in the drizzle journal). |
| `pnpm db:push`     | Push the schema directly without a migration file (quick prototyping). |
| `pnpm db:seed`     | Load `packages/db/seed.sql` into the running container's Postgres. |
| `pnpm db:studio`   | Open Drizzle Studio against the current connection. |

### First-time setup

```bash
# 1. Set DEV_POSTGRES_PASSWORD in packages/db/.env (copy from .env.example)

# 2. Start Postgres (from packages/db, where the compose file is)
cd packages/db && docker compose up -d && cd ../..

# 3. Create the schema, then seed
pnpm db:migrate
pnpm db:seed
```

### Seeding

`db:seed` loads a data-only SQL file (`packages/db/seed.sql`) by piping it into the container's own `psql`:

```
docker compose exec -T postgres psql -U postgres -d postgres -v ON_ERROR_STOP=1 < seed.sql
```

Running it *inside the container* means you don't need a host `psql` client, and it correctly handles pg_dump artifacts (`COPY`, `\.`, `\restrict`) that the Node driver cannot execute. The container must be up first, and the schema must already exist (`db:migrate`) — the seed only loads data, it does not create tables.

```bash
pg_dump --data-only --no-owner --schema=public "<source-url>" > packages/db/seed.sql
```

### Resetting

The seed data persists in a Docker volume across restarts. To wipe and start clean:

```bash
cd packages/db
docker compose down -v      # remove the container AND its volume
docker compose up -d
cd ../..
pnpm db:migrate && pnpm db:seed
```

## Monorepo Tooling

- **Turborepo**: Orchestrates our build and dev pipelines.
- **Air**: Runs inside `packages/wasm` to provide hot-reloading for Go code.
- **Drizzle Kit**: Used for database schema migrations. All `db:*` scripts (`db:generate`, `db:migrate`, `db:push`, `db:seed`, `db:studio`) are runnable from the repo root — see [Local Database](#local-database).
