---
title: "Vitendakazi (unda)"
task: "Kamilisha kitendakazi `jumla` ili kirudishe jumla ya `a` na `b` kwa kutumia `rudisha`."
initialCode: |
  fanya jumla = unda(a, b) {
      // Andika kodi yako hapa
  }

  andika(jumla(5, 7))
  andika(jumla(1500, 800))
solution: |
  fanya jumla = unda(a, b) {
      rudisha a + b
  }

  andika(jumla(5, 7))
  andika(jumla(1500, 800))
tests:
  - type: match_code
    pattern: 'rudisha\s+\S'
    message: "Tumia rudisha kurudisha jibu kutoka kwenye kitendakazi."
  - type: exact_output
    message: "jumla(5, 7) inapaswa kuwa 12 na jumla(1500, 800) iwe 2300."
---
Kitendakazi ni kipande cha kodi chenye jina. Unakiandika mara moja, kisha unakiita kila unapokihitaji.

Unatengeneza kitendakazi kwa neno `unda`. Vitu vilivyo ndani ya mabano ni **hoja**: thamani unazokipa kitendakazi kila unapokiita.

```nuru
fanya mraba = +++unda(n)+++ {
    +++rudisha n * n+++
}

andika(mraba(5))  // 25
andika(mraba(12)) // 144
```

`rudisha` inamaliza kitendakazi na kurudisha jibu kwa aliyekiita. Jibu hilo unaweza kuliandika, kulihifadhi kwenye kibadilika, au kulitumia kwenye hesabu nyingine.

### Kwa nini vitendakazi?
1. Unaepuka kuandika kodi ileile mara nyingi.
2. Kila kitendakazi kina jina linaloeleza kinafanya nini, hivyo kodi yako inasomeka kwa urahisi.
