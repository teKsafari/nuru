---
title: "7. Recursion with Arrays"
task: "Complete the `jumla` function to return `orodha[i] + jumla(orodha, i + 1)`."
initialCode: |
  fanya jumla = unda(orodha, i=0) {
      // Base Case: We have reached the end of the array
      kama (i == orodha.idadi()) {
          rudisha 0
      }
      
      // Recursive Step: Current item + sum of the rest
      rudisha // weka mantiki hapa
  }

  andika(jumla([10, 20, 30])) // Should be 60
solution: |
  fanya jumla = unda(orodha, i=0) {
      kama (i == orodha.idadi()) {
          rudisha 0
      }
      rudisha orodha[i] + jumla(orodha, i + 1)
  }

  andika(jumla([10, 20, 30]))
---
You can use recursion to process lists of data! 

If you want to find the sum of all numbers in an array, we can pass an index `i` that keeps track of where we are.

### The Recursive Logic:
1. **Base Case:** If `i` reaches the end of the array (`orodha.idadi()`), the sum is 0.
2. **Recursive Step:** Take the current number (`orodha[i]`), and add it to the sum of the *rest* of the array (`jumla(orodha, i + 1)`).

### Visualizing it:
`jumla([10, 20], 0)`
- `10 + jumla([10, 20], 1)`
- `10 + (20 + jumla([10, 20], 2))`
- `10 + (20 + 0)` = **30**

**Your Task:** Complete the logic for `jumla`. Return the value of the current item in the list (`orodha[i]`) plus the result of calling `jumla` on the rest of the list (`jumla(orodha, i + 1)`).
