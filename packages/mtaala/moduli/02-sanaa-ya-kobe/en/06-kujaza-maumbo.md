---
title: "Filling Shapes with Colour"
task: "Draw a triangle with sides of `160` steps and fill it with `machungwa` (orange). Call `kobe.anza_kujaza()` before drawing and `kobe.maliza_kujaza()` after."
---
So far your shapes have been empty inside. The turtle can paint them too.

Three steps:

1. Pick the fill colour with `kobe.rangi_ya_ndani()`.
2. Call `kobe.anza_kujaza()` before you start drawing the shape.
3. Call `kobe.maliza_kujaza()` when the shape is complete. That is when the colour pours in.

```nuru
tumia kobe

kobe.rangi_ya_ndani("kijani")
+++kobe.anza_kujaza()+++
kwa i ktk mfululizo(4) {
    kobe.mbele(100)
    kobe.kushoto(90)
}
+++kobe.maliza_kujaza()+++
```

The pen colour (`kobe.rangi`) is for the outline. The fill colour (`kobe.rangi_ya_ndani`) is for the inside. You can use both together.
