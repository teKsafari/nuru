---
title: "1. The Sudoku Challenge"
task: "Run the code to see a 4x4 Sudoku grid represented in a 2D array. What numbers are missing?"
initialCode: |
  fanya gridi = [
    [1, 0, 3, 0],
    [0, 0, 2, 1],
    [0, 1, 0, 2],
    [2, 4, 0, 3]
  ]

  // A 0 means the cell is empty.
  andika("Sudoku Gridi:")
  kwa i ktk mfululizo(idadi(gridi)) {
      andika(gridi[i])
  }
solution: |
  andika("Sawa!")
---
Welcome to the final boss of our recursion journey: **The Sudoku Solver**.

A Sudoku grid is a 2D array (a list of lists). The goal is to fill every `0` with a number from 1 to 4 (in a 4x4 grid) such that:
1. No number repeats in a **Row**.
2. No number repeats in a **Column**.
3. No number repeats in a **Box**.

**Your Task:** Look at the grid. We use `0` to represent empty cells. How would a computer even begin to solve this? We'll use a technique called **Backtracking**.