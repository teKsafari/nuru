![Nuru Monorepo Banner](./mawio.jpeg)

# Nuru Monorepo

## Mission

Our goal is to make Nuru accessible to everyone, everywhere. By compiling the core Nuru interpreter to WebAssembly (WASM), we enable:
- **Interactive Learning**: Run Nuru code directly in your browser.
- **Zero-Install Setup**: No need to install Go or command-line tools to get started.
- **Cross-Platform Compatibility**: Use Nuru on any device with a modern web browser.

---

## Project Structure

This repository is optimized as a monorepo utilizing **pnpm workspaces** and **Turborepo** for clean, scalable module federation. For an overview of our monorepo architecture, please refer to [MONOREPO.md](./MONOREPO.md).

### Applications (`/apps`)

- **[`playground`](./apps/playground)**: The primary **Nuru Playground**. An interactive, modern Next.js 15 application that lets users write, execute, and learn Nuru interactively in Swahili and English.
- **[`dashboard`](./apps/dashboard)**: The **Educator Dashboard**. A Next.js 15 administrative interface for educators to create, organize, and manage localized lessons and learning modules.

### Packages (`/packages`)

- **[`@nuru/wasm`](./packages/wasm)**: The core compilation layer. Features the Nuru interpreter written in Go, compiled to WASM via TinyGo, paired with a type-safe TypeScript/React bridge.
- **[`@nuru/db`](./packages/db)**: The centralized data layer using Drizzle ORM to manage Postgres schemas and relationships for users, modules, and lessons.
- **[`@nuru/ui`](./packages/ui)**: The shared design system and Tailwind CSS 4 components, keeping user interface design seamless and uniform across all our apps.

---

## Getting Started

Whether you want to set up the development environment, contribute code, or author interactive lesson content, we have detailed guidelines prepared:

1. 🚀 **[Getting Started Locally](./contributing/getting-started.md)**: Setup prerequisites (Node.js 22, pnpm, Go, TinyGo) and start the local monorepo development pipeline.
2. ✍️ **[Contributing Lessons](./contributing/lessons.md)**: A complete, step-by-step guide to writing and structuring interactive Nuru programming lessons in Swahili and English.
3. 💻 **[Contributing Code](./contributing/code.md)**: Standards, architecture conventions, and the Pull Request workflow for coding contributions.

---

*Powered by [NuruProgramming](https://github.com/NuruProgramming).*
