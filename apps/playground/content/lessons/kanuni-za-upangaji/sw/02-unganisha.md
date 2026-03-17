---
title: "2. Unganisha (Merge)"
task: "Bonyeza 'Run' kuona jinsi safu mbili zinavyounganishwa kwa mpangilio."
initialCode: |
  fanya unganisha = unda(kushoto, kulia) {
      fanya matokeo = []
      fanya kushotoUrefu = idadi(kushoto)
      fanya kuliaUrefu = idadi(kulia)
      fanya l = 0
      fanya r = 0
      
      wakati (l < kushotoUrefu && r < kuliaUrefu) {
          kama (kushoto[l] < kulia[r]) {
              matokeo = matokeo + [kushoto[l]]
              l = l + 1
          } sivyo {
              matokeo = matokeo + [kulia[r]]
              r = r + 1
          }
      }
      
      // Ongeza vilivyobaki
      wakati (l < kushotoUrefu) {
          matokeo = matokeo + [kushoto[l]]
          l = l + 1
      }
      wakati (r < kuliaUrefu) {
          matokeo = matokeo + [kulia[r]]
          r = r + 1
      }
      
      rudisha matokeo
  }

  andika(unganisha([1, 5], [2, 8]))
solution: |
  fanya unganisha = unda(kushoto, kulia) {
      fanya matokeo = []
      fanya kushotoUrefu = idadi(kushoto)
      fanya kuliaUrefu = idadi(kulia)
      fanya l = 0
      fanya r = 0
      
      wakati (l < kushotoUrefu && r < kuliaUrefu) {
          kama (kushoto[l] < kulia[r]) {
              matokeo = matokeo + [kushoto[l]]
              l = l + 1
          } sivyo {
              matokeo = matokeo + [kulia[r]]
              r = r + 1
          }
      }
      
      wakati (l < kushotoUrefu) {
          matokeo = matokeo + [kushoto[l]]
          l = l + 1
      }
      wakati (r < kuliaUrefu) {
          matokeo = matokeo + [kulia[r]]
          r = r + 1
      }
      
      rudisha matokeo
  }

  andika(unganisha([1, 5], [2, 8]))
---
Hatua ya pili ni kuweza kuunganisha safu mbili zilizokwisha pangwa kuwa safu moja kubwa iliyopangwa.
