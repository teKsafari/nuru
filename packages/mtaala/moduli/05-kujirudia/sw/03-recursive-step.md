---
title: "Hatua ya Kujirudia"
task: "`witi` inapaswa kuandika namba witi kuanzia `10` kushuka hadi `2`. Rekebisha mwito wa kujirudia ili kila mwito upunguze `n` kwa `2`."
initialCode: |
  fanya witi = unda(n) {
      kama (n <= 0) {
          rudisha tupu
      }
      andika(n)
      witi(n)
  }

  witi(10)
solution: |
  fanya witi = unda(n) {
      kama (n <= 0) {
          rudisha tupu
      }
      andika(n)
      witi(n - 2)
  }

  witi(10)
tests:
  - type: match_code
    pattern: 'witi\(\s*n\s*-\s*2\s*\)'
    message: "Mwito wa ndani uwe witi(n - 2)."
  - type: exact_output
    message: "Programu iandike 10, 8, 6, 4, 2, kila moja mstari wake."
---
Sharti la kusimama peke yake halitoshi. Kama kila mwito unapitisha `n` ileile, hatutawahi kulifikia!

**Hatua ya kujirudia** ni sehemu ambapo kitendakazi kinajiita kwa tatizo **dogo kidogo** kuliko la sasa. Kila hatua inatusogeza karibu na sharti la kusimama.

```nuru
fanya panda_ngazi = unda(vidato) {
    kama (vidato <= 0) {
        andika("Nimefika juu!")
        rudisha tupu
    }
    andika("Vidato vimebaki:", vidato)
    panda_ngazi(+++vidato - 1+++)
}
```

Fikiria: `witi(10)` inaita `witi(8)`, ambayo inaita `witi(6)`... mpaka `witi(0)`, ambapo sharti la kusimama linasema: inatosha.
