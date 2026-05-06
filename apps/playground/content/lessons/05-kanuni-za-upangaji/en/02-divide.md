---
title: "2. Divide and Conquer"
task: "Use a `kwa` loop to split the `orodha` into two equal halves: `kushoto` (left) and `kulia` (right)."
initialCode: |
  fanya orodha = [1, 2, 3, 4, 5, 6]
  fanya katikati = orodha.idadi() / 2
  
  fanya kushoto = []
  fanya kulia = []
  
  kwa i, namba ktk orodha {
      kama (i < katikati) {
          
      } sivyo {
          
      }
  }
  
  andika("Kushoto:", kushoto)
  andika("Kulia:", kulia)
solution: |
  fanya orodha = [1, 2, 3, 4, 5, 6]
  fanya katikati = orodha.idadi() / 2
  
  fanya kushoto = []
  fanya kulia = []
  
  kwa i, namba ktk orodha {
      kama (i < katikati) {
          kushoto.sukuma(namba)
      } sivyo {
          kulia.sukuma(namba)
      }
  }
  
  andika("Kushoto:", kushoto)
  andika("Kulia:", kulia)
---
**Merge Sort** uses a strategy called **Divide and Conquer**.

Instead of trying to sort a big list all at once, we split it into two smaller lists. It's much easier to sort two small things than one big thing!

### The Split:
We find the middle index and slice the array in half using a `kwa` loop.

**Your Task:** Use a `kwa` loop to split the list in half.
- If the index `i` is less than `katikati`, push the number to `kushoto`.
- Otherwise, push it to `kulia`.

```nuru
fanya orodha = [1, 2, 3, 4, 5, 6]
fanya katikati = orodha.idadi() / 2

fanya kushoto = []
fanya kulia = []

kwa i, namba ktk orodha {
    kama (i < katikati) {
        +++kushoto.sukuma(namba)+++
    } sivyo {
        +++kulia.sukuma(namba)+++
    }
}

andika("Kushoto:", kushoto)
andika("Kulia:", kulia)
```