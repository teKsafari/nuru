---
title: "Star"
task: "Draw a 5-pointed star. Each point: forward `200` steps, then turn right `144` degrees. Use a loop."
---
A star is a polygon with a trick. Instead of getting back to the start after one full turn, the turtle goes round **twice**.

For a 5-pointed star, the total turning is `2 x 360 = 720`. Divide by 5 and you get **144** degrees for each point.

```nuru
tumia kobe

// A 7-pointed star goes round 3 times: 3 x 360 / 7
kwa i ktk mfululizo(7) {
    kobe.mbele(180)
    kobe.kulia(+++3 * 360 / 7+++)
}
```

When you are done, fill your star with colour using what you learned in the lesson on filling shapes.
