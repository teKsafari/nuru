---
title: "2. Is it Safe? (Validation)"
task: "Complete the `ni_salama` function. Check if `namba` already exists in the given `safu` (column)."
initialCode: |
  fanya gridi = [
    [1, 0, 3, 0],
    [0, 0, 2, 1],
    [0, 1, 0, 2],
    [2, 4, 0, 3]
  ]

  fanya ni_salama = unda(mstari, safu, namba) {
      // 1. Check Row
      kwa i ktk mfululizo(4) {
          kama (gridi[mstari][i] == namba) { rudisha sikweli }
      }

      // 2. Check Column
      kwa i ktk mfululizo(4) {
          // Add your logic here!
          // kama (gridi[i][safu] == namba) { ? }
      }

      rudisha kweli
  }

  andika("Can we put 4 in [0,1]?", ni_salama(0, 1, 4)) // Should be kweli
  andika("Can we put 1 in [0,1]?", ni_salama(0, 1, 1)) // Should be sikweli (Row has 1)
solution: |
  fanya gridi = [
    [1, 0, 3, 0],
    [0, 0, 2, 1],
    [0, 1, 0, 2],
    [2, 4, 0, 3]
  ]

  fanya ni_salama = unda(mstari, safu, namba) {
      kwa i ktk mfululizo(4) {
          kama (gridi[mstari][i] == namba) { rudisha sikweli }
      }
      kwa i ktk mfululizo(4) {
          kama (gridi[i][safu] == namba) { rudisha sikweli }
      }
      rudisha kweli
  }

  andika("Can we put 4 in [0,1]?", ni_salama(0, 1, 4))
  andika("Can we put 1 in [0,1]?", ni_salama(0, 1, 1))
---
Before placing a number, we must check if it's allowed. 

A placement is **Safe** if that number does not already appear in that row or column. (For this 4x4 example, we'll keep it simple and just check rows and columns).

**Your Task:** Complete the column check. Loop through all 4 rows at the given `safu` index. If the number is already there, return `sikweli` (false).