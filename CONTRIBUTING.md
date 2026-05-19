# Contributing to Nuru Monorepo

First off, thank you for considering contributing to Nuru. 

We are especially looking for contributors to help us build out our **Learning Resources (Lessons)**. We want to expand the lessons to cover all aspects of programming in Nuru.

This document outlines the process for contributing to the repository, with a special focus on how to add or update lessons.

## Getting Started Locally

Before you can contribute, you'll need to set up the project locally.

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

3. **Start the Development Server:**
   ```bash
   turbo run dev
   ```
   This will start all the apps, including the Nuru Playground, where you can see your lesson changes live.

---

## How to Contribute Lessons

Our primary goal right now is to populate the Nuru Playground with comprehensive, easy-to-understand lessons. If you have a knack for teaching or want to help others learn Nuru, this is the perfect place to start!

### Lesson Location & Structure

All lessons are located in the following directory:
`apps/playground/content/lessons/`

Each main lesson (or module) is a separate folder prefixed with a number for ordering (e.g., `01-misingi-ya-nuru`). 

Inside a lesson folder, you will find:
1. `index.md`: Defines the metadata for the module.
2. `sw/`: Contains the Swahili content for the topics in this module.
3. `en/`: Contains the English translated content for the same topics.

**Example Structure:**
```text
apps/playground/content/lessons/
└── 01-misingi-ya-nuru/
    ├── index.md           # Module metadata
    ├── sw/
    │   ├── 01-karibu.md   # Topic 1 (Swahili)
    │   └── 02-andika.md   # Topic 2 (Swahili)
    └── en/
        ├── 01-karibu.md   # Topic 1 (English)
        └── 02-andika.md   # Topic 2 (English)
```

### 1. Module Metadata (`index.md`)

When creating a new lesson module, you need an `index.md` file at its root. This file should contain YAML frontmatter like this:

```yaml
---
difficulty: "mwanzilishi" # Options: mwanzilishi (Beginner), kati (Intermediate), mtaalamu (Advanced)
status: "draft" # optional. hides the lesson in prod. good for WIP lessons.  
title:
  sw: "Misingi ya Nuru"
  en: "Nuru Basics"
---
```

### 2. Topic Files (`sw/*.md` and `en/*.md`)

Individual topics within a lesson are written in Markdown and must include specific YAML frontmatter that the playground uses to render the interactive editor.

**Required Frontmatter format for topics:**

```yaml
---
title: "1. Welcome to Nuru!"
task: "Instructions explaining what the user needs to do in this step."
initialCode: |
  // Starter code provided to the user
  andika("Habari!")
solution: "The exact code required to pass this task."
---

Your markdown content explaining the concept goes here. Keep it simple, engaging, and easy to understand
```

**Tips for writing topics:**
- **Keep it brief:** Break complex concepts into smaller, digestible topics.
- **Provide clear tasks:** Ensure the `task` clearly explains what the user needs to write in the editor to proceed.
- **Bilingual:** Always provide both Swahili (`sw/`) and English (`en/`) versions of your lesson

### 3. Testing Your Lessons

1. Make sure your local server is running (`turbo run dev`).
2. Navigate to the Playground app in your browser (usually `http://localhost:3000`).
3. Open the "Lessons" or "Masomo" section and verify that your new lesson appears, the text formats correctly, and the interactive task can be completed using your provided `solution`.

---

## Contributing Code or Fixes

If you are contributing to the core WASM bridge, the Playground UI, or fixing bugs:

1. Follow the local setup instructions above.
2. Make your changes in a new branch.
3. Run tests before submitting:
   ```bash
   turbo run test
   ```
4. Ensure your code follows the existing style and conventions of the repository.

---

## Submitting a Pull Request (PR)

Once your lessons or code changes are ready:

1. **Create a branch:** `git checkout -b feature/your-feature-name` (e.g., `feature/lesson-variables`).
2. **Commit your changes:** `git commit -m "Add lesson on variables"`
3. **Push your branch:** `git push origin feature/your-feature-name`
4. **Open a Pull Request** on GitHub.
   - Give your PR a descriptive title.
   - In the description, explain what you added or fixed. If you added a new lesson, briefly describe the topics covered.

Thank you for helping us make programming accessible to millions of Swahili speakers!