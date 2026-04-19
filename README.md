![Nuru Monorepo Banner](./mawio.jpeg)

# Nuru Monorepo

## 🌍 Mission

Our goal is to make Nuru accessible to everyone, everywhere. By compiling the core Nuru interpreter to WebAssembly (Wasm), we enable:
- **Interactive Learning**: Run Nuru code directly in your browser.
- **Zero-Install Setup**: No need to install Go or command-line tools to get started.
- **Cross-Platform Compatibility**: Use Nuru on any device with a modern web browser.

## 🏗️ Project Structure

This repository is optimized as a [monorepo](./MONOREPO.md). 
> [Read here](./MONOREPO.md) for more information.

### Packages (`/packages`)

- **[`@nuru/wasm`](./packages/nuru-wasm)**: The heart of the project. A Go-based WebAssembly interpreter that bridges Nuru's backend logic with the browser's JavaScript environment.

### Apps (`/apps`)

- **[`nuru-svelte`](./apps/nuru-svelte)**: The primary **Nuru Playground**. A fast, reactive web application built with Svelte that lets users write, run, and learn Nuru code interactively.
- **[`nuru-playground`](./apps/playground)**: An alternative playground implementation using Next.js.

## 🚀 Getting Started

Follow these steps to set up the development environment.

### Prerequisites

- **Node.js** (^18.13)
- **pnpm** (Package Manager)
- **Go** (^1.19.0)
- **TinyGo** (^0.27.0) - *Required for building the optimized WASM binary*

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/teKsafari/nuru-mono.git
   cd nuru-mono
   ```

2. **Install dependencies:**
   ```bash
   pnpm install
   ```

### ⚡ Development

We use `turbo` to manage tasks across the monorepo.

- **Start Development Server** (Runs all apps):
  ```bash
  turbo run dev
  ```

- **Build All Packages & Apps**:
  ```bash
  turbo run build
  ```

- **Run Tests**:
  ```bash
  turbo run test
  ```

> **Tip:** You can filter tasks to specific packages, e.g., `turbo run dev --filter=nuru-svelte`.

## 🤝 Contributing

We actively welcome contributions! 

**🚨 Call for Educators & Writers:** We are actively looking for contributors to help build out our **Learning Resources (Lessons)** in the Nuru Playground. The current lessons are just templates. If you can help teach programming in Swahili and English, please submit a PR!

Whether you're writing new lessons, fixing bugs in the WASM bridge, or enhancing the UI, please see our full [Contributing Guide (CONTRIBUTING.md)](./CONTRIBUTING.md) for detailed instructions on how to get started, especially regarding the structure and formatting of lesson files.

---

*Powered by [NuruProgramming](https://github.com/NuruProgramming).*
