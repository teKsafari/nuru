---
title: "Variable Scope"
task: "The program tries to print `jumla` outside the function and gets an error. Fix it: make `hesabu_jumla` return `jumla`, then store the answer in a variable outside and print it."
---
**Scope** is the area where a variable can be seen.

- A variable you create **inside** a function lives only there. When the function ends, the variable disappears.
- A variable from **outside** can be read inside a function.

```nuru
fanya kodi = 18 // outside

fanya hesabu = unda() {
    +++fanya siri = 1234+++ // inside
    andika(siri, kodi)  // both are visible here
}

hesabu()
andika(siri) // ERROR: there is no siri out here
```

### Nuru protects outside variables

If you write `kodi = 20` inside a function, Nuru creates a new `kodi` inside it. The outside one stays 18. This stops one function from accidentally damaging the data of the whole program.

So there is one correct way to get an answer out of a function: **`rudisha`**.
