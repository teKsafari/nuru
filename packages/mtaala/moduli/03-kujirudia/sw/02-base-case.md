---
title: "2. Sharti la Kusimama (Base Case)"
task: "Ongeza kauli ya `kama` (if) ili kuangalia ikiwa `n <= 0`. Ikiwa ni hivyo, `rudisha tupu` ili kusitisha mchakato wa kujirudia."
initialCode: |
  fanya hesabu = unda(n) {
      andika(n)
      hesabu(n)
  }
solution: |
  fanya hesabu = unda(n) {
      kama (n <= 0) {
          andika("Imekamilika!")
          rudisha tupu
      }

      andika(n)
      hesabu(n)
  }

  hesabu(5)
---
Ili kuzuia kitendakazi kinachojirudia kisisababishe kosa, lazima tukiishe sharti la kusimama. Tunaita hii **Sharti la Kusimama** (Base Case).

Sharti la Kusimama ni kauli rahisi ya `kama` inayosema: "Ikiwa tumefikia lengo letu, SIMAMA na `rudisha` (return) mara moja."

### Inavyoonekana:
```s
fanya simama_kwenye_sifuri = unda(n) {
    kama (n == 0) {
        rudisha // SIMAMA HAPA
    }
    // ... kodi nyingine
}
```

Bila Sharti la Kusimama, kujirudia ni kitanzi kisicho na mwisho chenye madhara.

**Kazi Yako:** Ongeza Sharti la Kusimama na uite kitendakazi ukitumia `5` ili kukijaribu.

```nuru
fanya hesabu = unda(n) {
    +++kama (n <= 0) {
        andika("Imekamilika!")
        rudisha tupu
    }+++

    andika(n)
    hesabu(n)
}

+++hesabu(5)+++
```
