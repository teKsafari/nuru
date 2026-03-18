---
title: "7. Recursion with Arrays"
task: "Complete the `jumla` function to return `orodha[0] + jumla(orodha_mpya)`."
initialCode: |
  fanya jumla = unda(orodha) {
      // Base Case: Empty array
      kama (idadi(orodha) == 0) {
          rudisha 0
      }
      
      // Get all items EXCEPT the first one
      fanya orodha_mpya = kata(orodha, 1)
      
      // Recursive Step: First item + sum of the rest
      rudisha // weka mantiki hapa
  }

  andika(jumla([10, 20, 30])) // Should be 60
solution: |
  fanya jumla = unda(orodha) {
      kama (idadi(orodha) == 0) {
          rudisha 0
      }
      fanya orodha_mpya = kata(orodha, 1)
      rudisha orodha[0] + jumla(orodha_mpya)
  }

  andika(jumla([10, 20, 30]))
---
You can use recursion to process lists of data! 

If you want to find the sum of all numbers in an array, the recursive logic is:
1. **Base Case:** If the array is empty, the sum is 0.
2. **Recursive Step:** Take the first number, and add it to the sum of the *rest* of the array.

### Visualizing it:
`jumla([1, 2, 3])`
- `1 + jumla([2, 3])`
- `1 + (2 + jumla([3]))`
- `1 + (2 + (3 + jumla([])))`
- `1 + (2 + (3 + 0))` = **6**

### Built-in Tool:
We use the function `kata(orodha, 1)` to get a new array that is missing the first item.

**Your Task:** Complete the logic for `jumla`. Return the value of the first item in the list (`orodha[0]`) plus the result of calling `jumla` on the rest of the list.