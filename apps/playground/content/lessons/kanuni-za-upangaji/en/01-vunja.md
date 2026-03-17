---
title: "1. Slice (Vunja)"
task: "Try changing `0, 4` to `2, 6` and see the result."
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
The first step in Merge Sort is to be able to divide our array into smaller pieces. In Nuru, we can use a `wakati` (while) loop to create a new slice.
