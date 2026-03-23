---
title: "5. Merge Sort Kamili"
task: "Unganisha kila kitu! Ita `panga` kwa kujirudia kwenye nusu zote mbili, kisha `unganisha` matokeo."
initialCode: |
  // Kisaidizi cha kukata orodha (Helper to slice arrays)
  fanya kata = unda(orodha, anza, mwisho = -1) {
      kama (mwisho == -1) { mwisho = orodha.idadi() }
      fanya mpya = []
      kwa i, t ktk orodha { kama (i >= anza && i < mwisho) { mpya.sukuma(t) } }
      rudisha mpya
  }


  fanya unganisha = unda(a, b) {
      fanya matokeo = []
      wakati (a.idadi() > 0 && b.idadi() > 0) {
          kama (a[0] < b[0]) {
              matokeo.sukuma(a[0])
              a = kata(a, 1)
          } sivyo {
              matokeo.sukuma(b[0])
              b = kata(b, 1)
          }
      }
      rudisha matokeo + a + b
  }

  fanya panga = unda(orodha) {
      kama (orodha.idadi() <= 1) { rudisha orodha }

      fanya kati = orodha.idadi() / 2
      
      // 1. Wito wa kujirudia: Panga kila nusu
      fanya kushoto = // panga nusu ya kushoto
      fanya kulia = // panga nusu ya kulia

      // 2. Unganisha nusu zilizopangwa pamoja
      rudisha unganisha(kushoto, kulia)
  }

  andika(panga([38, 27, 43, 3, 9, 82, 10]))
solution: |
  // Kisaidizi cha kukata orodha (Helper to slice arrays)
  fanya kata = unda(orodha, anza, mwisho = -1) {
      kama (mwisho == -1) { mwisho = orodha.idadi() }
      fanya mpya = []
      kwa i, t ktk orodha { kama (i >= anza && i < mwisho) { mpya.sukuma(t) } }
      rudisha mpya
  }


  fanya unganisha = unda(a, b) {
      fanya matokeo = []
      wakati (a.idadi() > 0 && b.idadi() > 0) {
          kama (a[0] < b[0]) {
              matokeo.sukuma(a[0])
              a = kata(a, 1)
          } sivyo {
              matokeo.sukuma(b[0])
              b = kata(b, 1)
          }
      }
      rudisha matokeo + a + b
  }

  fanya panga = unda(orodha) {
      kama (orodha.idadi() <= 1) { rudisha orodha }
      fanya kati = orodha.idadi() / 2
      fanya kushoto = panga(kata(orodha, 0, kati))
      fanya kulia = panga(kata(orodha, kati))
      rudisha unganisha(kushoto, kulia)
  }

  andika(panga([38, 27, 43, 3, 9, 82, 10]))
---
Ni wakati wa kuweka vipande vyote pamoja katika moja ya algorithms maarufu zaidi katika historia!

### Mzunguko Kamili:
1. **Kesi ya Msingi:** Ikiwa ukubwa wa orodha $\le 1$, irudishe.
2. **Gawanya:** Kata orodha nusu.
3. **Jirudie:** Ita `panga` kwenye nusu ya kushoto. Ita `panga` kwenye nusu ya kulia.
4. **Unganisha:** Tumia kitendakazi chetu cha `unganisha` kuunganisha nusu hizo mbili ambazo sasa zimepangwa.

**Kazi Yako:** Jaza wito wa kujirudia. Lazima uite `panga` kwa `kata(orodha, 0, kati)` na `panga` kwa `kata(orodha, kati)`.

Je, si jambo la kushangaza? Kitendakazi kinapanga nusu kwa kujiita *chenyewe*! Huu ndio nguvu halisi ya kujirudia.