---
title: "2. Merge (Unganisha)"
task: "Click 'Run' to see how two sorted arrays are merged in order."
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
      
      // Add remaining elements
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
The second step is to be able to merge two already sorted arrays into one large sorted array.
