---
title: "rudisha or andika?"
task: "Change `andika` to `rudisha` inside `zidisha`, so that `jibu` gets a real value."
---
Run the starter program. You see `12` and then `Jibu ni: null`. What happened?

- **`andika`** (print) is for **people**. It shows something on the screen, and that is all.
- **`rudisha`** (return) is for **the program**. It hands the answer back to whoever called the function, so they can store it or use it in another calculation.

```nuru
fanya mara_mbili = unda(n) {
    +++rudisha n * 2+++
}

fanya x = mara_mbili(5)
andika(x + 1) // 11
```

A function that returns nothing returns `tupu` (null). That is why `jibu` was empty.
