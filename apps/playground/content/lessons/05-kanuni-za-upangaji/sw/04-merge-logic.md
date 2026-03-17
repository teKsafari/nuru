---
title: "4. Unganisho (The Merge)"
task: "Kamilisha kitendakazi cha `unganisha` ili kuunganisha orodha mbili zilizopangwa kuwa orodha moja kubwa iliyopangwa."
initialCode: |
  fanya unganisha = unda(a, b) {
      fanya matokeo = []
      
      // Endelea wakati orodha zote mbili zina vitu
      wakati (idadi(a) > 0 na idadi(b) > 0) {
          kama (a[0] < b[0]) {
              // Chukua ndogo kutoka 'a'
              matokeo = weka(matokeo, a[0])
              a = kata(a, 1)
          } sivyo {
              // Chukua ndogo kutoka 'b'
              // ?
          }
      }
      
      // Ongeza vitu vilivyobaki
      rudisha unganisha_orodha(matokeo, unganisha_orodha(a, b))
  }

  andika(unganisha([1, 5], [2, 10])) // Inapaswa kuwa [1, 2, 5, 10]
solution: |
  fanya unganisha = unda(a, b) {
      fanya matokeo = []
      wakati (idadi(a) > 0 na idadi(b) > 0) {
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

  andika(unganisha([1, 5], [2, 10]))
---
Baada ya kuigawanya orodha hadi ukubwa wa 1, tunahitaji kuziweka pamoja kwa mpangilio sahihi. Hii ndiyo hatua ya **Kuunganisha** (Merge).

### Jinsi inavyofanya kazi:
1. Angalia kitu cha kwanza cha orodha zote mbili.
2. Chagua kile kidogo zaidi na ukiweke kwenye orodha yetu ya `matokeo`.
3. Rudia hadi orodha moja iwe tupu!

**Kazi Yako:** Kamilisha kitalu cha `sivyo`. Ikiwa `b[0]` ni ndogo (au sawa) na `a[0]`, iongeze kwenye `matokeo` na uiondoe kwenye `b`. (Kumbuka: `weka` inaongeza kitu kwenye safu, na `unganisha_orodha` inaunganisha safu mbili).