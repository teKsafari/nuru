---
title: "The Endless Mirror"
task: "Run the program to see what happens. Then put `//` in front of the `kioo()` call **inside** the function, so it prints only once."
---
Have you ever stood between two mirrors facing each other? You see your picture inside your picture, inside your picture, without end.

A function can **call itself**. This is called **recursion** (`kujirudia`).

```nuru
fanya sema = unda() {
    andika("Habari!")
    +++sema()+++ // it calls itself
}
```

The danger: a function that calls itself with no rule for stopping calls itself again and again until the computer runs out of room to remember all the calls. The program crashes.

Do not be afraid to run the starter program. You will see an error, and that is the lesson: every recursive function needs a way to stop.
