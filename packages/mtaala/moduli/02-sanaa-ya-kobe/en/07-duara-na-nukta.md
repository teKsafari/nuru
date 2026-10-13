---
title: "Circles and Dots"
task: "Make a necklace of 5 beads. Each bead is `kobe.duara(20)` with a `kobe.nukta()` in the middle. Between beads, lift the pen and move forward `60` steps."
---
`kobe.duara(r)` draws a circle with **the turtle at its centre**. The number `r` is the radius: the distance from the centre to the edge.

`kobe.nukta()` puts a dot where the turtle is standing. For a bigger dot, give it a size: `kobe.nukta(16)`.

```nuru
tumia kobe

kobe.+++duara(80)+++   // face
kobe.+++nukta(20)+++   // nose
```

### Moving without drawing

- `kobe.kalamu_juu()` lifts the pen. When the turtle walks now, it does not draw.
- `kobe.kalamu_chini()` puts the pen down again.
- `kobe.nenda(x, y)` sends the turtle straight to a point. The centre of the canvas is `(0, 0)`, and a negative `x` is to the left.
