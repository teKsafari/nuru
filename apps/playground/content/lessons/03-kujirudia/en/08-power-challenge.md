---
title: "8. Challenge: Power Function"
task: "Write a recursive function `peo(x, y)` that calculates 'x to the power of y' (x^y)."
initialCode: |
  fanya peo = unda(x, y) {
      // Base Case: Any number to the power of 0 is 1.
      kama (y == 0) {
          
      }
      
      // Recursive step: Multiply x by the power of (x, y - 1)
      rudisha 
  }

  andika("2^3 ni:", peo(2, 3)) // Should be 8 (2 * 2 * 2)
  andika("5^2 ni:", peo(5, 2)) // Should be 25 (5 * 5)
solution: |
  fanya peo = unda(x, y) {
      kama (y == 0) {
          rudisha 1
      }
      rudisha x * peo(x, y - 1)
  }

  andika("2^3 ni:", peo(2, 3))
  andika("5^2 ni:", peo(5, 2))
---
Let's put your recursion skills to the test!

You need to write a function that calculates exponents, like $x^y$ (x to the power of y).
For example, `2^3` is `2 * 2 * 2`.

### The Logic:
Think about it: $2^3$ is just $2 * 2^2$.
And $2^2$ is just $2 * 2^1$.
And $2^0$ is always **1**. This is your Base Case!

### Final Tip:
Always make sure you are changing the argument in each step (e.g., `y - 1`) so you eventually reach the Base Case (`y == 0`).

**Your Task:** Complete the `peo` function. Write +++rudisha 1+++ inside the Base Case and +++rudisha x * peo(x, y - 1)+++ for the Recursive Step.

```nuru
fanya peo = unda(x, y) {
    kama (y == 0) {
        +++rudisha 1+++
    }
    
    +++rudisha x * peo(x, y - 1)+++
}

andika("2^3 ni:", peo(2, 3))
andika("5^2 ni:", peo(5, 2))
```