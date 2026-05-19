---
title: "2. Hatua ya Kuanzia (Kesi za Msingi)"
task: "Ongeza sentensi mbili za `kama` (if) ili kurudisha `n` ikiwa `n == 0` au `n == 1`."
initialCode: |
  fanya fibo = unda(n) {
      // 1. Kesi ya Msingi kwa 0: Ikiwa n ni 0, rudisha 0
      // kama (n == 0) { rudisha 0 }
      
      // 2. Kesi ya Msingi kwa 1: Ikiwa n ni 1, rudisha 1
      // kama (n == 1) { rudisha 1 }
      
      rudisha // bado tunaifanyia kazi...
  }

  andika("fibo(0) ni:", fibo(0))
  andika("fibo(1) ni:", fibo(1))
solution: |
  fanya fibo = unda(n) {
      kama (n == 0) {
          rudisha 0
      }
      kama (n == 1) {
          rudisha 1
      }
      rudisha n
  }

  andika("fibo(0) ni:", fibo(0))
  andika("fibo(1) ni:", fibo(1))
---
Kumbuka: Kitendakazi kinachojirudia kinahitaji **Kesi ya Msingi** ili kukizuia kisijirudie milele.

Kwa Fibonacci, tunahitaji **Kesi mbili za Msingi** kwa sababu hesabu hiyo kila wakati inategemea namba *mbili* zilizotangulia. Tukifika mwanzoni kabisa (0 au 1), hatuwezi kuangalia nyuma zaidi.

### Sheria:
- Fibonacci ya 0 ni **0**.
- Fibonacci ya 1 ni **1**.

**Kazi Yako:** Kamilisha kesi za msingi kwa kitendakazi cha `fibo` ili kiweze kurudisha 0 na 1 kwa usahihi.

```nuru
fanya fibo = unda(n) {
    +++kama (n == 0) { rudisha 0 }+++
    +++kama (n == 1) { rudisha 1 }+++
    
    rudisha // ...
}
```