---
title: "5. Full Merge Sort"
task: "Combine everything! Recursively call `panga` on both halves, then `unganisha` the results."
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
              matokeo.sukuma(b[0])
              b = kata(b, 1)
          }
      }
      rudisha matokeo + a + b
  }

  fanya panga = unda(orodha) {
      kama (orodha.idadi() <= 1) { rudisha orodha }

      fanya kati = orodha.idadi() / 2
      
      fanya kushoto = 
      fanya kulia = 

      rudisha unganisha(kushoto, kulia)
  }

  andika(panga([38, 27, 43, 3, 9, 82, 10]))
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

  fanya panga = unda(orodha) {
      kama (orodha.idadi() <= 1) { rudisha orodha }
      fanya kati = orodha.idadi() / 2
      fanya kushoto = panga(kata(orodha, 0, kati))
      fanya kulia = panga(kata(orodha, kati))
      rudisha unganisha(kushoto, kulia)
  }

  andika(panga([38, 27, 43, 3, 9, 82, 10]))
---
It's time to put all the pieces together into one of the most famous algorithms in history!

### The Full Cycle:
1. **Base Case:** If list size $\le 1$, return it.
2. **Split:** Slice the list in half.
3. **Recurse:** Call `panga` on the left half. Call `panga` on the right half.
4. **Merge:** Use our `unganisha` function to combine the two now-sorted halves.

**Your Task:** Fill in the recursive calls. You must call `panga` on `kata(orodha, 0, kati)` and `panga` on `kata(orodha, kati)`.

```nuru
fanya panga = unda(orodha) {
    kama (orodha.idadi() <= 1) { rudisha orodha }
    fanya kati = orodha.idadi() / 2
    fanya kushoto = +++panga(kata(orodha, 0, kati))+++
    fanya kulia = +++panga(kata(orodha, kati))+++
    rudisha unganisha(kushoto, kulia)
}

andika(panga([38, 27, 43, 3, 9, 82, 10]))
```

Wait, isn't it amazing? The function sorts the halves by calling *itself*! This is the true power of recursion.