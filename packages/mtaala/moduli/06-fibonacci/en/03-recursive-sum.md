---
title: "Calling Yourself Twice"
task: "Finish `fibo` with the recursive step: return `fibo(n - 1) + fibo(n - 2)`."
---
Notice the trick in the base case: `kama (n <= 1) { rudisha n }` handles 0 and 1 together, because `fibo(0)` is 0 and `fibo(1)` is 1.

Now the Fibonacci rule itself: each number is the sum of the two before it. In Nuru, the function calls itself **twice**:

```text
fibo(n) = fibo(n - 1) + fibo(n - 2)
```

When you ask for `fibo(2)`:

1. It calls `fibo(1)`, which returns 1.
2. It calls `fibo(0)`, which returns 0.
3. It adds them: `1 + 0 = 1`.
