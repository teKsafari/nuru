---
title: "Turning Left and Right"
task: "Draw a staircase with 3 steps. Each step: forward `50`, turn left `90`, forward `50`, turn right `90`."
---
The turtle can turn without walking. You tell it how many **degrees** to turn:

- `kobe.kushoto(90)` turns left a quarter turn.
- `kobe.kulia(90)` turns right a quarter turn.
- 180 degrees is a half turn, and 360 is a full turn.

```nuru
tumia kobe

kobe.mbele(100)
+++kobe.kushoto(90)+++
kobe.mbele(100)
```

This program draws a corner: a line to the right, then a line going up.

Imagine you are inside the turtle. "Left" means its own left, based on where it is facing right now.
