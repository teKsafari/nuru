---
title: "3. When to Stop (Base Case)"
task: "Add an `if` statement to return the `orodha` if its length is 1 or less."
initialCode: |
  fanya panga = unda(orodha) {
      // Base Case: If the list has only 1 item, it's already sorted!
      // kama (idadi(orodha) <= 1) { ? }
      
      rudisha orodha
  }

  andika(panga([10])) // Should return [10]
solution: |
  fanya panga = unda(orodha) {
      kama (idadi(orodha) <= 1) {
          rudisha orodha
      }
      rudisha orodha
  }

  andika(panga([10]))
---
How far can we split a list? 

Eventually, we will have a list with only **one item**. 

### The Insight:
A list with only one number is **already sorted**! 
- Is `[5]` sorted? Yes! 
- Is `[1]` sorted? Yes!

This is our **Base Case**. Once we reach a list of size 1, we stop splitting and start merging them back together.

**Your Task:** Add the Base Case. If `idadi(orodha)` is 1 or less, return the list immediately.