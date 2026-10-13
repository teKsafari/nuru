---
title: "Duara na Nukta"
task: "Tengeneza mkufu wa shanga 5. Kila shanga ni `kobe.duara(20)` yenye `kobe.nukta()` katikati. Kati ya shanga, inua kalamu na usogee mbele hatua `60`."
initialCode: |
  tumia kobe

  kobe.kalamu_juu()
  kobe.nenda(-120, 0)
  kobe.kalamu_chini()
solution: |
  tumia kobe

  kobe.kalamu_juu()
  kobe.nenda(-120, 0)
  kobe.kalamu_chini()

  kwa i ktk mfululizo(5) {
      kobe.duara(20)
      kobe.nukta()
      kobe.kalamu_juu()
      kobe.mbele(60)
      kobe.kalamu_chini()
  }
tests:
  - type: match_code
    pattern: 'kobe\.duara\('
    message: "Tumia kobe.duara(20) kuchora kila shanga."
  - type: match_code
    pattern: 'kalamu_juu'
    message: "Inua kalamu kwa kobe.kalamu_juu() ili kobe asichore mstari kati ya shanga."
  - type: kobe_picha
    message: "Mkufu wako haufanani na unaotakiwa: shanga 5 zenye nusukipenyo 20, kila moja hatua 60 kutoka nyingine."
---
`kobe.duara(r)` inachora duara ambalo **kobe yuko katikati yake**. Namba `r` ni nusukipenyo: umbali kutoka katikati hadi ukingoni.

`kobe.nukta()` inaweka kidoti mahali kobe aliposimama. Ukitaka kidoti kikubwa, mpe ukubwa: `kobe.nukta(16)`.

```nuru
tumia kobe

kobe.+++duara(80)+++   // uso
kobe.+++nukta(20)+++   // pua
```

### Kusogea bila kuchora

- `kobe.kalamu_juu()` inainua kalamu. Kobe akitembea sasa, hachori.
- `kobe.kalamu_chini()` inashusha kalamu tena.
- `kobe.nenda(x, y)` inampeleka kobe moja kwa moja mahali fulani. Katikati ya turubai ni `(0, 0)`, na `x` hasi ni upande wa kushoto.
