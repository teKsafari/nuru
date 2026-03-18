---
title: "3. Kujumlisha Yaliyopita (Recursive Step)"
task: "Kamilisha kitendakazi cha `fibo` kwa kurudisha jumla ya `fibo(n-1)` na `fibo(n-2)`."
initialCode: |
  fanya fibo = unda(n) {
      kama (n <= 1) {
          rudisha n
      }
      
      // Hatua ya Kujirudia: Jumlisha namba mbili za Fibonacci zilizopita
      rudisha // fibo(n-1) + fibo(n-2)
  }

  andika("Fibonacci ya 5 ni:", fibo(5)) // Inapaswa kuwa 5
  andika("Fibonacci ya 6 ni:", fibo(6)) // Inapaswa kuwa 8
solution: |
  fanya fibo = unda(n) {
      kama (n <= 1) {
          rudisha n
      }
      rudisha fibo(n - 1) + fibo(n - 2)
  }

  andika("Fibonacci ya 5 ni:", fibo(5))
  andika("Fibonacci ya 6 ni:", fibo(6))
---
Sasa kwa maajabu yenyewe! Ili kupata namba yoyote ya Fibonacci, kompyuta inahitaji tu kuuliza: "Ni namba gani mbili zilizo nyuma yangu?"

### Hatua ya Kujirudia:
Katika Nuru, tunaandika hivi:
`rudisha fibo(n - 1) + fibo(n - 2)`

### Jinsi kompyuta inavyoiona:
Ukiomba `fibo(2)`:
1. Inaita `fibo(1)` (ambayo inarudisha 1).
2. Inaita `fibo(0)` (ambayo inarudisha 0).
3. Inazijumlisha: `1 + 0 = 1`.

**Kazi Yako:** Kamilisha hatua ya kujirudia! Fanya kitendakazi kijiite mara mbili ili kupata jumla ya namba mbili zilizopita.