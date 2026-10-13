---
title: "Traffic Lights"
task: "Build traffic lights with lights 1, 2 and 3. Colour them `nyekundu` (red), `njano` (yellow) and `kijani` (green). Then: red comes on, followed by green, then yellow, then red again. Wait `200` between steps, and keep only one light on at a time."
---
At a road junction, traffic lights keep cars and daladalas from crashing into each other. Inside every traffic light pole is a small program that works like the one you are about to write.

First, choose each light's colour with `ubao.rangi(number, colour)`:

```nuru
tumia ubao

ubao.+++rangi(1, "zambarau")+++
ubao.washa(1)
```

The traffic light order is:

1. **Red**: stop.
2. **Green**: go.
3. **Yellow**: get ready to stop.
4. Then red again, and the cycle continues.

Only one light is on at a time. So before you switch on the next light, switch off the one that was on.
