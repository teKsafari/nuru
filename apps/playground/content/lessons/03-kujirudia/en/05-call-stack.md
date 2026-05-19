---
title: "5. The Call Stack"
task: "Place `andika(n)` *after* the recursive call `hesabu(n - 1)` to see how the call stack 'unwinds'."
initialCode: |
  fanya hesabu = unda(n) {
      kama (n <= 0) {
          rudisha tupu
      }
      
      hesabu(n - 1)
  }

  hesabu(5)
solution: |
  fanya hesabu = unda(n) {
      kama (n <= 0) {
          rudisha tupu
      }
      
      hesabu(n - 1)
      andika(n)
  }

  hesabu(5)
---
What just happened? Why did it count UP instead of down?

This introduces the **Call Stack**. When a function calls another function, the first function **pauses** and waits for the second one to finish. 

### Why the order matters:
If we call `hesabu(n-1)` *before* we print, the computer will keep pausing and "stacking" the functions on top of each other until it hits `0`. 

Once the `0` function finishes (returns), the computer resumes where it left off in the `1` function, then the `2` function, and so on.

### The Stack Order:
- `hesabu(5)` (Paused)
- `hesabu(4)` (Paused)
- `hesabu(3)` (Paused)
- `hesabu(2)` (Paused)
- `hesabu(1)` (Running) -> Prints 1
- `hesabu(2)` (Resumed) -> Prints 2

**Your Task:** Add `andika(n)` below `hesabu(n - 1)` to see this "unwinding" in action.

```nuru
fanya hesabu = unda(n) {
    kama (n <= 0) {
        rudisha tupu
    }
    
    hesabu(n - 1)
    +++andika(n)+++
}

hesabu(5)
```
