---
title: "4. Wigo wa Vibadilika (Scope)"
task: "Sogeza `fanya siri = 'Nywila'` ndani ya kitendakazi `ficha` ili iwe kibadilika cha 'Ndani' (Local variable)."
initialCode: |
  fanya siri = "Nywila"

  fanya ficha = unda() {
      // Sogeza siri hapa ndani
      andika(siri)
  }
  
  ficha()
  
  // Hii italeta kosa ikiwa siri imefichwa ndani! Ijaribu baada ya kurekebisha.
  // andika("Nje ya function:", siri) 
solution: |
  fanya ficha = unda() {
      fanya siri = "Nywila"
      andika(siri)
  }
  
  ficha()
---
**Wigo** (Scope) ni eneo ambalo kibadilika kinaruhusiwa kuwepo.

- **Wigo wa Nje (Global):** Vibadilika vilivyotengenezwa nje ya kitendakazi chochote. Kila mtu anaweza kuviona na kuvibadilisha. Hii inaweza kusababisha makosa!
- **Wigo wa Ndani (Local):** Vibadilika vilivyotengenezwa *ndani* ya kitendakazi. Vimefungiwa ndani! Kodi ya nje haiwezi kuviona wala kuvitumia.

### Mfano:
```s
fanya jina = "Amani" // Global

fanya ficha_nywila = unda() {
    +++fanya siri = "123"+++ // Local
    andika(siri) // Inafanya kazi!
}

andika(jina) // Inafanya kazi
andika(siri) // KOSA! Kompyuta haijui 'siri' ni nini huku nje.
```

Vibadilika vya ndani ni salama zaidi kwa sababu havivurugi sehemu nyingine za programu yako.

**Kazi Yako:** Sogeza kibadilika `siri` ndani ya kitendakazi `ficha` ili kukifanya kiwe cha ndani.

```s
fanya ficha = unda() {
    +++fanya siri = "Nywila"+++
    andika(siri)
}
```