**Note:** Lessons are no longer written as local Markdown files. The platform is entirely database-driven. The content dir is still maintained for testing reasons.

## Authoring Workflow via the Dashboard

To author or edit lessons, you will use the **Educator Dashboard** (`apps/dashboard`).

1. **Start the Development Environment**:
   Follow the [Getting Started](./getting-started.md) guide to spin up the monorepo locally (`turbo run dev`).
    <!-- Make sure your database is running and seeded. -->
2. **Access the Dashboard**:
   Navigate to `http://nuru-dashboard.localhost:3941` and log in. You must have a "Super Admin" role assigned via Logto to see existing lessons.
3. **The Editor Interface**:
   The dashboard provides a rich-text editor powered by **Tiptap**

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
- `match_code`: Validates the user's raw code string against a Regex pattern (e.g., ensuring they used a `while` loop).

4. **Custom Highlighting**: The playground's custom `CodeEditor` supports syntax highlighting. You can use specific markdown notations (like `+++highlight+++`) to draw attention to critical parts of the code snippets in your explanations.
