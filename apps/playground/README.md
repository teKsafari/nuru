# nuru-playground
Interactive playground for nuru

## 🤝 Contributing Lessons
We are actively looking for contributors to add and improve the learning resources (lessons) for the Nuru Playground!

Lessons are located in `content/lessons/`. If you'd like to submit a new lesson or translate existing ones, please refer to the detailed [Contributing Guide](../../CONTRIBUTING.md) in the root of the repository for instructions on file structure and required markdown frontmatter.

### Healthchecks

For deployments with docker, healthchecks must be run against `/api/health`, which returns a static `200 ok` without touching the database or redirecting.

Do **not** point healthchecks at `/` (returns a redirect, which is 'bad' for healthchecks) or at a locale path like `/en/` or `/sw/`. Those routes render the layout, which queries the database on every request — a monitor pinging them keeps the Neon serverless compute permanently awake (it never autosuspends), burning compute hours even with zero real users. 