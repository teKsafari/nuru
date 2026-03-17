---
title: "1. Counting Down"
task: "Try changing `hesabu(5)` to `hesabu(10)` and see the difference."
initialCode: |
  fanya hesabu = unda(n) {
      // Base Case
      kama (n <= 0) {
          andika("Blast off!")
          rudisha tupu
      }
      
      andika(n)
      // The function calls itself with a smaller number
      hesabu(n - 1)
  }

  hesabu(5)
solution: |
  fanya hesabu = unda(n) {
      kama (n <= 0) {
          andika("Blast off!")
          rudisha tupu
      }
      andika(n)
      hesabu(n - 1)
  }
  hesabu(10)
---
**Recursion** is when a function calls itself to solve a smaller version of the problem. It's like a Russian Doll - you open a big one and find a smaller one inside.

The most important part is the **Base Case**. This is the condition that tells the program "Stop now!". Without it, the program will loop forever and crash.
