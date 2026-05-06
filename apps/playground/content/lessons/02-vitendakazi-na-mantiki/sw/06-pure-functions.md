---
title: "6. Vitendakazi Safi (Pure Functions)"
task: "Rekebisha kitendakazi `ongeza_mbili` ili kipokee hoja (argument) na kurudisha thamani mpya badala ya kubadilisha kibadilika cha nje."
initialCode: |
  // Tabia mbaya: Kutegemea vibadilika vya nje
  fanya namba_yangu = 10

  // Rekebisha kitendakazi hiki! Kinapaswa kuchukua 'x' && kurudisha 'x + 2'
  fanya ongeza_mbili = unda() {
      namba_yangu = namba_yangu + 2
  }

  ongeza_mbili()
  andika(namba_yangu) // Hii haitabiriki!
solution: |
  fanya namba_yangu = 10

  fanya ongeza_mbili = unda(x) {
      rudisha x + 2
  }

  andika(ongeza_mbili(namba_yangu)) // Inatabirika kila wakati!
---
**Kitendakazi Safi** (Pure Function) ni dhana muhimu sana.
1. Kila wakati kinaleta matokeo yale yale kwa pembejeo (input) ile ile.
2. **Kamwe** hakibadilishi vibadilika vilivyo nje yake (hakuna mabadiliko ya nje yasiyotarajiwa).

### Mfano: Safi dhidi ya Isiyo Safi:
```s
// ISIYO SAFI (Haitabiriki)
fanya jumla = 0
fanya ongeza = unda(x) {
    jumla = jumla + x // Kinabadilisha kitu cha NJE
}

// SAFI (Salama na Inatabirika)
fanya ongeza_safi = +++unda(x, y) {
    rudisha x + y // Kinapiga hesabu na kurudisha tu
}+++
```

Vitendakazi safi vinafanya kodi yako kuwa rahisi kuipima na kuielewa kwa sababu vimejitenga na ulimwengu wa nje.

**Kazi Yako:** Andika upya `ongeza_mbili` ili kiwe kitendakazi safi. Kinapaswa kuchukua namba na kurudisha namba hiyo jumlisha 2.

```s
fanya ongeza_mbili = +++unda(x) {
    rudisha x + 2
}+++
```