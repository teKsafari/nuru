---
title: "Kujikumbusha Vitendakazi"
task: "Kamilisha kitendakazi `salamu` ili kiandike `Jambo!`. Kisha kiite mara **mbili**."
initialCode: |
  fanya salamu = unda() {
      // Andika hapa
  }
solution: |
  fanya salamu = unda() {
      andika("Jambo!")
  }

  salamu()
  salamu()
tests:
  - type: match_code
    pattern: '^\s*salamu\(\)[\s\S]*^\s*salamu\(\)'
    flags: m
    message: "Kiite kitendakazi mara mbili kwa kuandika salamu() chini yake."
  - type: exact_output
    message: "Programu iandike Jambo! mara mbili, kila moja mstari wake."
---
Karibu tena! Kwenye Misingi ya Nuru ulijifunza kwamba kitendakazi ni kama mashine ndogo. Unaitengeneza mara moja, kisha unaiwasha kila unapoihitaji.

Hatua mbili tofauti:

1. **Kuunda**: `fanya jina = unda() { ... }` inatengeneza mashine. Haiwashi bado.
2. **Kuita**: `jina()` inawasha mashine na kuendesha kodi iliyo ndani ya `{ }`.

```nuru
fanya piga_mluzi = unda() {
    andika("Fiiiii!")
}

+++piga_mluzi()+++
+++piga_mluzi()+++
+++piga_mluzi()+++
```

Mfano huu unaandika `Fiiiii!` mara tatu, kwa sababu tumeita kitendakazi mara tatu. Bila `()` kitendakazi hakiendeshwi kamwe.
