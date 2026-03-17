---
title: "1. Vunja (Slice)"
task: "Jaribu kubadilisha `0, 4` kuwa `2, 6` uone matokeo."
initialCode: |
  fanya vunja = unda(safu, mwanzo, mwisho) {
      fanya matokeo = []
      wakati (mwanzo < mwisho) {
          matokeo = matokeo + [safu[mwanzo]]
          mwanzo = mwanzo + 1
      }
      rudisha matokeo
  }

  fanya namba = [1, 2, 3, 4, 5, 6, 7, 8]
  andika(vunja(namba, 0, 4))
solution: |
  fanya vunja = unda(safu, mwanzo, mwisho) {
      fanya matokeo = []
      wakati (mwanzo < mwisho) {
          matokeo = matokeo + [safu[mwanzo]]
          mwanzo = mwanzo + 1
      }
      rudisha matokeo
  }

  fanya namba = [1, 2, 3, 4, 5, 6, 7, 8]
  andika(vunja(namba, 2, 6))
---
Hatua ya kwanza katika kupanga (Merge Sort) ni kuweza kugawa safu yetu katika vipande vidogo. Katika Nuru, tunaweza kutumia kitanzi cha `wakati` kutengeneza kipande kipya.
