---
title: "3. Merge Sort (ungaPangilia)"
task: "Try sorting a custom array: `[10, 2, 8, 1, 5]`."
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

  fanya mergeSort = unda(arr){
      fanya len = idadi(arr)
      kama (len < 2) {
          rudisha arr
      }

      fanya mid = (len / 2)
      fanya left = vunja(arr, 0, mid)
      fanya right = vunja(arr, mid, len)
      
      rudisha unganisha(mergeSort(left), mergeSort(right))
  }

  fanya arr = [6, 5, 3, 1, 8, 7, 2, 4]
  andika(mergeSort(arr))
solution: |
  // ... (codes from above)
  fanya arr = [10, 2, 8, 1, 5]
  andika(mergeSort(arr))
---
Now we merge everything together! Merge Sort is an algorithm that uses 'divide and conquer' to sort an array.
