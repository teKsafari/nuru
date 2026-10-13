---
title: "Gawanya Mpaka Mwisho"
task: "Kitendakazi `gawanya` kinajirudia milele. Ongeza sharti la kusimama baada ya `andika(orodha)`: kama orodha ina kitu kimoja au pungufu, `rudisha tupu`."
initialCode: |
  // Kisaidizi: nakala ya sehemu ya orodha, kuanzia nafasi anza hadi kabla ya mwisho
  fanya kata = unda(orodha, anza, mwisho = -1) {
      kama (mwisho == -1) { mwisho = orodha.idadi() }
      fanya mpya = []
      kwa i, t ktk orodha {
          kama (i >= anza && i < mwisho) { mpya.sukuma(t) }
      }
      rudisha mpya
  }

  fanya gawanya = unda(orodha) {
      andika(orodha)
      // Sharti la kusimama hapa

      fanya kati = orodha.idadi() / 2
      gawanya(kata(orodha, 0, kati))
      gawanya(kata(orodha, kati))
  }

  gawanya([38, 27, 43, 3])
solution: |
  // Kisaidizi: nakala ya sehemu ya orodha, kuanzia nafasi anza hadi kabla ya mwisho
  fanya kata = unda(orodha, anza, mwisho = -1) {
      kama (mwisho == -1) { mwisho = orodha.idadi() }
      fanya mpya = []
      kwa i, t ktk orodha {
          kama (i >= anza && i < mwisho) { mpya.sukuma(t) }
      }
      rudisha mpya
  }

  fanya gawanya = unda(orodha) {
      andika(orodha)
      kama (orodha.idadi() <= 1) {
          rudisha tupu
      }
      fanya kati = orodha.idadi() / 2
      gawanya(kata(orodha, 0, kati))
      gawanya(kata(orodha, kati))
  }

  gawanya([38, 27, 43, 3])
tests:
  - type: match_code
    pattern: 'kama\s*\(\s*orodha\.idadi\(\)\s*(<=\s*1|<\s*2|==\s*1)\s*\)'
    message: "Ongeza kama (orodha.idadi() <= 1) { rudisha tupu }."
  - type: exact_output
    message: "Programu iandike vipande vyote: [38, 27, 43, 3], [38, 27], [38], [27], [43, 3], [43], [3]."
---
Tutagawanya mpaka lini? Mpaka kila kipande kiwe na **kitu kimoja**.

Orodha yenye kitu kimoja **tayari imepangwa**! Je, `[5]` imepangwa? Ndiyo. Hakuna cha kupanga. Hili ndilo sharti letu la kusimama.

```text
           [38, 27, 43, 3]
           /             \
      [38, 27]         [43, 3]
       /    \           /    \
    [38]   [27]      [43]    [3]
```

Kitendakazi `gawanya` kinajiita **mara mbili**, kama Fibonacci: mara moja kwa nusu ya kushoto, na mara moja kwa nusu ya kulia.

Kisaidizi `kata(orodha, anza, mwisho)` kinarudisha nakala ya sehemu ya orodha. `kata([10, 20, 30, 40], 1, 3)` ni `[20, 30]`. Ukiacha `mwisho`, kinaenda hadi mwisho wa orodha.
