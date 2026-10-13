---
title: "Buzzer and Melody"
task: "Play all 8 notes in the `noti` list with `ubao.kengele(sauti, 150)`. While each note sounds, switch on the light matching its position (first note light 1, and so on), then switch it off when the note ends."
---
`ubao.kengele(sauti, muda)` sounds the buzzer. It takes two things:

- **sauti** (pitch): vibrations per second (Hz). A bigger number is a higher sound, a smaller number a deeper one.
- **muda** (duration): how many milliseconds the buzzer sounds.

```nuru
tumia ubao

ubao.kengele(+++440+++, 300) // the note A
ubao.kengele(+++880+++, 300) // a higher A
```

The program waits for the buzzer to finish before moving on, so you do not need `subiri` between notes.

### A loop with positions

A `kwa` loop can give you the **position** of each item as well as the item itself:

```nuru
kwa nafasi, tunda ktk ["embe", "papai"] {
    andika(nafasi, tunda) // 0 embe, then 1 papai
}
```

Positions start at 0, but lights start at 1. So each note's light is `nafasi + 1`.
