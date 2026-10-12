---
title: "6. Kwa nini Merge Sort?"
task: "Endesha kodi kuona jinsi Merge Sort inavyoshughulikia orodha ya vitu 100."
initialCode: |
  // Kisaidizi cha kukata orodha (Helper to slice arrays)
  fanya kata = unda(orodha, anza, mwisho = -1) {
      kama (mwisho == -1) { mwisho = orodha.idadi() }
      fanya mpya = []
      kwa i, t ktk orodha { kama (i >= anza && i < mwisho) { mpya.sukuma(t) } }
      rudisha mpya
  }


  // Hebu tutengeneze orodha kubwa ya namba 100
  fanya orodha_kubwa = []
  fanya i = 100
  wakati (i > 0) {
      orodha_kubwa.sukuma(i)
      i = i - 1
  }

  // Tumia Merge Sort tuliyojenga!
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

  andika("Inapanga vitu 100...")
solution: |
  // Kisaidizi cha kukata orodha (Helper to slice arrays)
  fanya kata = unda(orodha, anza, mwisho = -1) {
      kama (mwisho == -1) { mwisho = orodha.idadi() }
      fanya mpya = []
      kwa i, t ktk orodha { kama (i >= anza && i < mwisho) { mpya.sukuma(t) } }
      rudisha mpya
  }


  fanya orodha_kubwa = []
  fanya i = 100
  wakati (i > 0) {
      orodha_kubwa.sukuma(i)
      i = i - 1
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

  andika("Inapanga vitu 100...")
  andika(panga(orodha_kubwa))
---
Kwa nini tulifanya kazi hii yote? Kwa nini tusitumie tu kitanzi (loop) rahisi?

Kuna njia nyingi za kupanga, kama **Bubble Sort**. Lakini Bubble Sort ni polepole—orodha ikiwa kubwa mara 10 zaidi, inachukua muda mrefu mara 100!

**Merge Sort** ina ufanisi zaidi. Kwa sababu kila wakati inagawanya tatizo nusu, ina kasi ya ajabu hata kwa mamilioni ya vitu. Katika sayansi ya kompyuta, tunaita hii ufanisi wa $O(N \log N)$.

### Hongera sana!
Sasa unaelewa:
1. **Kugawanya Tatizo:** Kuvunja matatizo makubwa kuwa vipande vidogo na rahisi zaidi.
2. **Mantiki ya Kuunganisha:** Kuchanganya matokeo kwa mpangilio sahihi.
3. **Ufanisi wa Algorithmic:** Kwa nini jinsi tunavyoandika kodi ni muhimu kwa kasi ya programu.

**Kazi Yako:** Endesha kodi na utazame inavyopanga namba 100 bila shida. Umetoka tu kutekeleza algorithm ya kupanga ya kiwango cha juu!

```nuru
andika("Inapanga vitu 100...")
+++andika(panga(orodha_kubwa))+++
```