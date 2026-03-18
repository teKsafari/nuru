---
title: "2. Je, ni Salama? (Uthibitisho)"
task: "Kamilisha kitendakazi cha `ni_salama`. Angalia ikiwa `namba` tayari ipo kwenye `safu` iliyotolewa."
initialCode: |
  fanya gridi = [
    [1, 0, 3, 0],
    [0, 0, 2, 1],
    [0, 1, 0, 2],
    [2, 4, 0, 3]
  ]

  fanya ni_salama = unda(mstari, safu, namba) {
      // 1. Angalia Mstari (Row)
      kwa i katika mfululizo(4) {
          kama (gridi[mstari][i] == namba) { rudisha sikweli }
      }

      // 2. Angalia Safu (Column)
      kwa i katika mfululizo(4) {
          // Weka mantiki yako hapa!
          // kama (gridi[i][safu] == namba) { ? }
      }

      rudisha kweli
  }

  andika("Je, tunaweza kuweka 4 kwenye [0,1]?", ni_salama(0, 1, 4)) // Inapaswa kuwa kweli
  andika("Je, tunaweza kuweka 1 kwenye [0,1]?", ni_salama(0, 1, 1)) // Inapaswa kuwa sikweli (Mstari una 1 tayari)
solution: |
  fanya gridi = [
    [1, 0, 3, 0],
    [0, 0, 2, 1],
    [0, 1, 0, 2],
    [2, 4, 0, 3]
  ]

  fanya ni_salama = unda(mstari, safu, namba) {
      kwa i katika mfululizo(4) {
          kama (gridi[mstari][i] == namba) { rudisha sikweli }
      }
      kwa i katika mfululizo(4) {
          kama (gridi[i][safu] == namba) { rudisha sikweli }
      }
      rudisha kweli
  }

  andika("Je, tunaweza kuweka 4 kwenye [0,1]?", ni_salama(0, 1, 4))
  andika("Je, tunaweza kuweka 1 kwenye [0,1]?", ni_salama(0, 1, 1))
---
Kabla ya kuweka namba, lazima tuangalie ikiwa inaruhusiwa.

Uwekaji ni **Salama** ikiwa namba hiyo haipo tayari kwenye mstari au safu hiyo. (Kwa mfano huu wa 4x4, tutafanya mambo kuwa rahisi na kuangalia mistari na safu tu).

**Kazi Yako:** Kamilisha ukaguzi wa safu (column check). Pitia mistari yote 4 kwenye namba ya `safu` iliyotolewa. Ikiwa namba tayari ipo, rudisha `sikweli`.