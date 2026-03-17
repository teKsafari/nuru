---
title: "8. Getting Input (jaza)"
task: "Use `jaza()` to ask the user for their favorite food, then print it."
initialCode: |
  chakula = jaza("Unapenda kula nini? ")
  andika("Wow, nami napenda " + chakula)
solution: "chakula = jaza(\"Wali\"); andika(chakula)"
---
The `jaza()` function allows you to get information from the user. The computer will pause and wait until the user types something.

**Important**: The value returned by `jaza()` is always a **String** (text).

### Example:
```s
fanya name = jaza("What is your name? ")
andika("Welcome,", name)
```

If you want a number, you will have to convert it (we'll learn this later).
