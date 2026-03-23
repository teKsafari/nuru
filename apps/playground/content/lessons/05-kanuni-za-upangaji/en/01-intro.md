---
title: "1. The Power of Order"
task: "Try to find the number 42 in the unsorted list. How many steps did it take? Then find it in the sorted list."
initialCode: |
  fanya orodha_mbaya = [10, 5, 42, 3, 99, 1]
  fanya orodha_nzuri = [1, 3, 5, 10, 42, 99]
  
  // No code to write yet, just run and think!
  andika("Orodha mbaya:", orodha_mbaya)
  andika("Orodha nzuri:", orodha_nzuri)
solution: |
  andika("Sawa!")
---
Why do we care about **Sorting**? 

Imagine looking for a word in a dictionary where the pages were in a random order. It would take hours! Because dictionaries are **Sorted** (A-Z), you can find any word in seconds.

In computer science, sorting is the foundation of fast searching.

**Your Task:** Run the code. Notice how much easier it is for a human (and a computer) to reason about a list that is in order. We're going to learn the most powerful sorting algorithm: **Merge Sort**.