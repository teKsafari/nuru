---
title: "Arrays (orodha)"
task: "Create an array `matunda` holding `\"embe\"` and `\"ndizi\"`. Add `\"nanasi\"` with `sukuma()`, then print the whole array and the number of fruits."
---
An array (`orodha`) keeps many items inside one variable. You write it with square brackets `[ ]` and separate the items with commas:

```nuru
fanya timu = ["Simba", "Yanga", "Azam"]
andika(timu[0]) // Simba
andika(timu[2]) // Azam
```

Each item has a position. The first position is **0**, not 1.

### Array methods

- `orodha.idadi()` returns the number of items.
- `orodha.sukuma(kitu)` adds an item at the end.

```nuru
fanya timu = ["Simba", "Yanga"]
timu.+++sukuma("Azam")+++
andika(timu.+++idadi()+++) // 3
```
