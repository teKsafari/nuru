---
title: "Pembetatu na Poligoni"
task: "Chora pembesita (umbo lenye pande 6) yenye pande za hatua `80`. Tumia `kwa` na ugeuke **kushoto** digrii `360 / 6` kila kona."
initialCode: |
  tumia kobe

  fanya pande = 6
solution: |
  tumia kobe

  fanya pande = 6
  kwa i ktk mfululizo(pande) {
      kobe.mbele(80)
      kobe.kushoto(360 / pande)
  }
tests:
  - type: match_code
    pattern: 'kwa\s+\w+\s+ktk'
    message: "Tumia kitanzi cha kwa."
  - type: match_code
    pattern: '360\s*/'
    message: "Hesabu pembe kwa 360 / idadi ya pande, badala ya kuandika namba moja kwa moja."
  - type: kobe_picha
    message: "Umbo lako halifanani na pembesita inayotakiwa: pande 6 za hatua 80."
---
Kanuni ya siri ya kobe: ili kurudi alipoanzia, lazima ageuke **digrii 360 kwa jumla**.

Hivyo kwa umbo lenye pande `n` zinazolingana, kila kona ni `360 / n`:

- pembetatu: pande 3, geuka digrii 120
- mraba: pande 4, geuka digrii 90
- pembetano: pande 5, geuka digrii 72
- pembesita: pande 6, geuka digrii 60

```nuru
tumia kobe

// Pembetatu
kwa i ktk mfululizo(3) {
    kobe.mbele(150)
    kobe.kushoto(+++360 / 3+++)
}
```

Ukiweka idadi ya pande kwenye kibadilika, unabadilisha umbo kwa kubadilisha namba moja tu. Jaribu pande 12 au 36 baadaye. Unaona nini?
