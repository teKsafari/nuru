---
title: "13. Functions"
task: "Create a function `jumla` that takes `a` and `b` and returns their sum."
initialCode: |
  fanya jumla = unda(a, b) {
      // Andika kodi yako hapa
  }
  
  andika(jumla(5, 7))
solution: |
  fanya jumla = unda(a, b) {
      rudisha a + b
  }
  
  andika(jumla(5, 7))
---
Functions are pieces of code that you can call at any time. We use the word `unda` to create a function.

### Why use functions?
1. To simplify repetitive tasks.
2. To make code cleaner.

### Example:
```nuru
fanya square = +++unda(n)+++ {
    +++rudisha n * n+++
}

andika(square(5))  // 25
andika(square(10)) // 100
```

**Your Task:** Create a function `jumla` that takes two numbers `a` and `b` and returns their sum.

```nuru
fanya jumla = unda(a, b) {
    +++rudisha a + b+++
}
```
