---
title: "Mini Project: Calculator"
task: "Finish `kikokotozi` so that it handles `\"toa\"` (subtract), `\"zidisha\"` (multiply) and `\"gawanya\"` (divide). When dividing by zero, return the text `Huwezi kugawanya kwa sifuri`. Use `kama` and `au kama`."
---
Well done for getting this far! You can now create functions, pass arguments, return answers and split work into small functions. Let's build something real: a **calculator** (`kikokotozi`).

The calculator takes two numbers and the name of an operation (`tendo`). `kama` and `au kama` pick the right calculation:

```nuru
kama (tendo == "jumla") {
    rudisha a + b
} +++au kama (tendo == "toa") {
    rudisha a - b
}+++
```

### Do not forget errors

A good program does not break when the user makes a mistake. Dividing by zero has no answer in arithmetic, so your calculator should give a friendly message instead.

Remember that `rudisha` ends the function immediately. Code below a `rudisha` does not run.
