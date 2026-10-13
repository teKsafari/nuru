---
title: "Passing Arguments"
task: "Finish `karibu` so that it prints `Karibu,` followed by the name passed in as an argument."
---
A machine that does the same thing every time is not very useful. **Arguments** (`hoja`) let you send information into a function each time you call it.

```nuru
fanya bei_ya_jumla = unda(+++bei, idadi+++) {
    andika("Jumla ni shilingi", bei * idadi)
}

bei_ya_jumla(500, 4)  // Jumla ni shilingi 2000
bei_ya_jumla(1200, 2) // Jumla ni shilingi 2400
```

When you write `unda(bei, idadi)`, the names `bei` (price) and `idadi` (quantity) are like empty slots. When you call `bei_ya_jumla(500, 4)`, Nuru puts `500` into `bei` and `4` into `idadi`, in the same order.
