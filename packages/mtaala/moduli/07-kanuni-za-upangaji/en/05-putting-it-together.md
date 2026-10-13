---
title: "The Complete Merge Sort"
task: "Finish `panga`: sort the left half and the right half recursively, then return `unganisha` of the two halves."
---
All the pieces are ready. Time to join them into one of the most famous algorithms in the history of computing!

Merge Sort has four steps:

1. **Base case**: a list with one item or fewer is already sorted. Return it.
2. **Divide**: cut the list in the middle.
3. **Recurse**: sort each half by calling `panga` itself.
4. **Merge**: two sorted halves become one sorted list.

```text
[38, 27, 43, 3]
split:   [38, 27]          [43, 3]
split:   [38] [27]         [43] [3]
merge:   [27, 38]          [3, 43]
merge:   [3, 27, 38, 43]
```

Step three is the magic: the function trusts that `panga` will sort both halves, even though we are still writing it! That is the power of recursion.
