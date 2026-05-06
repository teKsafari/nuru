---
title: "4. Unganisho (The Merge)"
task: "Kamilisha kitendakazi cha `unganisha` ili kuunganisha orodha mbili zilizopangwa kuwa orodha moja kubwa iliyopangwa."
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
      
      // Endelea wakati orodha zote mbili zina vitu
      wakati (a.idadi() > 0 && b.idadi() > 0) {
          kama (a[0] < b[0]) {
              // Chukua ndogo kutoka 'a'
              matokeo.sukuma(a[0])
              a = kata(a, 1)
          } sivyo {
              // Chukua ndogo kutoka 'b'
              // ?
          }
      }
      
      // Ongeza vitu vilivyobaki
      rudisha matokeo + a + b
  }

  andika(unganisha([1, 5], [2, 10])) // Inapaswa kuwa [1, 2, 5, 10]
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

  andika(unganisha([1, 5], [2, 10]))
---
Baada ya kuigawanya orodha hadi ukubwa wa 1, tunahitaji kuziweka pamoja kwa mpangilio sahihi. Hii ndiyo hatua ya **Kuunganisha** (Merge).

### Jinsi inavyofanya kazi:
1. Angalia kitu cha kwanza cha orodha zote mbili.
2. Chagua kile kidogo zaidi na ukiweke kwenye orodha yetu ya `matokeo`.
3. Rudia hadi orodha moja iwe tupu!

**Kazi Yako:** Kamilisha kizuizi cha `sivyo`. Ikiwa `b[0]` ni ndogo kuliko (au sawa na) `a[0]`, iongeze kwenye `matokeo` na uiondoe kwenye `b`. (Kumbuka: `.sukuma()` huongeza kitu kwenye safu, na `+` huunganisha safu mbili).

```nuru
sivyo {
    +++matokeo.sukuma(b[0])+++
    +++b = kata(b, 1)+++
}
```