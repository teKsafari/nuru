---
title: "3. The Recursive Step"
task: "Fix the recursive call `hesabu(n)` so that it passes `n - 1` instead. This brings us closer to the base case!"
initialCode: |
  fanya hesabu = unda(n) {
      // Base Case
      kama (n <= 0) {
          andika("Imekamilika!")
          rudisha tupu
      }

      andika(n)
      
      // Recursive Step: We need to reduce 'n' by 1
      hesabu( /* weka n - 1 hapa */ ) 
  }

  hesabu(3)
solution: |
  fanya hesabu = unda(n) {
      kama (n <= 0) {
          andika("Imekamilika!")
          rudisha tupu
      }

      andika(n)
      hesabu(n - 1)
  }

  hesabu(3)
---
We have a Base Case that stops when `n <= 0`. But if we start with `n = 3` and keep passing `3` into the function, it will never reach `0`!

We need a **Recursive Step**. This means every time the function calls itself, it must change its argument to get a little bit closer to the Base Case.

### Why subtraction?
In this example, we are counting down. So, each step must be smaller than the last.
- Step 1: `hesabu(3)`
- Step 2: `hesabu(2)`
- Step 3: `hesabu(1)`
- Step 4: `hesabu(0)` -> **STOP!**

**Your Task:** Change the function call `hesabu(n)` to `hesabu(n - 1)`. This will finally make the recursion work!