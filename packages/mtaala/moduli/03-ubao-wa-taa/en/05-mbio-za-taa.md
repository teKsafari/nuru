---
title: "Running Lights"
task: "Make the light run from light `1` to `8`, then come back to light `1`. For each light: switch on, wait `100`, switch off. Use two `kwa` loops."
---
Have you seen decoration lights in a shop that seem to chase each other? The secret is simple: switch on one light, wait a little, switch it off, then move to the next one.

Going forward is easy with `mfululizo(1, 9)`. To go backwards, `mfululizo` accepts a third number: the **step**. A negative step counts down:

```nuru
andika(mfululizo(1, 9))        // [1, 2, 3, 4, 5, 6, 7, 8]
andika(mfululizo(5, 0, +++-1+++)) // [5, 4, 3, 2, 1]
```

The way back starts at 7, not 8, because light 8 already lit up at the end of the trip forward.
