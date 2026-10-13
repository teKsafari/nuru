---
title: "Wigo wa Vibadilika"
task: "Programu inajaribu kuandika `jumla` nje ya kitendakazi na inapata kosa. Rekebisha: `hesabu_jumla` irudishe `jumla`, kisha nje hifadhi jibu kwenye kibadilika na ukiandike."
initialCode: |
  fanya bei = [500, 300, 1200]

  fanya hesabu_jumla = unda(orodha) {
      fanya jumla = 0
      kwa b ktk orodha {
          jumla = jumla + b
      }
  }

  hesabu_jumla(bei)
  andika("Jumla:", jumla)
solution: |
  fanya bei = [500, 300, 1200]

  fanya hesabu_jumla = unda(orodha) {
      fanya jumla = 0
      kwa b ktk orodha {
          jumla = jumla + b
      }
      rudisha jumla
  }

  fanya jumla = hesabu_jumla(bei)
  andika("Jumla:", jumla)
tests:
  - type: match_code
    pattern: 'rudisha\s+jumla'
    message: "Ndani ya hesabu_jumla, ongeza rudisha jumla mwishoni."
  - type: match_code
    pattern: '=\s*hesabu_jumla\(\s*bei\s*\)'
    message: "Hifadhi jibu nje, kwa mfano fanya jumla = hesabu_jumla(bei)."
  - type: exact_output
    message: "Programu iandike: Jumla: 2000"
---
**Wigo** (scope) ni eneo ambalo kibadilika kinaonekana.

- Kibadilika unachotengeneza **ndani** ya kitendakazi kinaishi humo tu. Kitendakazi kikimaliza, kibadilika kinatoweka.
- Kibadilika cha **nje** kinaweza kusomwa ndani ya kitendakazi.

```nuru
fanya kodi = 18 // cha nje

fanya hesabu = unda() {
    +++fanya siri = 1234+++ // cha ndani
    andika(siri, kodi)  // vyote vinaonekana hapa
}

hesabu()
andika(siri) // KOSA: huku nje hakuna siri
```

### Nuru inalinda vibadilika vya nje

Ukiandika `kodi = 20` ndani ya kitendakazi, Nuru inatengeneza `kodi` mpya ya ndani. Ile ya nje inabaki 18. Hii inazuia kitendakazi kimoja kuharibu data ya programu nzima kwa bahati mbaya.

Hivyo njia sahihi ya kutoa jibu nje ya kitendakazi ni moja: **`rudisha`**.
