---
title: "All the Lights"
task: "Switch on the lights one by one from `1` to `8` with a loop, waiting `100` between each light. At the end, switch them all off with `ubao.zima_zote()`."
---
Writing `ubao.washa()` eight times is boring. A loop can do it for you, because the light number can be a variable:

```nuru
tumia ubao

kwa taa ktk mfululizo(1, 5) {
    ubao.washa(+++taa+++)
}
```

This example switches on lights 1, 2, 3 and 4. Remember: `mfululizo(1, 5)` stops before 5.

There are shortcuts too:

- `ubao.washa_zote()` switches on all 8 lights.
- `ubao.zima_zote()` switches off all 8 lights.
