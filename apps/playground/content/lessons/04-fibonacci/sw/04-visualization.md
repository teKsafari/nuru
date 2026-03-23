---
title: "4. Mti wa Wito (Tree of Calls)"
task: "Endesha kodi na utazame ni mara ngapi `fibo` inaitwa ili tu kupata namba ya 5."
initialCode: |
  fanya hesabu = 0

  fanya fibo = unda(n) {
      hesabu = hesabu + 1
      andika("Nimeitwa kwa n =", n)

      kama (n <= 1) {
          rudisha n
      }
      rudisha fibo(n - 1) + fibo(n - 2)
  }

  fanya jibu = fibo(5)
  andika("------------------")
  andika("Jibu ni:", jibu)
  andika("Jumla ya mara zilizoitwa:", hesabu)
solution: |
  fanya hesabu = 0

  fanya fibo = unda(n) {
      hesabu = hesabu + 1
      andika("Nimeitwa kwa n =", n)

      kama (n <= 1) {
          rudisha n
      }
      rudisha fibo(n - 1) + fibo(n - 2)
  }

  fanya jibu = fibo(5)
  andika("------------------")
  andika("Jibu ni:", jibu)
  andika("Jumla ya mara zilizoitwa:", hesabu)
---
Wakati kitendakazi kinapojiita mara mbili, kinatengeneza kile kinachoitwa **Mti wa Wito** (Tree of Calls).

Ili kupata `fibo(5)`, kompyuta haifanyi hatua 5 tu. Inaita kitendakazi mara **15**!

### Kwa nini?
- `fibo(5)` inaita `fibo(4)` na `fibo(3)`.
- `fibo(4)` inaita `fibo(3)` na `fibo(2)`.
- Angalia jinsi `fibo(3)` inavyokokotolewa mara mbili? Kadiri `n` inavyokuwa kubwa, kompyuta inaanza kurudia kazi ile ile mara nyingi sana.

**Kazi Yako:** Endesha kodi na utazame matokeo. Je, unaamini ilichukua wito 15 kwa namba 5 tu? Fikiria itachukua ngapi kwa namba 30!