---
title: "The Score Screen"
task: "Build a football scoreboard. For each goal from `1` to `3`: write `Magoli: ` and the number of goals on the screen, switch on the light with that goal's number, sound the buzzer at `880` for `100`, then wait `200`."
---
The board has a small screen with 2 lines of 16 characters each. It is like the screens on prepaid electricity (LUKU) machines or petrol pumps.

```nuru
tumia ubao

ubao.+++skrini("Habari Tanzania!")+++
```

Every time you call `ubao.skrini()`, the new text replaces the old.

### Joining text and numbers

`+` can join two pieces of text. To join text with a number, first turn the number into text with `tungo()`:

```nuru
fanya dakika = 90
ubao.skrini("Dakika " + +++tungo(dakika)+++)
```
