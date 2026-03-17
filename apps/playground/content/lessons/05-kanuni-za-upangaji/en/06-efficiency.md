---
title: "6. Why Merge Sort?"
task: "Run the code to see how Merge Sort handles a list of 100 items."
initialCode: |
  // Let's generate a big list of 100 numbers
  fanya orodha_kubwa = []
  fanya i = 100
  wakati (i > 0) {
      orodha_kubwa = weka(orodha_kubwa, i)
      i = i - 1
  }

  // Use the Merge Sort we built!
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

  fanya panga = unda(orodha) {
      kama (idadi(orodha) <= 1) { rudisha orodha }
      fanya kati = idadi(orodha) / 2
      fanya kushoto = panga(kata(orodha, 0, kati))
      fanya kulia = panga(kata(orodha, kati))
      rudisha unganisha(kushoto, kulia)
  }

  andika("Sorting 100 items...")
  andika(panga(orodha_kubwa))
solution: |
  andika("Sawa!")
---
Why did we do all this work? Why not just use a simple loop?

There are many ways to sort, like **Bubble Sort**. But Bubble Sort is slow—as the list gets 10 times bigger, it takes 100 times longer!

**Merge Sort** is much more efficient. Because it always splits the problem in half, it is incredibly fast even for millions of items. In computer science, we call this $O(N \log N)$ efficiency.

### Congratulations!
You now understand:
1. **Divide and Conquer:** Breaking big problems into small pieces.
2. **Merging Logic:** Combining results in order.
3. **Algorithmic Efficiency:** Why the way we write code matters for speed.

**Your Task:** Run the code and watch it effortlessly sort 100 numbers. You've just implemented a professional-grade sorting algorithm!