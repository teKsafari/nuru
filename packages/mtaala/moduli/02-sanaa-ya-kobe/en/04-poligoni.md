---
title: "Triangles and Polygons"
task: "Draw a hexagon (a shape with 6 sides) with sides of `80` steps. Use `kwa` and turn **left** `360 / 6` degrees at each corner."
---
The turtle's secret rule: to get back to where it started, it must turn **360 degrees in total**.

So for a shape with `n` equal sides, each corner is `360 / n`:

- triangle: 3 sides, turn 120 degrees
- square: 4 sides, turn 90 degrees
- pentagon: 5 sides, turn 72 degrees
- hexagon: 6 sides, turn 60 degrees

```nuru
tumia kobe

// Triangle
kwa i ktk mfululizo(3) {
    kobe.mbele(150)
    kobe.kushoto(+++360 / 3+++)
}
```

If you keep the number of sides in a variable, you change the shape by changing one number. Try 12 or 36 sides later. What do you see?
