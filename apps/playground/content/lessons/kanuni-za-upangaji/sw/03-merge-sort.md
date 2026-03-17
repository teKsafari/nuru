---
title: "3. Pangilia na Unganisha (Merge Sort)"
task: "Jaribu kupanga safu ya namba: `[10, 2, 8, 1, 5]`."
initialCode: |
  fanya vunja = unda(safu, mwanzo, mwisho) {
      fanya matokeo = []
      wakati (mwanzo < mwisho) {
          matokeo = matokeo + [safu[mwanzo]]
          mwanzo = mwanzo + 1
      }
      rudisha matokeo
  }

  fanya unganisha = unda(kushoto, kulia) {
      fanya matokeo = []
      fanya kushotoUrefu = idadi(kushoto)
      fanya kuliaUrefu = idadi(kulia)
      fanya l = 0; fanya r = 0
      wakati (l < kushotoUrefu && r < kuliaUrefu) {
          kama (kushoto[l] < kulia[r]) {
              matokeo = matokeo + [kushoto[l]]; l = l + 1
          } sivyo {
              matokeo = matokeo + [kulia[r]]; r = r + 1
          }
      }
      wakati (l < kushotoUrefu) { matokeo = matokeo + [kushoto[l]]; l = l + 1 }
      wakati (r < kuliaUrefu) { matokeo = matokeo + [kulia[r]]; r = r + 1 }
      rudisha matokeo
  }

  fanya ungaPangilia = unda(safu){
      fanya urefu = idadi(safu)
      kama (urefu < 2) {
          rudisha safu
      }

      fanya kati = (urefu / 2)
      fanya kushoto = vunja(safu, 0, kati)
      fanya kulia = vunja(safu, kati, urefu)
      
      rudisha unganisha(ungaPangilia(kushoto), ungaPangilia(kulia))
  }

  fanya safu = [6, 5, 3, 1, 8, 7, 2, 4]
  andika(ungaPangilia(safu))
solution: |
  // ... (codes from above)
  fanya safu = [10, 2, 8, 1, 5]
  andika(ungaPangilia(safu))
---
Sasa tunaunganisha kila kitu! Merge Sort ni kanuni inayotumia 'divide and conquer' (gawa na utawale) kupanga safu.
