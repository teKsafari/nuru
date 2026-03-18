---
title: "8. Changamoto: Kitendakazi cha Peo (Power)"
task: "Andika kitendakazi kinachojirudia `peo(x, y)` kinachokokotoa 'x kwa peo ya y' (x^y)."
initialCode: |
  fanya peo = unda(x, y) {
      // Kesi ya Msingi: Namba yoyote kwa peo ya 0 ni 1.
      kama (y == 0) {
          // ?
      }
      
      // Hatua ya kujirudia: Zidisha x kwa peo ya (x, y - 1)
      rudisha // ?
  }

  andika("2^3 ni:", peo(2, 3)) // Inapaswa kuwa 8 (2 * 2 * 2)
  andika("5^2 ni:", peo(5, 2)) // Inapaswa kuwa 25 (5 * 5)
solution: |
  fanya peo = unda(x, y) {
      kama (y == 0) {
          rudisha 1
      }
      rudisha x * peo(x, y - 1)
  }

  andika("2^3 ni:", peo(2, 3))
  andika("5^2 ni:", peo(5, 2))
---
Hebu tupime ujuzi wako wa kujirudia!

Unahitaji kuandika kitendakazi kinachokokotoa vipeo, kama $x^y$ (x kwa peo ya y).
Kwa mfano, `2^3` ni `2 * 2 * 2`.

### Mantiki Yake:
Fikiria hivi: $2^3$ ni sawa na $2 * 2^2$.
Na $2^2$ ni sawa na $2 * 2^1$.
Na $2^0$ kila wakati ni **1**. Hii ndiyo Kesi yako ya Msingi!

### Kidokezo cha Mwisho:
Daima hakikisha unabadilisha hoja katika kila hatua (mfano, `y - 1`) ili hatimaye ufikie Kesi ya Msingi (`y == 0`).

**Kazi Yako:** Kamilisha kitendakazi. Je, unaweza kuifanya kompyuta ipige hesabu ya vipeo kwa kutumia kujirudia?