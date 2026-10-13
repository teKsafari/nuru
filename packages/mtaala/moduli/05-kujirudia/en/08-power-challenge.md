---
title: "Challenge: Powers"
task: "Write a recursive function `peo(x, y)` that works out `x` to the power `y`. Base case: anything to the power `0` is `1`. Do not use `**`."
---
Time to test your skills!

A **power** (`kipeo`) multiplies a number by itself several times. `2` to the power `3` is `2 x 2 x 2 = 8`.

### Think recursively

- `2` to the power `3` is `2 x` (`2` to the power `2`)
- `2` to the power `2` is `2 x` (`2` to the power `1`)
- `2` to the power `1` is `2 x` (`2` to the power `0`)
- `2` to the power `0` is **1**. This is where we stop.

You need just two things: a base case that returns 1, and a step that lowers `y` by one on each call.

No code example this time. You have learned everything you need!
