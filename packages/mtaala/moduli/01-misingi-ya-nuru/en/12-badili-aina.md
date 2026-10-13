---
title: "Converting Data Types"
task: "The program asks for the price of one mango. Use `namba()` to turn the answer into a number, then print the price of 3 mangoes."
---
Run the program as it is and type `500`. The answer is `500500500`, not `1500`!

That happens because `jaza()` returns **text**. In Nuru, text times 3 is the same text repeated three times.

To do arithmetic, convert the text into a number first:

- `namba()` turns text into a whole number. Example: `namba("42")` is `42`
- `desimali()` turns text into a decimal. Example: `desimali("2.5")` is `2.5`
- `tungo()` turns anything into text. Example: `tungo(42)` is `"42"`

```nuru
fanya umri = jaza("Una miaka mingapi? ")
andika("Mwakani utakuwa na miaka", +++namba(umri)+++ + 1)
```
