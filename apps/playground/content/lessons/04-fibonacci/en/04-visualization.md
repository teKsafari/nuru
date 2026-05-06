---
title: "4. The Tree of Calls"
task: "Run the code and watch how many times `fibo` is called just to find the 5th number."
initialCode: |
  fanya hesabu = 0

  fanya fibo = unda(n) {
      hesabu = hesabu + 1
      andika("Nimeitwa kwa n =", n)

      kama (n <= 1) {
          rudisha n
      }
      rudisha fibo(n - 1) + fibo(n - 2)
  }

  fanya jibu = fibo() // Weka namba hapa
  andika("------------------")
  andika("Jibu ni:", jibu)
  andika("Jumla ya mara zilizoitwa:", hesabu)
solution: |
  fanya hesabu = 0

  fanya fibo = unda(n) {
      hesabu = hesabu + 1
      andika("Nimeitwa kwa n =", n)

      kama (n <= 1) {
          rudisha n
      }
      rudisha fibo(n - 1) + fibo(n - 2)
  }

  fanya jibu = fibo(5)
  andika("------------------")
  andika("Jibu ni:", jibu)
  andika("Jumla ya mara zilizoitwa:", hesabu)
---
When a function calls itself twice, it creates a **Tree of Calls**.

To find `fibo(5)`, the computer doesn't just do 5 steps. It actually calls the function **15 times**!

### Why?
- `fibo(5)` calls `fibo(4)` and `fibo(3)`.
- `fibo(4)` calls `fibo(3)` and `fibo(2)`.
- Notice how `fibo(3)` is being calculated twice? As `n` gets bigger, the computer starts repeating the same work over and over again.

**Your Task:** Run the code for `fibo(5)` and look at the output. Can you believe it took 15 calls just for the number 5? Imagine how many it takes for 30!

```nuru
fanya jibu = fibo(+++5+++)
```