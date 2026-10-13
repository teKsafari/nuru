---
title: "Mchoro Wako Mwenyewe"
task: "Chora chochote unachopenda: nyumba, jua, bendera au mchoro wa mapambo. Tumia angalau kitanzi kimoja na amri za kobe. Mwishoni, andika jina la mchoro wako kwa `andika()`."
initialCode: |
  tumia kobe

  // Turubai ni yako!
solution: |
  tumia kobe

  // Jua lenye miale 12
  kobe.rangi("dhahabu")
  kobe.rangi_ya_ndani("njano")
  kobe.anza_kujaza()
  kobe.duara(60)
  kobe.maliza_kujaza()
  kobe.unene(4)
  kwa i ktk mfululizo(12) {
      kobe.kalamu_juu()
      kobe.mbele(80)
      kobe.kalamu_chini()
      kobe.mbele(50)
      kobe.kalamu_juu()
      kobe.nyuma(130)
      kobe.kulia(30)
  }
  andika("Jua la asubuhi")
tests:
  - type: match_code
    pattern: 'kwa\s+\w+\s+ktk|wakati\s*\('
    message: "Tumia angalau kitanzi kimoja (kwa au wakati)."
  - type: match_code
    pattern: 'kobe\.(mbele|nyuma|duara|nenda|nukta)\('
    message: "Mwambie kobe achore kitu: tumia mbele, nyuma, duara, nenda au nukta."
  - type: match_output
    pattern: '\S'
    message: "Andika jina la mchoro wako kwa andika()."
---
Hongera! Umejifunza mistari, kugeuka, vitanzi, poligoni, rangi, kujaza, duara, nyota na vitendakazi. Sasa ni zamu yako kuwa msanii.

Mawazo ya kuanzia:

- **Nyumba**: mraba, pembetatu juu yake kama paa, na mlango.
- **Jua**: duara lililojazwa njano, na miale kuzunguka.
- **Mapambo**: poligoni moja, geuka kidogo, rudia mara nyingi kwa rangi tofauti.
- **Bendera**: mistatili iliyojazwa kwa rangi.

Amri chache za ziada zinazoweza kukusaidia:

```nuru
kobe.mandhari("samawati") // rangi ya turubai
kobe.kasi(10)             // kobe achore haraka
kobe.ficha()              // ficha kobe mwishoni
kobe.maandishi("Jambo!")  // andika maneno kwenye turubai
```

Hakuna jibu moja sahihi hapa. Ukipenda mchoro wako, nakili kodi yako kwenye **Uwanja** na ubonyeze **Shiriki** umwonyeshe rafiki yako.
