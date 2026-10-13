---
title: "Kitendakazi Kinachorudisha Kitendakazi"
task: "Tumia `tengeneza_salamu` kutengeneza kitendakazi `salamu_asubuhi` kwa neno `\"Habari za asubuhi\"`. Kisha kiite kwa majina `\"Juma\"` na `\"Rehema\"`."
initialCode: |
  fanya tengeneza_salamu = unda(salamu) {
      rudisha unda(jina) {
          andika(salamu + ",", jina)
      }
  }

  // 1. fanya salamu_asubuhi = ...
  // 2. Kiite mara mbili
solution: |
  fanya tengeneza_salamu = unda(salamu) {
      rudisha unda(jina) {
          andika(salamu + ",", jina)
      }
  }

  fanya salamu_asubuhi = tengeneza_salamu("Habari za asubuhi")
  salamu_asubuhi("Juma")
  salamu_asubuhi("Rehema")
tests:
  - type: match_code
    pattern: 'salamu_asubuhi\s*=\s*tengeneza_salamu\('
    message: "Tengeneza salamu_asubuhi kwa kuita tengeneza_salamu(\"Habari za asubuhi\")."
  - type: exact_output
    message: "Programu iandike: Habari za asubuhi, Juma kisha Habari za asubuhi, Rehema."
---
Kitendakazi kinaweza **kurudisha** kitendakazi kingine. Ni kama kiwanda kinachotengeneza mashine.

```nuru
fanya tengeneza_kizidishi = unda(n) {
    rudisha unda(x) {
        rudisha x * +++n+++
    }
}

fanya mara_tatu = tengeneza_kizidishi(3)
fanya mara_kumi = tengeneza_kizidishi(10)

andika(mara_tatu(5))  // 15
andika(mara_kumi(5))  // 50
```

Ajabu ni hii: `tengeneza_kizidishi` imeshamaliza kazi, lakini kitendakazi cha ndani bado **kinakumbuka** `n`. Hii inaitwa **closure**: kitendakazi kinabeba mazingira kilipozaliwa.
