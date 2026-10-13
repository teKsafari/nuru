---
title: "Recursion with Arrays"
task: "Finish `jumla` so that it returns `orodha[i]` added to the sum of the remaining items: `jumla(orodha, i + 1)`."
---
Mama Asha sells vitumbua (rice cakes) at the market. She wants the total of the day's sales. Recursion can add up an array without a loop!

We use `i` to track our position in the array:

1. **Base case**: if `i` has reached the end of the array, nothing is left. The sum is 0.
2. **Recursive step**: take the current item, `orodha[i]`, and add it to the sum of the rest.

```text
jumla([10, 20], 0)
= 10 + jumla([10, 20], 1)
= 10 + (20 + jumla([10, 20], 2))
= 10 + (20 + 0)
= 30
```

`i = 0` in `unda(orodha, i = 0)` is a **default value**: if you call `jumla(mauzo)` without `i`, Nuru starts at 0.
