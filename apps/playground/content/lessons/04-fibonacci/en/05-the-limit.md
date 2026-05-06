---
title: "5. The Speed Limit"
task: "Change `fibo(5)` to `fibo(30)` and see how much slower it becomes. (Be patient, it might take a second!)"
initialCode: |
  fanya fibo = unda(n) {
      kama (n <= 1) {
          rudisha n
      }
      rudisha fibo(n - 1) + fibo(n - 2)
  }

  // Jaribu namba kubwa zaidi (Try a bigger number)
  andika("Calculating fibo(5)...")
  andika(fibo(5))
solution: |
  fanya fibo = unda(n) {
      kama (n <= 1) {
          rudisha n
      }
      rudisha fibo(n - 1) + fibo(n - 2)
  }

  andika("Calculating fibo(30)...")
  andika(fibo(30))
---
As `n` grows, the number of calls explodes! 
- `fibo(5)` = 15 calls
- `fibo(10)` = 177 calls
- `fibo(30)` = **Over 2 Million calls!**

This is why simple recursion can sometimes be "expensive" for a computer. It's doing millions of calculations for the same small numbers (like `fibo(2)`) because it has no memory.

**Your Task:** Change the input to 30. Notice the slight delay as your computer works hard to calculate millions of steps! We'll fix this speed problem in the next lesson.

```nuru
andika(fibo(+++30+++))
```