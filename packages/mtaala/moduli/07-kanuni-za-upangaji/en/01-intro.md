---
title: "Why Sort?"
task: "Use a `kwa` loop to find the lowest mark in the `alama` array, then print it."
---
Imagine a Swahili dictionary whose words are not in alphabetical order. Finding one word would take you an hour! Because the words are **sorted**, you find it in seconds.

Computers sort data all the time: exam results from top to bottom, songs by name, products by price.

### With an unsorted list

To find the lowest mark, you have to look at **every** mark. There is no shortcut:

```nuru
fanya bei = [1200, 800, 1500]
fanya kubwa = bei[0]
kwa b ktk bei {
    kama (b > kubwa) {
        +++kubwa = b+++
    }
}
andika(kubwa) // 1500
```

If the list were sorted, the answer would be `alama[0]` straight away. In this module you will build **Merge Sort**, one of the best sorting methods ever invented.
