---
title: "3. Return vs Print"
task: "Change `andika` to `rudisha` inside the `zidisha` function so the variable `jibu` can store the result."
initialCode: |
  fanya zidisha = unda(a, b) {
      // Fix this line!
      andika(a * b)
  }
  
  fanya jibu = zidisha(3, 4)
  andika("Jibu ni:", jibu) // Oh no! Jibu is empty (tupu)!
solution: |
  fanya zidisha = unda(a, b) {
      rudisha a * b
  }
  
  fanya jibu = zidisha(3, 4)
  andika("Jibu ni:", jibu)
---
A common mistake for beginners is confusing printing (`andika`) with returning (`rudisha`).

- **`andika`** is for **Humans**. It shows something on the screen so you can read it. The computer doesn't "remember" what was printed.
- **`rudisha`** is for the **Program**. It gives the result back so you can save it in a variable or use it in another calculation.

### Look at the difference:
```s
fanya kwa_binadamu = unda() {
    andika(10)
}

fanya kwa_programu = unda() {
    +++rudisha 10+++
}

fanya x = kwa_binadamu() // x is now 'tupu' (empty) because nothing was returned!
fanya y = kwa_programu() // y is now 10!
```

**Your Task:** Fix the `zidisha` function so that it returns the value instead of just printing it. This allows the `jibu` variable to actually hold the result.

```s
fanya zidisha = unda(a, b) {
    +++rudisha a * b+++
}
```