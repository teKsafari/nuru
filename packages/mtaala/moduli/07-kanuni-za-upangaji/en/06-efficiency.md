---
title: "How Fast Is Merge Sort?"
task: "Inside the first loop of `unganisha`, increase `hesabu[\"ulinganisho\"]` by 1 every time two numbers are compared. Then run it to see how many comparisons Merge Sort needs to sort 100 numbers."
---
There are many ways to sort. The simplest is **Bubble Sort**: compare each pair of neighbours, swap them if they are out of order, and repeat again and again.

Bubble Sort needs about `n x n / 2` comparisons. For 100 numbers, that is nearly **5,000**. For one million numbers, it is 500 billion!

Merge Sort splits the list in half, then in half again. 100 numbers are split only 7 times to reach single-item pieces, and each level needs at most 100 comparisons. The total is just a few hundred.

- 100 numbers: Bubble Sort needs about 5,000 comparisons, Merge Sort only a few hundred
- 1,000,000 numbers: Bubble Sort needs about 500,000,000,000, Merge Sort about 20,000,000

Congratulations! You have built an algorithm that real software uses every day, from ranking exam results to sorting products in online shops.
