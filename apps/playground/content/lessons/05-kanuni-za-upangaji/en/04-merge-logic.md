---
title: "4. The Merge (Combining)"
task: "Complete the `unganisha` function to combine two sorted lists into one big sorted list."
initialCode: |
  fanya unganisha = unda(a, b) {
      fanya matokeo = []
      
      // Keep going while both lists have items
      wakati (idadi(a) > 0 na idadi(b) > 0) {
          kama (a[0] < b[0]) {
              // Take the smaller one from 'a'
              matokeo = weka(matokeo, a[0])
              a = kata(a, 1)
          } sivyo {
              // Take the smaller one from 'b'
              // ?
          }
      }
      
      // Add any leftover items
      rudisha unganisha_orodha(matokeo, unganisha_orodha(a, b))
  }

  andika(unganisha([1, 5], [2, 10])) // Should be [1, 2, 5, 10]
solution: |
  fanya unganisha = unda(a, b) {
      fanya matokeo = []
      wakati (idadi(a) > 0 na idadi(b) > 0) {
          kama (a[0] < b[0]) {
              matokeo = weka(matokeo, a[0])
              a = kata(a, 1)
          } sivyo {
              matokeo = weka(matokeo, b[0])
              b = kata(b, 1)
          }
      }
      rudisha unganisha_orodha(matokeo, unganisha_orodha(a, b))
  }

  andika(unganisha([1, 5], [2, 10]))
---
After we split the lists down to size 1, we need to put them back together in the correct order. This is the **Merge** step.

### How it works:
1. Look at the first item of both lists.
2. Pick the smaller one and put it in our `matokeo` (result) list.
3. Repeat until one list is empty!

**Your Task:** Complete the `sivyo` block. If `b[0]` is smaller (or equal) to `a[0]`, add it to the `matokeo` and remove it from `b`. (Note: `weka` adds an item to an array, and `unganisha_orodha` joins two arrays).