---
title: "2. Kesi ya Msingi (Base Case)"
task: "Ongeza sentensi ya `kama` (if) ili kuangalia ikiwa `n <= 0`. Ikiwa ndivyo, `rudisha tupu` ili kusimamisha kujirudia."
initialCode: |
  fanya hesabu = unda(n) {
      // 1. Ongeza Kesi ya Msingi hapa!
      // kama (n <= 0) {
      //     andika("Imekamilika!")
      //     ?
      // }

      andika(n)
      hesabu(n) // Hii bado haina mwisho! Tutailekebisha ijayo.
  }

  // hesabu(5)
solution: |
  fanya hesabu = unda(n) {
      kama (n <= 0) {
          andika("Imekamilika!")
          rudisha tupu
      }

      andika(n)
      hesabu(n)
  }
---
Ili kusimamisha kitendakazi kinachojirudia kisiharibike, lazima tukipe sharti la kusimama. Tunaita hii **Kesi ya Msingi** (Base Case).

Kesi ya Msingi ni sentensi tu ya `kama` (if) inayosema: "Ikiwa tumefikia lengo letu, SIMAMISHA kuita kitendakazi na `rudisha` mara moja."

### Inavyoonekana:
```s
fanya simama_kwenye_sifuri = unda(n) {
    kama (n == 0) {
        rudisha // SIMAMA HAPA
    }
    // ... kodi nyingine
}
```

Bila Kesi ya Msingi, kujirudia kunakuwa kitanzi kibaya kisicho na mwisho.

**Kazi Yako:** Ongeza Kesi ya Msingi kwa kuandika +++rudisha tupu+++ mahali pa `?` na uondoe alama za `//` kwenye sentensi hiyo ya `kama`. Pia, uondoe alama ya `//` kwenye +++hesabu(5)+++ chini kabisa ili kuijaribu!