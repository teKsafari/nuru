---
title: "The Sudoku Challenge"
task: "Print the grid row by row, showing each `0` as `_` and putting a space after every number. The first row should be `1 _ 3 _`."
---
Welcome to the final challenge: a program that solves **Sudoku**.

A small Sudoku has a 4 by 4 grid. The goal is to fill the empty cells with the numbers 1 to 4 so that:

1. Every **row** contains 1, 2, 3 and 4 with no repeats.
2. Every **column** contains 1, 2, 3 and 4 with no repeats.
3. Every 2 by 2 **box** contains 1, 2, 3 and 4 with no repeats.

### Arrays inside arrays

We store the grid as an array of rows. Each row is an array of numbers. `0` means an empty cell.

```nuru
fanya gridi = [[1, 0], [0, 2]]
andika(gridi[0])    // [1, 0]: the first row
andika(gridi[1][1]) // 2: second row, second column
```

To visit every number, you need a loop **inside** a loop: the outer one goes through the rows, the inner one through the numbers of that row.
