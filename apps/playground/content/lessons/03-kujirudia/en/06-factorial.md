---
title: "6. Math with Recursion: Factorial"
task: "Complete the `factorial` function. Multiply `n` by the result of `factorial(n - 1)`."
initialCode: |
  // Factorial is written as n! 
  // 5! = 5 * 4 * 3 * 2 * 1
  
  fanya factorial = unda(n) {
      // Base Case: 1! is just 1
      kama (n <= 1) {
          rudisha 1
      }
      
      // Recursive Step: n * (n-1)!
      rudisha // We need n multiplied by factorial(n - 1)
  }

  andika("5! ni:", factorial(5)) // Should be 120
solution: |
  fanya factorial = unda(n) {
      kama (n <= 1) {
          rudisha 1
      }
      rudisha n * factorial(n - 1)
  }

  andika("5! ni:", factorial(5))
---
Recursion is fantastic for mathematical calculations. 

A **Factorial** (written as `n!`) means multiplying a number by every whole number below it. For example, `5! = 5 * 4 * 3 * 2 * 1 = 120`.

### The Pattern:
Notice how `5!` is actually just `5 * 4!`. 
And `4!` is `4 * 3!`.
This is a perfect recursive pattern!

### Example:
```s
fanya fact = unda(n) {
    kama (n == 1) { rudisha 1 }
    rudisha n * fact(n - 1)
}
```

**Your Task:** Complete the `factorial` function by writing +++rudisha n * factorial(n - 1)+++. Can you see how it multiplies all the numbers?