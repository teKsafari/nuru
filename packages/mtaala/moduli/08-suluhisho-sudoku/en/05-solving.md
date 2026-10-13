---
title: "The Complete Solver"
task: "This new puzzle comes out wrong: look, the top-left box has two `1`s. Add a **2 by 2 box** check inside `ni_salama`, so that every box holds the numbers 1 to 4 with no repeats."
---
Run the program first. It says `Imetatuliwa!` (solved), but look at the top-left box: `1, 4` and `3, 1`. The number 1 appears twice! The program checks only rows and columns. It forgot the third rule.

### The corner of a box

A 4 by 4 grid has four 2 by 2 boxes. For any cell `(r, c)`, the top-left corner of its box is:

```nuru
fanya r0 = r +++- r % 2+++
fanya c0 = c +++- c % 2+++
```

For example, `(3, 2)` is in the box with corner `(2, 2)`, because `3 - 1 = 2` and `2 - 0 = 2`.

Then visit the four cells starting from that corner: `gridi[r0 + i][c0 + j]`, where `i` and `j` are 0 or 1. If any of them equals `n`, the number is not safe.

### Congratulations!

You have combined **arrays inside arrays**, **loops**, **conditions** and **recursion** to build a program that thinks. This backtracking method is used to plan exam timetables, find routes on maps, and even play bao and chess. You started with `andika("Habari Nuru!")`. Now you write programs that solve puzzles!
