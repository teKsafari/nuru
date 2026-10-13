---
title: "Functions as Arguments"
task: "Pass the function `shangilia` into `rudia_mara` so that it cheers `3` times. Remember: when you pass a function, do not put `()` after its name."
---
In Nuru, a function is a value just like a number or a piece of text. You can store it in a variable, or pass it as an argument to another function.

```nuru
fanya piga_kelele = unda() {
    andika("Aaah!")
}

fanya endesha = unda(f) {
    f() // calls the function that was passed in
}

endesha(+++piga_kelele+++) // Aaah!
```

Notice this important difference:

- `piga_kelele` is **the function itself**: you hand it over as it is.
- `piga_kelele()` **calls it right now** and uses its answer.

A function that takes another function is called a **higher-order function**.
