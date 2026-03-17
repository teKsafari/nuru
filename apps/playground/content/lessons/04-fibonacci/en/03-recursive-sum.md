---
title: "3. Adding the Past (Recursive Step)"
task: "Complete the `fibo` function by returning the sum of `fibo(n-1)` and `fibo(n-2)`."
initialCode: |
  fanya fibo = unda(n) {
      kama (n <= 1) {
          rudisha n
      }
      
      // Recursive Step: Add the two previous Fibonacci numbers
      rudisha // fibo(n-1) + fibo(n-2)
  }

  andika("Fibonacci of 5 is:", fibo(5)) // Should be 5
  andika("Fibonacci of 6 is:", fibo(6)) // Should be 8
solution: |
  fanya fibo = unda(n) {
      kama (n <= 1) {
          rudisha n
      }
      rudisha fibo(n - 1) + fibo(n - 2)
  }

  andika("Fibonacci of 5 is:", fibo(5))
  andika("Fibonacci of 6 is:", fibo(6))
---
Now for the magic! To find any Fibonacci number, the computer just needs to ask: "What are the two numbers before me?"

### Recursive Step:
In Nuru, we write this as:
`rudisha fibo(n - 1) + fibo(n - 2)`

### How the computer sees it:
If you ask for `fibo(2)`:
1. It calls `fibo(1)` (which returns 1).
2. It calls `fibo(0)` (which returns 0).
3. It adds them: `1 + 0 = 1`.

**Your Task:** Complete the recursive step! Make the function call itself twice to get the sum of the previous two numbers.