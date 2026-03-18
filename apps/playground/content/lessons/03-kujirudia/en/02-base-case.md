---
title: "2. The Base Case"
task: "Add a `kama` (if) statement to check if `n <= 0`. If it is, `rudisha tupu` to stop the recursion."
initialCode: |
  fanya hesabu = unda(n) {
      // 1. Add the Base Case here!
      // kama (n <= 0) {
      //     andika("Imekamilika!")
      //     ?
      // }

      andika(n)
      hesabu(n) // This is still infinite! We'll fix it next.
  }

  // hesabu(5)
solution: |
  fanya hesabu = unda(n) {
      kama (n <= 0) {
          andika("Imekamilika!")
          rudisha tupu
      }

      andika(n)
      hesabu(n)
  }
---
To stop a recursive function from crashing, we must give it a stopping condition. We call this the **Base Case**.

The Base Case is simply an `if` (`kama`) statement that says: "If we have reached our goal, STOP and `rudisha` (return) immediately."

### How it looks:
```s
fanya stop_at_zero = unda(n) {
    kama (n == 0) {
        rudisha // STOP HERE
    }
    // ... rest of code
}
```

Without a Base Case, recursion is just a destructive infinite loop.

**Your Task:** Add the `kama` statement to the `hesabu` function. If `n` is 0 or less, print "Imekamilika!" and return `tupu` to stop the function.