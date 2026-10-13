---
title: "Changamoto: Kipeo"
task: "Andika kitendakazi kinachojirudia `peo(x, y)` kinachohesabu `x` kipeo `y`. Sharti la kusimama: kipeo `0` ni `1`. Usitumie `**`."
initialCode: |
  fanya peo = unda(x, y) {
      // Andika hapa
  }

  andika("2 kipeo 3 ni", peo(2, 3))
  andika("5 kipeo 2 ni", peo(5, 2))
  andika("2 kipeo 10 ni", peo(2, 10))
solution: |
  fanya peo = unda(x, y) {
      kama (y == 0) {
          rudisha 1
      }
      rudisha x * peo(x, y - 1)
  }

  andika("2 kipeo 3 ni", peo(2, 3))
  andika("5 kipeo 2 ni", peo(5, 2))
  andika("2 kipeo 10 ni", peo(2, 10))
tests:
  - type: match_code
    pattern: 'rudisha[^\n]*peo\('
    message: "peo ijiite yenyewe: rudisha x * peo(x, y - 1)."
  - type: match_code
    pattern: '^(?![\s\S]*\*\*)'
    message: "Usitumie **. Jenga kipeo kwa kujirudia."
  - type: exact_output
    message: "2 kipeo 3 ni 8, 5 kipeo 2 ni 25, na 2 kipeo 10 ni 1024."
---
Wakati wa kupima ujuzi wako!

**Kipeo** ni kuzidisha namba kwa yenyewe mara kadhaa. `2` kipeo `3` ni `2 x 2 x 2 = 8`.

### Fikiria kwa kujirudia

- `2` kipeo `3` ni `2 x` (`2` kipeo `2`)
- `2` kipeo `2` ni `2 x` (`2` kipeo `1`)
- `2` kipeo `1` ni `2 x` (`2` kipeo `0`)
- `2` kipeo `0` ni **1**. Hapa ndipo tunasimama.

Unahitaji vitu viwili tu: sharti la kusimama linalorudisha 1, na hatua inayopunguza `y` kwa moja kila mwito.

Hakuna mfano wa kodi safari hii. Umeshajifunza yote unayohitaji!
