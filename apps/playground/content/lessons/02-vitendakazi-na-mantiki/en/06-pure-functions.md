---
title: "6. Pure Functions"
task: "Fix the `ongeza_mbili` function so it takes an argument and returns a new value instead of changing the global variable."
initialCode: |
  // Bad practice: Relying on global variables
  fanya namba_yangu = 10

  // Fix this function! It should take 'x' and rudisha 'x + 2'
  fanya ongeza_mbili = unda() {
      namba_yangu = namba_yangu + 2
  }

  ongeza_mbili()
  andika(namba_yangu) // This is unpredictable!
solution: |
  fanya namba_yangu = 10

  fanya ongeza_mbili = unda(x) {
      rudisha x + 2
  }

  andika(ongeza_mbili(namba_yangu)) // Predictable!
---
A **Pure Function** is a very important concept.
1. It **always** gives the same output for the same input.
2. It **never** changes variables outside itself (no "side effects").

### Pure vs Impure Example:
```s
// IMPURE (Unpredictable)
fanya total = 0
fanya add = unda(x) {
    total = total + x // Changing something OUTSIDE
}

// PURE (Safe and Predictable)
fanya add_pure = +++unda(x, y) {
    rudisha x + y // Just calculating and returning
}+++
```

Pure functions make your code much easier to test and reason about because they are isolated!

**Your Task:** Rewrite `ongeza_mbili` to be a pure function. It should take a number and return that number plus 2.

```s
fanya ongeza_mbili = +++unda(x) {
    rudisha x + 2
}+++
```