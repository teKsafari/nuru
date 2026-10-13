---
title: "Printing Output (andika)"
task: "Use a single `andika()` to print two lines: `Jina langu ni ...` and `Naishi ...`. Separate the lines with `\\n`."
---
`andika()` is the main way your program talks to you. You can print words, numbers, or both together:

```nuru
andika("Bei ya embe ni", 500)
```

When you separate items with a comma `,`, Nuru puts a space between them. This example prints `Bei ya embe ni 500`.

### New line

Inside text, `\n` means "start a new line". It is a backslash `\` followed by the letter `n`, not `/n`.

```nuru
andika("Simba+++\n+++Yanga")
```

The output is:

```text
Simba
Yanga
```
