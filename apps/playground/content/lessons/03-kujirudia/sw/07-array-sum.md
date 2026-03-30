---
title: "7. Kujirudia na Safu (Arrays)"
task: "Kamilisha kitendakazi `jumla` ili kirudishe `orodha[i] + jumla(orodha, i + 1)`."
initialCode: |
  fanya jumla = unda(orodha, i=0) {
      // Kesi ya Msingi: Tumefika mwisho wa safu
      kama (i == orodha.idadi()) {
          rudisha 0
      }
      
      // Hatua ya Kujirudia: Kitu cha sasa + jumla ya vilivyosalia
      rudisha // weka mantiki hapa
  }

  andika(jumla([10, 20, 30])) // Inapaswa kuwa 60
solution: |
  fanya jumla = unda(orodha, i=0) {
      kama (i == orodha.idadi()) {
          rudisha 0
      }
      rudisha orodha[i] + jumla(orodha, i + 1)
  }

  andika(jumla([10, 20, 30]))
---
Unaweza kutumia kujirudia kuchakata orodha za data!

Ikiwa unataka kupata jumla ya namba zote kwenye safu (array), tunaweza kupitisha namba `i` inayoonyesha tupo wapi.

### Mantiki ya Kujirudia:
1. **Kesi ya Msingi:** Ikiwa `i` inafika mwisho wa safu (`orodha.idadi()`), jumla ni 0.
2. **Hatua ya Kujirudia:** Chukua namba ya sasa (`orodha[i]`), na uijumlishe kwa jumla ya *safu iliyosalia* (`jumla(orodha, i + 1)`).

### Kuiona Kimantiki:
`jumla([10, 20], 0)`
- `10 + jumla([10, 20], 1)`
- `10 + (20 + jumla([10, 20], 2))`
- `10 + (20 + 0)` = **30**

**Kazi Yako:** Kamilisha mantiki ya `jumla`. Rudisha thamani ya kitu cha sasa kwenye orodha (`orodha[i]`) jumlisha matokeo ya kuita `jumla` kwenye orodha iliyosalia (`jumla(orodha, i + 1)`).
