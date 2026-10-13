---
title: "Challenge: Binary Numbers"
task: "Count from `0` to `15` in binary on the lights. Light `8` is the last digit (1), light `7` is 2, light `6` is 4, and so on. For each number, go through the lights from `8` back to `1` as in the starter code, then wait `100`."
---
A computer does not understand the number 7 the way we write it. Inside it are billions of tiny switches, each one **on (1)** or **off (0)**. This is called **binary**.

In binary, each place is worth twice the place to its right:

```text
Light  1    2   3   4   5  6  7  8
-----  ---  --  --  --  -  -  -  -
Value  128  64  32  16  8  4  2  1
```

The number 5 is `4 + 1`, so lights 6 and 8 are on: `00000101`.

### Finding binary digits

1. `x % 2` gives you the last digit: 0 or 1.
2. `(x - baki) / 2` removes that digit, leaving the rest.
3. Repeat until you have gone through all 8 lights.

```nuru
fanya x = 6
andika(x % 2)   // 0: light 8 is off
x = (x - 0) / 2 // x is now 3
andika(x % 2)   // 1: light 7 is on
```

When you finish, try counting up to 255. All 8 lights will be on at the end!
