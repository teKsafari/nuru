---
title: "Functions Refresher"
task: "Finish the function `salamu` so that it prints `Jambo!`. Then call it **twice**."
---
Welcome back! In Nuru Basics you learned that a function is like a small machine. You build it once, then switch it on whenever you need it.

Two separate steps:

1. **Creating**: `fanya jina = unda() { ... }` builds the machine. It does not run yet.
2. **Calling**: `jina()` switches the machine on and runs the code inside `{ }`.

```nuru
fanya piga_mluzi = unda() {
    andika("Fiiiii!")
}

+++piga_mluzi()+++
+++piga_mluzi()+++
+++piga_mluzi()+++
```

This example prints `Fiiiii!` three times, because we called the function three times. Without `()` the function never runs.
