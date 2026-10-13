---
title: "The wakati Loop"
task: "Kick-off is near! Use a `wakati` loop to count down from `5` to `1`, then print `Mpira umeanza!`."
---
`wakati` (while) repeats its work **as long as** a condition is true. Before every round, the computer checks the condition again.

```nuru
fanya maji = 0

+++wakati (maji < 3)+++ {
    andika("Naweka ndoo ya maji")
    +++maji = maji + 1+++
}
andika("Pipa limejaa!")
```

The line `maji = maji + 1` matters a lot. Without it, `maji` stays 0 forever and the loop never stops. If that happens, press the **Stop** button.

Use `kwa` when you know the number of rounds in advance. Use `wakati` when you are waiting for something to happen.
