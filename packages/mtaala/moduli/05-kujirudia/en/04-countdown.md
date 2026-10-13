---
title: "Countdown"
task: "Write a recursive function `hesabu_roketi(n)`: if `n == 0` it prints `Rusha roketi!`, otherwise it prints `n` and then calls itself with `n - 1`. Call it with `10`."
---
You now know the two parts of every recursive function:

1. **Base case**: when do I stop?
2. **Recursive step**: which smaller problem do I call myself with?

Think of a **Russian doll**: a doll inside a doll inside a doll. To find the smallest doll:

1. If this doll does not open, you have found it. (base case)
2. Otherwise, open it and repeat with the doll inside. (recursive step)

```nuru
fanya fungua_mdoli = unda(ukubwa) {
    kama (ukubwa == 1) {
        andika("Mdoli mdogo kabisa!")
        rudisha tupu
    }
    andika("Mdoli wa ukubwa", ukubwa)
    fungua_mdoli(ukubwa - 1)
}
```

This time you write the whole function yourself.
