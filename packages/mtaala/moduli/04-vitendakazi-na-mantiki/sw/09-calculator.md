---
title: "Mradi Mdogo: Kikokotozi"
task: "Kamilisha `kikokotozi` ili kishughulikie `\"toa\"`, `\"zidisha\"` na `\"gawanya\"`. Kwa kugawanya kwa sifuri, kirudishe neno `Huwezi kugawanya kwa sifuri`. Tumia `kama` na `au kama`."
initialCode: |
  fanya kikokotozi = unda(a, b, tendo) {
      kama (tendo == "jumla") {
          rudisha a + b
      }
      rudisha "Sijui tendo hilo"
  }

  andika(kikokotozi(10, 5, "jumla"))
  andika(kikokotozi(10, 5, "toa"))
  andika(kikokotozi(10, 5, "zidisha"))
  andika(kikokotozi(10, 5, "gawanya"))
  andika(kikokotozi(10, 0, "gawanya"))
  andika(kikokotozi(10, 5, "peo"))
solution: |
  fanya kikokotozi = unda(a, b, tendo) {
      kama (tendo == "jumla") {
          rudisha a + b
      } au kama (tendo == "toa") {
          rudisha a - b
      } au kama (tendo == "zidisha") {
          rudisha a * b
      } au kama (tendo == "gawanya") {
          kama (b == 0) {
              rudisha "Huwezi kugawanya kwa sifuri"
          }
          rudisha a / b
      }
      rudisha "Sijui tendo hilo"
  }

  andika(kikokotozi(10, 5, "jumla"))
  andika(kikokotozi(10, 5, "toa"))
  andika(kikokotozi(10, 5, "zidisha"))
  andika(kikokotozi(10, 5, "gawanya"))
  andika(kikokotozi(10, 0, "gawanya"))
  andika(kikokotozi(10, 5, "peo"))
tests:
  - type: match_output
    pattern: '^15\n5\n50\n'
    message: "jumla iwe 15, toa iwe 5, na zidisha iwe 50."
  - type: match_output
    pattern: '\n2\nHuwezi kugawanya kwa sifuri\n'
    message: "10 gawanya 5 iwe 2, na kugawanya kwa 0 kirudishe: Huwezi kugawanya kwa sifuri"
  - type: exact_output
    message: "Matokeo yote sita yalingane na yanayotarajiwa. Tendo lisilojulikana lirudishe: Sijui tendo hilo"
---
Hongera kwa kufika hapa! Sasa unajua kuunda vitendakazi, kupitisha hoja, kurudisha majibu na kugawa kazi kwa vitendakazi vidogo. Tujenge kitu halisi: **kikokotozi**.

Kikokotozi kinapokea namba mbili na jina la tendo. `kama` na `au kama` zinachagua hesabu sahihi:

```nuru
kama (tendo == "jumla") {
    rudisha a + b
} +++au kama (tendo == "toa") {
    rudisha a - b
}+++
```

### Usisahau makosa

Programu nzuri haivunjiki mtumiaji akikosea. Kugawanya kwa sifuri hakuna jibu katika hesabu, hivyo kikokotozi chako kitoe ujumbe wa kirafiki badala yake.

Kumbuka kwamba `rudisha` inamaliza kitendakazi papo hapo. Kodi iliyo chini ya `rudisha` haiendeshwi.
