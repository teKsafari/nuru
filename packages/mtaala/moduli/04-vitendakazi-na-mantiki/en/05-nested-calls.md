---
title: "One Function Calling Another"
task: "Inside `bei_ya_mwisho`, use `punguzo()` to get the discount, then return `bei` minus that discount."
---
A big problem becomes easy when you split it into small pieces. Each piece becomes its own function, and the functions call each other.

```nuru
fanya eneo = unda(urefu, upana) {
    rudisha urefu * upana
}

fanya bei_ya_shamba = unda(urefu, upana) {
    fanya mita = +++eneo(urefu, upana)+++
    rudisha mita * 2000
}

andika(bei_ya_shamba(20, 30)) // 1200000
```

`bei_ya_shamba` (price of the farm) neither knows nor cares how the area (`eneo`) is worked out. It trusts `eneo()`. If you find a mistake in the area calculation, you fix it in one place only.
