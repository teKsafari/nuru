---
title: "2. The Starting Point (Base Cases)"
task: "Add two `kama` (if) statements to return `n` if `n == 0` or `n == 1`."
initialCode: |
  fanya fibo = unda(n) {
      // 1. Base Case for 0: If n is 0, return 0
      // kama (n == 0) { rudisha 0 }
      
      // 2. Base Case for 1: If n is 1, return 1
      // kama (n == 1) { rudisha 1 }
      
      rudisha // still working on it...
  }

  andika("fibo(0) ni:", fibo(0))
  andika("fibo(1) ni:", fibo(1))
solution: |
  fanya fibo = unda(n) {
      kama (n == 0) {
          rudisha 0
      }
      kama (n == 1) {
          rudisha 1
      }
      rudisha n
  }

  andika("fibo(0) ni:", fibo(0))
  andika("fibo(1) ni:", fibo(1))
---
Remember: A recursive function needs a **Base Case** to stop it from looping forever.

For Fibonacci, we actually need **two** base cases because the calculation always relies on the *two* previous numbers. If we reach the very beginning (0 or 1), we can't look back any further.

### The Rule:
- Fibonacci of 0 is **0**.
- Fibonacci of 1 is **1**.

**Your Task:** Complete the base cases for the `fibo` function so it can correctly return 0 and 1.