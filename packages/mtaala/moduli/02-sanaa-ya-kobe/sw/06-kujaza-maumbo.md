---
title: "Kujaza Maumbo kwa Rangi"
task: "Chora pembetatu yenye pande za hatua `160` na uijaze kwa rangi ya `machungwa`. Tumia `kobe.anza_kujaza()` kabla ya kuchora na `kobe.maliza_kujaza()` baada ya kuchora."
initialCode: |
  tumia kobe

  kobe.rangi_ya_ndani("machungwa")

  kwa i ktk mfululizo(3) {
      kobe.mbele(160)
      kobe.kushoto(120)
  }
solution: |
  tumia kobe

  kobe.rangi_ya_ndani("machungwa")
  kobe.anza_kujaza()
  kwa i ktk mfululizo(3) {
      kobe.mbele(160)
      kobe.kushoto(120)
  }
  kobe.maliza_kujaza()
tests:
  - type: match_code
    pattern: 'kobe\.anza_kujaza\(\)[\s\S]*kobe\.maliza_kujaza\(\)'
    message: "Weka kobe.anza_kujaza() kabla ya kuchora umbo, na kobe.maliza_kujaza() baada yake."
  - type: match_code
    pattern: 'kobe\.rangi_ya_ndani\('
    message: "Chagua rangi ya kujaza kwa kobe.rangi_ya_ndani()."
  - type: kobe_picha
    message: "Pembetatu yako haifanani na inayotakiwa: pande 3 za hatua 160."
---
Mpaka sasa maumbo yako yamekuwa matupu ndani. Kobe anaweza kuyapaka rangi pia.

Hatua tatu:

1. Chagua rangi ya ndani kwa `kobe.rangi_ya_ndani()`.
2. Sema `kobe.anza_kujaza()` kabla ya kuanza kuchora umbo.
3. Sema `kobe.maliza_kujaza()` umbo likikamilika. Hapo ndipo rangi inamwagwa ndani.

```nuru
tumia kobe

kobe.rangi_ya_ndani("kijani")
+++kobe.anza_kujaza()+++
kwa i ktk mfululizo(4) {
    kobe.mbele(100)
    kobe.kushoto(90)
}
+++kobe.maliza_kujaza()+++
```

Rangi ya kalamu (`kobe.rangi`) ni ya mstari wa nje. Rangi ya ndani (`kobe.rangi_ya_ndani`) ni ya ndani ya umbo. Unaweza kuzitumia zote mbili pamoja.
