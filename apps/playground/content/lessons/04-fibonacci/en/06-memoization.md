---
title: "6. Remembering Results (Memoization)"
task: "Complete the `fibo_fast` function to check if the result is already in the `kumbukumbu` (memory) dictionary."
initialCode: |
  fanya kumbukumbu = {}

  fanya fibo_fast = unda(n) {
      kama (n <= 1) { rudisha n }

      // 1. Check kama we already know the answer!
      kama (kumbukumbu[n] != tupu) {
          andika("Nakumbuka namba", n)
          rudisha // rudisha jibu kutoka kumbukumbu
      }

      // 2. Otherwise, calculate and SAVE IT
      fanya jibu = fibo_fast(n - 1) + fibo_fast(n - 2)
      kumbukumbu[n] = jibu
      rudisha jibu
  }

  andika(fibo_fast(10))
solution: |
  fanya kumbukumbu = {}

  fanya fibo_fast = unda(n) {
      kama (n <= 1) { rudisha n }

      kama (kumbukumbu[n] != tupu) {
          rudisha kumbukumbu[n]
      }

      fanya jibu = fibo_fast(n - 1) + fibo_fast(n - 2)
      kumbukumbu[n] = jibu
      rudisha jibu
  }

  andika(fibo_fast(10))
---
How do we make Fibonacci fast? We give the function a **Memory**!

In computer science, this is called **Memoization**. Every time we calculate a number, we save it in a dictionary. Next time we need it, we just look it up instead of recalculating it.

### Why it's fast:
With memory, `fibo(30)` goes from 2 Million calls down to just **30 calls**. That is a massive speed boost!

**Your Task:** Finish the `if` statement to return the stored value if it exists in `kumbukumbu[n]`. (In Nuru, we use `tupu` to check if a value is missing).

```nuru
kama (kumbukumbu[n] != tupu) {
    rudisha +++kumbukumbu[n]+++
}
```