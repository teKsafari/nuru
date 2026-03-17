---
title: "2. Divide and Conquer"
task: "Use the `kata` function to split the `orodha` into two equal halves: `kushoto` (left) and `kulia` (right)."
initialCode: |
  fanya orodha = [1, 2, 3, 4, 5, 6]
  
  fanya katikati = idadi(orodha) / 2
  
  // Use kata(list, start, end)
  fanya kushoto = // kata orodha from 0 to katikati
  fanya kulia = // kata orodha from katikati to end
  
  andika("Kushoto:", kushoto)
  andika("Kulia:", kulia)
solution: |
  fanya orodha = [1, 2, 3, 4, 5, 6]
  fanya katikati = idadi(orodha) / 2
  
  fanya kushoto = kata(orodha, 0, katikati)
  fanya kulia = kata(orodha, katikati)
  
  andika("Kushoto:", kushoto)
  andika("Kulia:", kulia)
---
**Merge Sort** uses a strategy called **Divide and Conquer**.

Instead of trying to sort a big list all at once, we split it into two smaller lists. It's much easier to sort two small things than one big thing!

### The Split:
We find the middle index and slice the array in half.

**Your Task:** Use the `kata` function to split the list in half.
- `kata(orodha, 0, katikati)` gets the first half.
- `kata(orodha, katikati)` gets the rest. (Wait, did you know if you leave out the last number, it goes to the end?)