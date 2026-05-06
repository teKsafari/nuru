---
title: "4. Kuhesabu Kurudi Nyuma"
task: "Jaribu kubadilisha `hesabu(5)` kuwa `hesabu(10)` na utazame mwendo mzima wa kuhesabu kurudi nyuma."
initialCode: |
  fanya hesabu = unda(n) {
      // Kesi ya Msingi
      kama (n <= 0) {
          andika("Tayari!")
          rudisha tupu
      }
      
      andika(n)
      
      // Hatua ya Kujirudia
      hesabu(n - 1)
  }

  hesabu(5)
solution: |
  fanya hesabu = unda(n) {
      kama (n <= 0) {
          andika("Tayari!")
          rudisha tupu
      }
      andika(n)
      hesabu(n - 1)
  }
  hesabu(10)
---
Umeweza! Umejenga kitendakazi chako cha kwanza kinachofanya kazi kikamilifu kwa kujirudia.

Kitendakazi kinachojirudia kila wakati kina sehemu kuu mbili:
1. **Kesi ya Msingi:** Nasimama lini? (`kama (n <= 0)`)
2. **Hatua ya Kujirudia:** Nakaribiaje kusimama? (`hesabu(n - 1)`)

### Mfano wa Kifikra:
Fikiria boksi lililo ndani ya boksi lingine. Ili kupata zawadi iliyo katikati, unapaswa:
1. Kufungua boksi la sasa.
2. Ikiwa ndilo boksi la mwisho kabisa lenye zawadi (**Kesi ya Msingi**), unachukua zawadi.
3. Ikiwa sivyo, unafungua boksi lingine dogo zaidi lililo ndani (**Hatua ya Kujirudia**).

**Kazi Yako:** Pima nguvu ya kitendakazi chako! Badilisha namba ya kuanzia kwa kuandika +++hesabu(10)+++ chini kabisa. Angalia jinsi kodi ile ile ndogo inavyoweza kufanya kazi kubwa zaidi sasa.