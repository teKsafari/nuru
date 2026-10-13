---
title: "The kwa Loop"
task: "Use a `kwa` loop to print the 3 times table from `3 x 1 = 3` to `3 x 10 = 30`."
---
Imagine writing `andika()` a hundred times. Boring! A loop repeats the same work for you.

`kwa` goes through every item in an array, one after another:

```nuru
fanya wachezaji = ["Samatta", "Msuva", "Kapombe"]

+++kwa mchezaji ktk wachezaji+++ {
    andika("Karibu uwanjani,", mchezaji)
}
```

`ktk` is short for "katika" (in). On each round, `mchezaji` takes the next name.

### mfululizo()

`mfululizo()` builds an array of numbers for a loop:

- `mfululizo(5)` is `[0, 1, 2, 3, 4]`
- `mfululizo(1, 6)` is `[1, 2, 3, 4, 5]` (the last number is not included)

```nuru
kwa i ktk +++mfululizo(1, 6)+++ {
    andika("Mzunguko", i)
}
```
