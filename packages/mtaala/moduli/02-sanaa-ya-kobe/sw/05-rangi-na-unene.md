---
title: "Rangi na Unene"
task: "Chora mraba wa hatua `150` wenye kalamu ya unene `6`. Kila upande uwe na rangi yake: `kijani`, `njano`, `nyeusi`, `bluu`, kama bendera ya Tanzania."
initialCode: |
  tumia kobe

  fanya rangi_za_bendera = ["kijani", "njano", "nyeusi", "bluu"]
solution: |
  tumia kobe

  fanya rangi_za_bendera = ["kijani", "njano", "nyeusi", "bluu"]
  kobe.unene(6)
  kwa rangi ktk rangi_za_bendera {
      kobe.rangi(rangi)
      kobe.mbele(150)
      kobe.kushoto(90)
  }
tests:
  - type: match_code
    pattern: 'kobe\.unene\('
    message: "Tumia kobe.unene(6) kunenepesha kalamu."
  - type: match_code
    pattern: 'kobe\.rangi\('
    message: "Tumia kobe.rangi() kubadili rangi ya kalamu."
  - type: kobe_picha
    message: "Mraba wako haufanani na unaotakiwa: pande 4 za hatua 150."
---
Kalamu ya kobe ni nyeusi na nyembamba mwanzoni. Unaweza kubadili zote mbili:

```nuru
tumia kobe

kobe.+++rangi("nyekundu")+++
kobe.+++unene(8)+++
kobe.mbele(120)
```

Rangi unazoweza kutumia kwa jina: `nyeusi`, `nyeupe`, `nyekundu`, `kijani`, `bluu`, `samawati`, `njano`, `machungwa`, `zambarau`, `waridi`, `kahawia`, `kijivu`, `dhahabu`, `fedha`. Unaweza pia kutumia msimbo wa rangi kama `"#1eb53a"`.

### Kitanzi juu ya orodha ya rangi

Kitanzi cha `kwa` kinaweza kupitia orodha ya maneno, si namba tu:

```nuru
kwa r ktk ["nyekundu", "njano", "kijani"] {
    kobe.rangi(r)
    kobe.mbele(60)
}
```
