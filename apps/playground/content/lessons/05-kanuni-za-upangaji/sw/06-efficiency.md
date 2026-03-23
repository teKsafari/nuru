---
title: "6. Kwa nini Merge Sort?"
task: "Endesha kodi kuona jinsi Merge Sort inavyoshughulikia orodha ya vitu 100."
initialCode: |
  // Hebu tutengeneze orodha kubwa ya namba 100
  fanya orodha_kubwa = []
  fanya i = 100
  wakati (i > 0) {
      orodha_kubwa = weka(orodha_kubwa, i)
      i = i - 1
  }

  // Tumia Merge Sort tuliyojenga!
  fanya unganisha = unda(a, b) {
      fanya matokeo = []
      wakati (idadi(a) > 0 && idadi(b) > 0) {
          kama (a[0] < b[0]) {
              matokeo = weka(matokeo, a[0])
              a = kata(a, 1)
          } sivyo {
              matokeo = weka(matokeo, b[0])
              b = kata(b, 1)
          }
      }
      rudisha unganisha_orodha(matokeo, unganisha_orodha(a, b))
  }

  fanya panga = unda(orodha) {
      kama (idadi(orodha) <= 1) { rudisha orodha }
      fanya kati = idadi(orodha) / 2
      fanya kushoto = panga(kata(orodha, 0, kati))
      fanya kulia = panga(kata(orodha, kati))
      rudisha unganisha(kushoto, kulia)
  }

  andika("Inapanga vitu 100...")
  andika(panga(orodha_kubwa))
solution: |
  andika("Sawa!")
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