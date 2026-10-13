---
title: "Orodha"
task: "Tengeneza orodha `matunda` yenye `\"embe\"` na `\"ndizi\"`. Ongeza `\"nanasi\"` kwa `sukuma()`, kisha andika orodha nzima na idadi ya matunda."
initialCode: |
  fanya matunda =

  andika(matunda)
solution: |
  fanya matunda = ["embe", "ndizi"]
  matunda.sukuma("nanasi")
  andika(matunda)
  andika(matunda.idadi())
tests:
  - type: match_code
    pattern: '\.sukuma\(\s*"nanasi"\s*\)'
    message: "Ongeza nanasi kwa matunda.sukuma(\"nanasi\")."
  - type: match_code
    pattern: '\.idadi\(\)'
    message: "Tumia matunda.idadi() kupata idadi ya matunda."
  - type: exact_output
    message: "Matokeo yanapaswa kuwa orodha [embe, ndizi, nanasi] na kisha 3."
---
Orodha inahifadhi vitu vingi ndani ya kibadilika kimoja. Unaiandika kwa mabano ya mraba `[ ]`, na vitu vinatenganishwa kwa koma:

```nuru
fanya timu = ["Simba", "Yanga", "Azam"]
andika(timu[0]) // Simba
andika(timu[2]) // Azam
```

Kila kitu kina nafasi yake. Nafasi ya kwanza ni **0**, si 1.

### Kazi za orodha

- `orodha.idadi()` inarudisha idadi ya vitu.
- `orodha.sukuma(kitu)` inaongeza kitu mwishoni.

```nuru
fanya timu = ["Simba", "Yanga"]
timu.+++sukuma("Azam")+++
andika(timu.+++idadi()+++) // 3
```
