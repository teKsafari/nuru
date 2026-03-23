---
title: "7. Kujirudia na Safu (Arrays)"
task: "Kamilisha kitendakazi `jumla` ili kirudishe `orodha[0] + jumla(orodha_mpya)`."
initialCode: |
  fanya jumla = unda(orodha) {
      // Kesi ya Msingi: Safu tupu
      kama (idadi(orodha) == 0) {
          rudisha 0
      }
      
      // Pata vitu vyote ISIPOKUWA cha kwanza
      fanya orodha_mpya = kata(orodha, 1)
      
      // Hatua ya Kujirudia: Kitu cha kwanza + jumla ya vilivyosalia
      rudisha // weka mantiki hapa
  }

  andika(jumla([10, 20, 30])) // Inapaswa kuwa 60
solution: |
  fanya jumla = unda(orodha) {
      kama (idadi(orodha) == 0) {
          rudisha 0
      }
      fanya orodha_mpya = kata(orodha, 1)
      rudisha orodha[0] + jumla(orodha_mpya)
  }

  andika(jumla([10, 20, 30]))
---
Unaweza kutumia kujirudia kuchakata orodha za data!

Ikiwa unataka kupata jumla ya namba zote kwenye safu (array), mantiki ya kujirudia ni:
1. **Kesi ya Msingi:** Ikiwa safu ni tupu, jumla ni 0.
2. **Hatua ya Kujirudia:** Chukua namba ya kwanza, na uijumlishe kwa jumla ya *safu iliyosalia*.

### Kuiona Kimantiki:
`jumla([1, 2, 3])`
- `1 + jumla([2, 3])`
- `1 + (2 + jumla([3]))`
- `1 + (2 + (3 + jumla([])))`
- `1 + (2 + (3 + 0))` = **6**

### Zana ya Ndani:
Tunatumia kitendakazi cha asili `kata(orodha, 1)` kupata safu mpya ambayo inakosa kitu cha kwanza.

**Kazi Yako:** Kamilisha mantiki ya `jumla`. Rudisha thamani ya kitu cha kwanza kwenye orodha (`orodha[0]`) jumlisha matokeo ya kuita `jumla` kwenye orodha iliyosalia.