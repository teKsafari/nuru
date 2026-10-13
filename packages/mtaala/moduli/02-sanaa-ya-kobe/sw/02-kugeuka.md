---
title: "Kugeuka Kulia na Kushoto"
task: "Chora ngazi yenye vidato 3. Kila kidato: mbele `50`, geuka kushoto `90`, mbele `50`, geuka kulia `90`."
initialCode: |
  tumia kobe

  // Kidato cha kwanza
  kobe.mbele(50)
solution: |
  tumia kobe

  kobe.mbele(50)
  kobe.kushoto(90)
  kobe.mbele(50)
  kobe.kulia(90)

  kobe.mbele(50)
  kobe.kushoto(90)
  kobe.mbele(50)
  kobe.kulia(90)

  kobe.mbele(50)
  kobe.kushoto(90)
  kobe.mbele(50)
  kobe.kulia(90)
tests:
  - type: match_code
    pattern: 'kobe\.kushoto\('
    message: "Tumia kobe.kushoto() kugeuka juu."
  - type: match_code
    pattern: 'kobe\.kulia\('
    message: "Tumia kobe.kulia() kurudi kutazama mbele."
  - type: kobe_picha
    message: "Ngazi yako haifanani na inayotakiwa. Hakikisha ina vidato 3, kila kimoja hatua 50 kwa 50."
---
Kobe anaweza kugeuka bila kutembea. Unampa idadi ya **digrii** za kugeuka:

- `kobe.kushoto(90)` anageuka kushoto robo mzunguko.
- `kobe.kulia(90)` anageuka kulia robo mzunguko.
- Digrii 180 ni nusu mzunguko, na 360 ni mzunguko kamili.

```nuru
tumia kobe

kobe.mbele(100)
+++kobe.kushoto(90)+++
kobe.mbele(100)
```

Programu hii inachora kona: mstari kwenda kulia, kisha mstari kwenda juu.

Fikiria uko ndani ya kobe. "Kushoto" ni kushoto kwake yeye, kulingana na anakotazama sasa.
