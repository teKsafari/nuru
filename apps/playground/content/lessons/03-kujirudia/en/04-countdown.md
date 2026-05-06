---
title: "4. Counting Down"
task: "Try changing `hesabu(5)` to `hesabu(10)` and watch the full countdown in action."
initialCode: |
  fanya hesabu = unda(n) {
      // Base Case
      kama (n <= 0) {
          andika("Rusha roketi!")
          rudisha tupu
      }
      
      andika(n)
      
      // Recursive Step
      hesabu(n - 1)
  }

  hesabu(5)
solution: |
  fanya hesabu = unda(n) {
      kama (n <= 0) {
          andika("Rusha roketi!")
          rudisha tupu
      }
      andika(n)
      hesabu(n - 1)
  }
  hesabu(10)
---
You did it! You built your first fully working recursive function.

A recursive function always has these two essential parts:
1. **Base Case:** When do I stop? (`kama (n <= 0)`)
2. **Recursive Step:** How do I get closer to stopping? (`hesabu(n - 1)`)

### Conceptual Example:
Imagine a Russian nesting doll. To find the prize in the middle, you:
1. Open the current doll.
2. If it's the smallest doll (**Base Case**), you take the prize.
3. If not, you open the next smaller doll (**Recursive Step**).

**Your Task:** Test the power of your function! Change the starting number by writing +++hesabu(10)+++ at the bottom. Notice how the same small amount of code can now handle much more work.