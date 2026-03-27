---
title: "2. Kugawanya Tatizo"
task: "Tumia kitanzi cha `kwa` kugawanya `orodha` katika sehemu mbili sawa: `kushoto` na `kulia`."
initialCode: |
  fanya orodha = [1, 2, 3, 4, 5, 6]
  
  fanya katikati = orodha.idadi() / 2
  
  fanya kushoto = []
  fanya kulia = []
  
  // Tumia kitanzi cha kwa kuweka vitu kushoto au kulia
  kwa i, namba ktk orodha {
      // weka mantiki hapa: kama i < katikati ...
  }
  
  andika("Kushoto:", kushoto)
  andika("Kulia:", kulia)
solution: |
  fanya orodha = [1, 2, 3, 4, 5, 6]
  fanya katikati = orodha.idadi() / 2
  
  fanya kushoto = []
  fanya kulia = []
  
  kwa i, namba ktk orodha {
      kama (i < katikati) {
          kushoto.sukuma(namba)
      } sivyo {
          kulia.sukuma(namba)
      }
  }
  
  andika("Kushoto:", kushoto)
  andika("Kulia:", kulia)
---
**Merge Sort** inatumia mkakati wa **kugawanya tatizo** katika sehemu ndogo.

Badala ya kujaribu kupanga orodha kubwa yote kwa mara moja, tunaigawanya katika orodha mbili ndogo. Ni rahisi zaidi kupanga vitu viwili vidogo kuliko kitu kimoja kikubwa!

### Mgawanyo:
Tunatafuta namba ya katikati na kuikata safu (array) nusu kwa kutumia kitanzi cha `kwa`.

**Kazi Yako:** Tumia kitanzi cha `kwa` kugawanya orodha katikati.
- Ikiwa `i` ni chini ya `katikati`, sukuma namba kwenye `kushoto`.
- Vinginevyo, isukume kwenye `kulia`.