**Two ways to author lessons.** The core curriculum lives as Markdown in [`packages/mtaala`](../packages/mtaala/README.md). It is reviewed in pull requests, verified with `pnpm --filter @nuru/mtaala hakiki` and loaded with `pnpm --filter @nuru/mtaala seed`. Teachers' own modules are written in the dashboard editor below. Its **Hakiki** panel runs the same checks in the browser.

## Authoring Workflow via the Dashboard

To author or edit lessons, you will use the **Educator Dashboard** (`apps/dashboard`).

1. **Start the Development Environment**:
   Follow the [Getting Started](./getting-started.md) guide to spin up the monorepo locally (`turbo run dev`).
    <!-- Make sure your database is running and seeded. -->
2. **Access the Dashboard**:
   Navigate to `http://nuru-dashboard.localhost:3941` and log in. You need the "Educator" or "Super Admin" role in Logto. Locally, set `NURU_DEV_AUTH=1` instead.
3. **The Editor Interface**:
   The dashboard provides a rich-text editor with Kiswahili and English side by side, a live preview, and the Hakiki panel

## Data Structure & Localization

All educational content is managed in our centralized database (`packages/db`).

- **Modules**: High-level categories (e.g., "Nuru Basics"). Modules have a set difficulty, visibility status, and are linked to an organization.
- **Lessons**: Individual topics within a Module. Lessons contain the instructional content, starting code, and the solution required to pass.

**Bilingual design**:
Our database schema enforces bilingual content using structured JSON. When authoring a lesson in the dashboard, you must provide content for both languages. Under the hood, this is stored as:

```typescript
{
  sw: "Habari, Karibu",
  en: "Hello, Welcome"
}
```

## Lesson Formatting Guidelines

Keep the following in mind:

1. **Clear Tasks**: Ensure the instructions explicitly tell the user what they need to code to pass the lesson.
2. **Starter Code**: Provide just enough `default_code` to get the user started without giving away the answer.
   Here is the cleaned-up and properly formatted version of your text:

3. **Solutions & Tests**:

- **Solution**: The `solution` field provides the reference answer for the lesson. It is available to users if they get stuck.
- **Tests**: The playground evaluates the user's code using an array of `tests`. These tests define how the code is validated. Test types include:
- `io`: Evaluates the user's code by feeding it specific input and asserting the output.
- `exact_output` / `match_output`: Asserts that the code's output exactly matches a string or passes a Regex pattern.
- `match_code`: Validates the user's raw code string against a Regex pattern (e.g., ensuring they used a `wakati` loop).
- `kobe_picha`: The learner's kobe drawing must match the reference drawing. Any path that draws the same picture passes.
- `ubao_mfuatano`: The LED board must go through the same sequence of states as the reference solution.

4. **Custom Highlighting**: The playground's custom `CodeEditor` supports syntax highlighting. You can use specific markdown notations (like `+++highlight+++`) to draw attention to critical parts of the code snippets in your explanations.
