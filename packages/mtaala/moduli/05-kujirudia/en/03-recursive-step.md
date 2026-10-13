---
title: "The Recursive Step"
task: "`witi` should print the even numbers from `10` down to `2`. Fix the recursive call so that each call lowers `n` by `2`."
---
A base case alone is not enough. If every call passes the same `n`, we will never reach it!

The **recursive step** is where the function calls itself on a **slightly smaller** problem than the current one. Each step moves us closer to the base case.

```nuru
fanya panda_ngazi = unda(vidato) {
    kama (vidato <= 0) {
        andika("Nimefika juu!")
        rudisha tupu
    }
    andika("Vidato vimebaki:", vidato)
    panda_ngazi(+++vidato - 1+++)
}
```

Think it through: `witi(10)` calls `witi(8)`, which calls `witi(6)`... until `witi(0)`, where the base case says: enough.
