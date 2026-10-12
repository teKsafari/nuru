---
title: "4. The Merge (Combining)"
task: "Complete the `unganisha` function to combine two sorted lists into one big sorted list."
initialCode: |
  // Kisaidizi cha kukata orodha (Helper to slice arrays)
  fanya kata = unda(orodha, anza, mwisho = -1) {
      kama (mwisho == -1) { mwisho = orodha.idadi() }
      fanya mpya = []
      kwa i, t ktk orodha { kama (i >= anza && i < mwisho) { mpya.sukuma(t) } }
      rudisha mpya
  }


  fanya unganisha = unda(a, b) {
      fanya matokeo = []
      
      wakati (a.idadi() > 0 && b.idadi() > 0) {
          kama (a[0] < b[0]) {
              matokeo.sukuma(a[0])
              a = kata(a, 1)
          } sivyo {
              
          }
      }
      
      rudisha matokeo + a + b
  }

  andika(unganisha([1, 5], [2, 10]))
solution: |
  // Kisaidizi cha kukata orodha (Helper to slice arrays)
  fanya kata = unda(orodha, anza, mwisho = -1) {
      kama (mwisho == -1) { mwisho = orodha.idadi() }
      fanya mpya = []
      kwa i, t ktk orodha { kama (i >= anza && i < mwisho) { mpya.sukuma(t) } }
      rudisha mpya
  }


  fanya unganisha = unda(a, b) {
      fanya matokeo = []
      wakati (a.idadi() > 0 && b.idadi() > 0) {
          kama (a[0] < b[0]) {
              matokeo.sukuma(a[0])
              a = kata(a, 1)
          } sivyo {
              matokeo.sukuma(b[0])
              b = kata(b, 1)
          }
      }
      rudisha matokeo + a + b
  }

  andika(unganisha([1, 5], [2, 10]))
---
After we split the lists down to size 1, we need to put them back together in the correct order. This is the **Merge** step.

### How it works:
1. Look at the first item of both lists.
2. Pick the smaller one and put it in our `matokeo` (result) list.
3. Repeat until one list is empty!

**Your Task:** Complete the `sivyo` block. If `b[0]` is smaller (or equal) to `a[0]`, add it to the `matokeo` and remove it from `b`. (Note: `.sukuma()` adds an item to an array, and `+` joins two arrays).

```nuru
fanya unganisha = unda(a, b) {
    fanya matokeo = []
    wakati (a.idadi() > 0 && b.idadi() > 0) {
        kama (a[0] < b[0]) {
            matokeo.sukuma(a[0])
            a = kata(a, 1)
        } sivyo {
            +++matokeo.sukuma(b[0])+++
            +++b = kata(b, 1)+++
        }
    }
    rudisha matokeo + a + b
}

andika(unganisha([1, 5], [2, 10]))
```