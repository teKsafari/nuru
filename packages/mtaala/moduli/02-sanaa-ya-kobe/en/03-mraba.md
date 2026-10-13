---
title: "Square"
task: "Draw a square with sides of `120` steps, turning **left** `90` degrees at each corner. Use a `kwa` loop that repeats 4 times."
---
A square has 4 equal sides and 4 corners of 90 degrees. For each side, the turtle does two things: it walks, then it turns.

You could write those commands four times. But you already know a better way: a **loop**.

```nuru
tumia kobe

+++kwa i ktk mfululizo(3)+++ {
    kobe.mbele(80)
    kobe.kulia(90)
}
```

This example draws only 3 sides of a square. When the turtle turns 90 degrees 4 times, it has turned 360 degrees and ends up where it started, facing the same way.
