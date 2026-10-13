---
title: "Is It Safe?"
task: "Finish `ni_salama`: after checking the row, check the **column** too. If `gridi[i][safu]` equals `namba` for any `i`, return `sikweli`."
---
Before placing a number in a cell, we must make sure it causes no clash. We call this **validation**.

For the cell in row `m` and column `s`:

- In **row** `m`, the numbers are `gridi[m][0]`, `gridi[m][1]`, `gridi[m][2]`, `gridi[m][3]`. The column position changes.
- In **column** `s`, the numbers are `gridi[0][s]`, `gridi[1][s]`, `gridi[2][s]`, `gridi[3][s]`. The row position changes.

```text
     column 1
         v
    [1, _, 3, _]  <- row 0
    [_, _, 2, 1]
    [_, 1, _, 2]
    [2, 4, _, 3]
```

In cell `[0, 1]`: row 0 has 1 and 3, column 1 has 1 and 4. So the only safe number is 2.

`rudisha sikweli` inside a loop ends the function immediately. Once we find one clash, there is no need to keep checking.
