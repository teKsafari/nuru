---
title: "Functions That Return Functions"
task: "Use `tengeneza_salamu` to make a function `salamu_asubuhi` with the greeting `\"Habari za asubuhi\"`. Then call it with the names `\"Juma\"` and `\"Rehema\"`."
---
A function can **return** another function. It is like a factory that builds machines.

```nuru
fanya tengeneza_kizidishi = unda(n) {
    rudisha unda(x) {
        rudisha x * +++n+++
    }
}

fanya mara_tatu = tengeneza_kizidishi(3)
fanya mara_kumi = tengeneza_kizidishi(10)

andika(mara_tatu(5))  // 15
andika(mara_kumi(5))  // 50
```

Here is the surprise: `tengeneza_kizidishi` has already finished, yet the inner function still **remembers** `n`. This is called a **closure**: a function carries the surroundings it was born in.
