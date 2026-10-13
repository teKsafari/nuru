---
title: "Splitting the List"
task: "Finish the loop: if position `i` is less than `kati`, push `namba` onto `kushoto` (left). Otherwise push it onto `kulia` (right)."
---
Merge Sort uses a **divide and conquer** strategy: when a big problem is hard, split it into two smaller problems.

Sorting a list of 6 numbers is harder than sorting two lists of 3. Those are harder than lists of 1... which need no sorting at all!

### Step one: splitting

We find the middle, then go through the list. Each number goes to its side based on its position:

```nuru
kwa i, tunda ktk ["embe", "papai", "fenesi"] {
    andika(+++i+++, tunda) // 0 embe, 1 papai, 2 fenesi
}
```

Remember the loop with positions from the Light Board module: `kwa i, kitu ktk orodha` gives you the position `i` and the item itself.
