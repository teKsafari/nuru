# nuru-playground
Interactive playground for nuru

## 🤝 Contributing Lessons
We are actively looking for contributors to add and improve the learning resources (lessons) for the Nuru Playground!

Lessons are located in `content/lessons/`. If you'd like to submit a new lesson or translate existing ones, please refer to the detailed [Contributing Guide](../../CONTRIBUTING.md) in the root of the repository for instructions on file structure and required markdown frontmatter.

### Healthchecks

For deployments with docker, healthcheks must be run against `/${locale}` eg `/sw/` not `/` which will return a redirect. Redirects are 'bad' as far as healthchecks are concerned. 