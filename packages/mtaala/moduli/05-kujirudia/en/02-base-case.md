---
title: "The Base Case"
task: "Add a base case at the start of `hesabu`: if `n == 0`, print `Tayari!` and then `rudisha tupu`."
---
A recursive function needs a **base case** (`sharti la kusimama`). It is a simple question asked on every call: "Have I reached the end?"

```nuru
fanya fungua_zawadi = unda(masanduku) {
    +++kama (masanduku == 0) {
        andika("Zawadi imepatikana!")
        rudisha tupu
    }+++
    andika("Nafungua sanduku. Yamebaki", masanduku - 1)
    fungua_zawadi(masanduku - 1)
}

fungua_zawadi(3)
```

`rudisha tupu` ends the function without returning any answer. Each call lowers the number by one, so we finally reach 0 and stop.
