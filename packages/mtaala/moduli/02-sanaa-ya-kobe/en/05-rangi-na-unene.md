---
title: "Colour and Thickness"
task: "Draw a `150`-step square with a pen thickness of `6`. Give each side its own colour: `kijani`, `njano`, `nyeusi`, `bluu`, like the flag of Tanzania."
---
The turtle's pen starts out black and thin. You can change both:

```nuru
tumia kobe

kobe.+++rangi("nyekundu")+++
kobe.+++unene(8)+++
kobe.mbele(120)
```

Colours you can use by name: `nyeusi` (black), `nyeupe` (white), `nyekundu` (red), `kijani` (green), `bluu` (blue), `samawati` (sky blue), `njano` (yellow), `machungwa` (orange), `zambarau` (purple), `waridi` (pink), `kahawia` (brown), `kijivu` (grey), `dhahabu` (gold), `fedha` (silver). You can also use a colour code like `"#1eb53a"`.

### Looping over a list of colours

A `kwa` loop can go through a list of words, not only numbers:

```nuru
kwa r ktk ["nyekundu", "njano", "kijani"] {
    kobe.rangi(r)
    kobe.mbele(60)
}
```
