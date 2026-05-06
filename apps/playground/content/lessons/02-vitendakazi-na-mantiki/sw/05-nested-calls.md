---
title: "5. Kuita Kitendakazi kutoka Ndani"
task: "Kamilisha kitendakazi `salimia` kwa kuita kitendakazi `tafuta_jina` ili kupata jina la kuandika."
initialCode: |
  fanya tafuta_jina = unda() {
      rudisha "Amani"
  }

  fanya salimia = unda() {
      // 1. Pata jina
      fanya jina = // piga tafuta_jina() hapa
      
      // 2. Andika salamu
      andika("Habari", jina)
  }

  salimia()
solution: |
  fanya tafuta_jina = unda() {
      rudisha "Amani"
  }

  fanya salimia = unda() {
      fanya jina = tafuta_jina()
      andika("Habari", jina)
  }

  salimia()
---
Kwenye upangaji programu (programming), vitendakazi mara nyingi vinategemea vitendakazi vingine ili kufanya kazi zao.

Ikiwa una tatizo gumu, huhitaji kuandika kitendakazi kimoja kikubwa na kirefu. Badala yake, unaweza kutengeneza vitendakazi vingi vidogo na rahisi vinavyoitana! Hii inafanya kodi yako kuwa rahisi kusoma na kurekebisha.

### Mfano:
```s
fanya pata_namba = unda() {
    rudisha 10
}

fanya hesabu = unda() {
    +++fanya n = pata_namba()+++
    andika(n + 1) // 11
}

hesabu()
```

**Kazi Yako:** Ndani ya kitendakazi `salimia`, ita `tafuta_jina()` na uhifadhi matokeo kwenye kibadilika `jina`. Kisha tumia kibadilika hicho kwenye salamu!

```s
fanya tafuta_jina = unda() {
    rudisha "Amani"
}

fanya salimia = unda() {
    +++fanya jina = tafuta_jina()+++
    andika("Habari", jina)
}

salimia()
```