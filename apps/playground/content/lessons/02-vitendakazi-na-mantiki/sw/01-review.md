---
title: "1. Kujikumbusha Vitendakazi"
task: "Unda kitendakazi (function) kinachoitwa `salamu` ambacho kinaandika 'Jambo!' kinapoitwa."
initialCode: |
  // Unda function hapa
  fanya salamu = unda() {
      // ?
  }
  
  salamu()
solution: |
  fanya salamu = unda() {
      andika("Jambo!")
  }
  
  salamu()
---
Karibu tena! Katika misingi ya Nuru, ulijifunza kuwa **Vitendakazi** (Functions) ni kama mashine ndogo unazoweza kuzitumia tena na tena. Unazitengeneza mara moja, na unaweza kuzitumia mara nyingi upendavyo.

Tunatumia neno `unda` kutengeneza kitendakazi.

### Inavyoonekana:
```s
fanya piga_kelele = unda() {
    +++andika("AAAH!")+++
}

// Ili kuiendesha, "tunaiita" kwa kutumia mabano:
piga_kelele()
piga_kelele()
```

Katika mfano hapo juu, `piga_kelele()` inaendesha kodi iliyo ndani ya mabano ya mawimbi `{ ... }`. Kwa sababu tumeiita mara mbili, itaandika "AAAH!" mara mbili.

**Kazi Yako:** Je, unaweza kurekebisha mashine ya `salamu` ili iandike `"Jambo!"` kwenye skrini?

```s
fanya salamu = unda() {
    +++andika("Jambo!")+++
}
```