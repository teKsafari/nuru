---
title: "Pure Functions"
task: "Rewrite `ongeza_kodi` as a pure function: it takes an argument `bei` and returns the price plus 18 percent tax (`bei * 118 / 100`). Do not print anything inside it."
---
A **pure function** has two properties:

1. Given the same arguments, it returns the same answer **every time**.
2. It touches nothing outside itself: it does not print to the screen and does not change outside arrays.

```nuru
// Pure: depends only on its arguments
fanya eneo_la_mraba = +++unda(upande) {
    rudisha upande * upande
}+++

// Not pure: depends on an outside variable
fanya upande = 5
fanya eneo_baya = unda() {
    rudisha upande * upande
}
```

Why care? A pure function is easy to test and to trust. If `eneo_la_mraba(5)` is 25 today, you know it will be 25 tomorrow too, anywhere in your program.
