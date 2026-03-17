---
title: "2. Kugawanya Tatizo"
task: "Tumia kitendakazi cha `kata` kugawanya `orodha` katika sehemu mbili sawa: `kushoto` na `kulia`."
initialCode: |
  fanya orodha = [1, 2, 3, 4, 5, 6]
  
  fanya katikati = idadi(orodha) / 2
  
  // Tumia kata(orodha, mwanzo, mwisho)
  fanya kushoto = // kata orodha kuanzia 0 hadi katikati
  fanya kulia = // kata orodha kuanzia katikati hadi mwisho
  
  andika("Kushoto:", kushoto)
  andika("Kulia:", kulia)
solution: |
  fanya orodha = [1, 2, 3, 4, 5, 6]
  fanya katikati = idadi(orodha) / 2
  
  fanya kushoto = kata(orodha, 0, katikati)
  fanya kulia = kata(orodha, katikati)
  
  andika("Kushoto:", kushoto)
  andika("Kulia:", kulia)
---
**Merge Sort** inatumia mkakati wa **kugawanya tatizo** katika sehemu ndogo.

Badala ya kujaribu kupanga orodha kubwa yote kwa mara moja, tunaigawanya katika orodha mbili ndogo. Ni rahisi zaidi kupanga vitu viwili vidogo kuliko kitu kimoja kikubwa!

### Mgawanyo:
Tunatafuta namba ya katikati na kuikata safu (array) nusu.

**Kazi Yako:** Tumia kitendakazi cha `kata` kugawanya orodha katikati.
- `kata(orodha, 0, katikati)` inapata nusu ya kwanza.
- `kata(orodha, katikati)` inapata nusu iliyobaki. (Je, ulijua ukiacha namba ya mwisho, inaenda hadi mwisho wa orodha?)