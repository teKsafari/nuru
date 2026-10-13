---
title: "Kujirudia na Orodha"
task: "Kamilisha `jumla` ili irudishe `orodha[i]` ikijumlishwa na jumla ya vitu vilivyobaki: `jumla(orodha, i + 1)`."
initialCode: |
  fanya jumla = unda(orodha, i = 0) {
      // Sharti la kusimama: tumefika mwisho wa orodha
      kama (i == orodha.idadi()) {
          rudisha 0
      }
      // Hatua ya kujirudia hapa
  }

  fanya mauzo = [1500, 2000, 500, 3000]
  andika("Mauzo ya leo:", jumla(mauzo))
solution: |
  fanya jumla = unda(orodha, i = 0) {
      // Sharti la kusimama: tumefika mwisho wa orodha
      kama (i == orodha.idadi()) {
          rudisha 0
      }
      rudisha orodha[i] + jumla(orodha, i + 1)
  }

  fanya mauzo = [1500, 2000, 500, 3000]
  andika("Mauzo ya leo:", jumla(mauzo))
tests:
  - type: match_code
    pattern: 'rudisha[^\n]*jumla\(\s*orodha\s*,\s*i\s*\+\s*1\s*\)'
    message: "Rudisha orodha[i] + jumla(orodha, i + 1)."
  - type: exact_output
    message: "Programu iandike: Mauzo ya leo: 7000"
---
Mama Asha anauza vitumbua sokoni. Anataka kujua jumla ya mauzo ya siku. Kujirudia kunaweza kujumlisha orodha bila kitanzi!

Tunatumia `i` kuonyesha tuko nafasi gani kwenye orodha:

1. **Sharti la kusimama**: kama `i` imefika mwisho wa orodha, hakuna kilichobaki. Jumla ni 0.
2. **Hatua ya kujirudia**: chukua kitu cha sasa, `orodha[i]`, ukijumlishe na jumla ya vilivyobaki.

```text
jumla([10, 20], 0)
= 10 + jumla([10, 20], 1)
= 10 + (20 + jumla([10, 20], 2))
= 10 + (20 + 0)
= 30
```

`i = 0` kwenye `unda(orodha, i = 0)` ni **thamani ya kawaida**: ukiita `jumla(mauzo)` bila `i`, Nuru inaanza na 0.
