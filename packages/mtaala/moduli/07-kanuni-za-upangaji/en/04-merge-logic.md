---
title: "Merging"
task: "Finish the `sivyo` (else) part of `unganisha`: instead of `vunja`, push `b[j]` onto `matokeo` and increase `j` by 1."
---
Now we have small sorted pieces. How do we merge them into one sorted list?

Imagine two piles of exam papers, each pile already sorted by mark. To merge them:

1. Compare the top papers of both piles.
2. Take the one with the lower mark and put it on a new pile.
3. Repeat until one pile runs out.
4. The papers left in the other pile are already sorted. Put them all at the end.

`i` shows where we are in `a`, and `j` where we are in `b`:

```text
a = [3, 27, 38]    b = [9, 10, 43, 82]
     i                  j
3 <= 9, so we take 3 and move i
```

In the starter code, `vunja` (break) stops the loop so it does not spin forever. Your job is to put the right code in its place.
