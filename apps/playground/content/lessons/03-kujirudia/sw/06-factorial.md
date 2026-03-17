---
title: "6. Hesabu na Kujirudia: Factorial"
task: "Kamilisha kitendakazi `factorial`. Zidisha `n` kwa matokeo ya `factorial(n - 1)`."
initialCode: |
  // Factorial inaandikwa kama n! 
  // 5! = 5 * 4 * 3 * 2 * 1
  
  fanya factorial = unda(n) {
      // Kesi ya Msingi: 1! ni 1 tu
      kama (n <= 1) {
          rudisha 1
      }
      
      // Hatua ya Kujirudia: n * (n-1)!
      rudisha // Tunahitaji n izidishwe na factorial(n - 1)
  }

  andika("5! ni:", factorial(5)) // Inapaswa kuwa 120
solution: |
  fanya factorial = unda(n) {
      kama (n <= 1) {
          rudisha 1
      }
      rudisha n * factorial(n - 1)
  }

  andika("5! ni:", factorial(5))
---
Kujirudia ni kuzuri sana kwa hesabu za kihisabati.

**Factorial** (iliyoandikwa kama `n!`) inamaanisha kuzidisha namba kwa kila namba nzima iliyo chini yake. Kwa mfano, `5! = 5 * 4 * 3 * 2 * 1 = 120`.

### Mfumo Wake:
Angalia jinsi `5!` ilivyo sawa na `5 * 4!`.
Na `4!` ni sawa na `4 * 3!`.
Huu ni mfumo bora wa kujirudia!

### Mfano:
```s
fanya fact = unda(n) {
    kama (n == 1) { rudisha 1 }
    rudisha n * fact(n - 1)
}
```

**Kazi Yako:** Kamilisha kitendakazi cha `factorial`. Tumia `rudisha` kurudisha namba ya sasa `n` ikizidishwa na matokeo ya kitendakazi kikiwa kimejiita chenyewe kwa `n - 1`.