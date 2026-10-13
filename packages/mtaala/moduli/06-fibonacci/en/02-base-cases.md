---
title: "Two Base Cases"
task: "Add two base cases to `fibo`: if `n == 0` return `0`, and if `n == 1` return `1`."
---
We want a function `fibo(n)` that returns the number at position `n` in the sequence. We count positions from 0:

```text
n        0  1  2  3  4  5  6
-------  -  -  -  -  -  -  -
fibo(n)  0  1  1  2  3  5  8
```

Every number depends on the **two** before it. But the first two numbers have no two numbers before them! So they need **two base cases**: we already know them, no calculation needed.

```nuru
fanya siku_ya_wiki = unda(n) {
    +++kama (n == 1) {
        rudisha "Jumatatu"
    }+++
    +++kama (n == 2) {
        rudisha "Jumanne"
    }+++
    rudisha "Siku nyingine"
}
```

Each `kama` that returns an answer stops the function right away.
