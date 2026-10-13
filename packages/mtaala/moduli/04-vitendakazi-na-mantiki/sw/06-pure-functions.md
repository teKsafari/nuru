---
title: "Vitendakazi Safi"
task: "Andika upya `ongeza_kodi` iwe kitendakazi safi: ipokee hoja `bei` na irudishe bei pamoja na kodi ya asilimia 18 (`bei * 118 / 100`). Usiandike chochote ndani yake."
initialCode: |
  fanya bei = 1000

  // Si safi: inategemea kibadilika cha nje na inaandika badala ya kurudisha
  fanya ongeza_kodi = unda() {
      andika(bei * 118 / 100)
  }

  andika(ongeza_kodi(1000))
  andika(ongeza_kodi(2500))
solution: |
  fanya ongeza_kodi = unda(bei) {
      rudisha bei * 118 / 100
  }

  andika(ongeza_kodi(1000))
  andika(ongeza_kodi(2500))
tests:
  - type: match_code
    pattern: 'ongeza_kodi\s*=\s*unda\(\s*\w+\s*\)\s*\{\s*rudisha'
    message: "ongeza_kodi ipokee hoja moja na irudishe jibu moja kwa moja kwa rudisha."
  - type: exact_output
    message: "ongeza_kodi(1000) iwe 1180 na ongeza_kodi(2500) iwe 2950."
---
**Kitendakazi safi** kina sifa mbili:

1. Ukikipa hoja zilezile, kinarudisha jibu lilelile **kila mara**.
2. Hakigusi kitu chochote nje yake: hakiandiki kwenye skrini, hakibadili orodha za nje.

```nuru
// Safi: kinategemea hoja zake tu
fanya eneo_la_mraba = +++unda(upande) {
    rudisha upande * upande
}+++

// Si safi: kinategemea kibadilika cha nje
fanya upande = 5
fanya eneo_baya = unda() {
    rudisha upande * upande
}
```

Kwa nini ujali? Kitendakazi safi ni rahisi kukijaribu na kukiamini. Ukijua `eneo_la_mraba(5)` ni 25 leo, utajua ni 25 kesho pia, popote kwenye programu yako.
