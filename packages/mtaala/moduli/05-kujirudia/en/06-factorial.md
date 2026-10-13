---
title: "Factorial"
task: "Finish `factorial` with the recursive step: `n` times `factorial(n - 1)`."
---
Recursion shines in calculations built on smaller answers.

The **factorial** of `n`, written `n!`, is the product of all the numbers from 1 to `n`:

`5! = 5 x 4 x 3 x 2 x 1 = 120`

Spot the trick: `5!` is `5 x 4!`. And `4!` is `4 x 3!`. Every factorial has a smaller factorial inside it.

```nuru
// A similar example: the sum of the numbers 1 to n
fanya jumla_hadi = unda(n) {
    kama (n == 0) {
        rudisha 0
    }
    +++rudisha n + jumla_hadi(n - 1)+++
}

andika(jumla_hadi(4)) // 4 + 3 + 2 + 1 = 10
```

Factorials grow very fast. Try `factorial(20)` when you finish!
