---
title: "Mstari wa Kwanza"
task: "Mwambie kobe atembee mbele hatua `150`. Atachora mstari unapopita."
initialCode: |
  tumia kobe

  // Andika amri yako hapa chini
solution: |
  tumia kobe

  kobe.mbele(150)
tests:
  - type: match_code
    pattern: 'kobe\.mbele\('
    message: "Tumia kobe.mbele() kumsogeza kobe."
  - type: kobe_picha
    message: "Mstari wako bado haufanani na unaotakiwa: kobe aende mbele hatua 150."
---
Kutana na **kobe**! Ni mchoraji mdogo anayeishi katikati ya turubai. Ana kalamu mkiani: kila anapotembea, anachora mstari.

Kwanza unamleta kobe kwenye programu yako kwa `tumia kobe`. Kisha unampa amri:

```nuru
tumia kobe

kobe.+++mbele(100)+++
```

`kobe.mbele(100)` maana yake ni "tembea mbele hatua 100". Hatua moja ni sawa na pikseli moja kwenye turubai.

Mwanzoni kobe anatazama **kulia** (mashariki). Ndiyo sababu mstari wako wa kwanza utaenda kulia.

Ukitaka arudi kinyumenyume, tumia `kobe.nyuma(50)`.
