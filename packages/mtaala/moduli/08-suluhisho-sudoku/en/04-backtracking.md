---
title: "Backtracking: Try, Then Step Back"
task: "The program fails to solve the puzzle because it never erases failed attempts. Add `gridi[r][c] = 0` where shown, so it tries the next number."
---
**Backtracking** is like finding your way through a forest:

1. You reach a fork and choose one path.
2. If you hit a dead end, you **step back** to the last fork and try another path.

In Sudoku, the function `tatua` (solve):

1. Finds the first empty cell.
2. Tries the numbers 1 to 4. For each safe number, it places it and calls **itself** to solve the remaining cells.
3. If that call returns `kweli` (true), the puzzle is solved!
4. If it returns `sikweli` (false), that number led to a dead end. We **erase it** and try the next one.
5. If no number fits, we return `sikweli` so that the previous cell tries another number.

Without step 4, the failed number stays in the grid. `ni_salama` sees it and later rejects the correct number. That is why the starter program prints `Imeshindikana.` (failed).
