---
title: "The Tree of Calls"
task: "Call `fibo(5)` on the `jibu` line, then run the program. Count how many times `fibo` is called just to get one number."
---
A function that calls itself twice builds a **tree of calls**. Every call spawns two new calls:

```text
                fibo(4)
              /         \
         fibo(3)        fibo(2)
         /     \        /     \
    fibo(2)  fibo(1) fibo(1) fibo(0)
    /     \
fibo(1) fibo(0)
```

Look: `fibo(2)` is computed **twice**. The computer does not remember that it already found that answer, so it redoes all the work.

### Why a dictionary?

We want to count calls inside the function. But remember the lesson on scope: Nuru does not let a function change an outside variable. The dictionary (`kamusi`) `miito` is different: we change what is stored inside it, `miito["idadi"]`, not the variable itself.
