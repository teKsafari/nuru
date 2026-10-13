---
title: "Getting Input (jaza)"
task: "Use `jaza()` to ask the user for their favourite food. Then print `Chakula ninachopenda ni` followed by their answer."
---
So far your programs have done all the talking. `jaza()` lets the user answer back.

`jaza()` shows a question, waits for the user to type an answer and press Enter, then returns that answer:

```nuru
fanya jina = +++jaza("Jina lako ni nani? ")+++
andika("Karibu,", jina)
```

When you run this program, the terminal asks for your name. Type an answer and press Enter.

**Important:** `jaza()` always returns **text** (a `NENO`), even when the user types a number. You will see why that matters in the lesson on converting types.
