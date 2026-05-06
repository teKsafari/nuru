---
title: "7. Fast Fibonacci"
task: "Run the optimized code for `fibo(40)`. Notice how it's now instant!"
initialCode: |
  fanya kumbukumbu = {}

  fanya fibo = unda(n) {
      kama (n <= 1) { rudisha n }
      kama (kumbukumbu[n] != tupu) {
          rudisha kumbukumbu[n]
      }

      fanya jibu = fibo(n - 1) + fibo(n - 2)
      kumbukumbu[n] = jibu
      rudisha jibu
  }

  andika("Calculating fibo(40) instantly...")
  andika(fibo(40))
solution: |
  fanya kumbukumbu = {}

  fanya fibo = unda(n) {
      kama (n <= 1) { rudisha n }
      kama (kumbukumbu[n] != tupu) {
          rudisha kumbukumbu[n]
      }

      fanya jibu = fibo(n - 1) + fibo(n - 2)
      kumbukumbu[n] = jibu
      rudisha jibu
  }

  andika("Calculating fibo(40) instantly...")
  andika(fibo(40))
---
Congratulations! You've mastered one of the most classic challenges in programming.

### What you learned:
1. **Recursion:** A function can call itself to solve a complex problem.
2. **Double Recursion:** One call can branch into two, creating a tree.
3. **Performance:** Recursion can be slow if it repeats work.
4. **Memoization:** Storing results in memory makes your code thousands of times faster.

**Your Task:** Run the code for `fibo(40)`. Without memoization, this would take billions of steps and probably crash your browser. With memoization, it's finished before you can blink!

```nuru
andika(+++fibo(40)+++)
```