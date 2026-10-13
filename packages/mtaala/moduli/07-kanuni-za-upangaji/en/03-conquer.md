---
title: "Split All the Way Down"
task: "The function `gawanya` recurses forever. Add a base case after `andika(orodha)`: if the list has one item or fewer, `rudisha tupu`."
---
How far do we split? Until every piece has **one item**.

A list with one item **is already sorted**! Is `[5]` sorted? Yes. There is nothing to sort. This is our base case.

```text
           [38, 27, 43, 3]
           /             \
      [38, 27]         [43, 3]
       /    \           /    \
    [38]   [27]      [43]    [3]
```

The function `gawanya` (split) calls itself **twice**, like Fibonacci: once for the left half and once for the right half.

The helper `kata(orodha, anza, mwisho)` returns a copy of part of the list. `kata([10, 20, 30, 40], 1, 3)` is `[20, 30]`. If you leave out `mwisho`, it goes to the end of the list.
