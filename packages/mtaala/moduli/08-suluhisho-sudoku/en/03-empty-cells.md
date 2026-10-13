---
title: "Finding an Empty Cell"
task: "Finish `pata_tupu`: when you find a cell containing `0`, return its position as the array `[r, c]`. If there are no empty cells, the function returns `tupu`."
---
Our program will solve the puzzle one cell at a time. First it needs to know: where is the next empty cell?

We go through the grid the way you read a book: the first row from left to right, then the next row. The first `0` we meet is our next job.

### Returning two things

A function returns only one thing. But we can return an **array** with two things inside it:

```nuru
fanya mahali_pa_shule = unda() {
    +++rudisha [3, 7]+++
}

fanya mahali = mahali_pa_shule()
andika("Mtaa", mahali[0], "nyumba", mahali[1])
```

### Why `tupu`?

If there is no `0` anywhere, that means **the puzzle is solved**! `tupu` is the signal for "no work left". Nuru prints it as `null`.
