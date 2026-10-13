---
title: "Switching Off and Waiting"
task: "Make light number `1` blink `3` times. Each time: switch on, wait `200`, switch off, wait `200`. Use a `kwa` loop."
---
Run the starter program. Did you see the light come on? No! The computer is very fast: it switches the light on and off in a tiny fraction of a second.

That is why we need `ubao.subiri()` (wait). It pauses the program for a while, measured in **milliseconds**. One second is 1000 milliseconds.

```nuru
tumia ubao

ubao.washa(2)
+++ubao.subiri(500)+++  // half a second
ubao.zima(2)
```

A light that turns on and off again and again is called a **blink**. It is the very first program electronics engineers write when they get a new board.
