---
title: "6. Comparisons and Logic"
task: "Compare if `50` is greater than `20` **AND** `10` is equal to `10`."
initialCode: |
  andika(50 > 20 && 10 == 10)
solution: "andika(50 > 20 && 10 == 10)"
---
When you want to compare values, you use these operators:

### Comparison Operators:
- `==` (Equal), `!=` (Not equal), `>` (Greater), `<` (Less), `>=` (Greater or equal), `<=` (Less or equal).

### Logic Operators:
- `&&` (**And**): True if both are true.
- `||` (**Or**): True if at least one is true.
- `!` (**Not**): Inverts `kweli` to `sikweli`.

### Example:
```s
andika(10 > 5)          // true
andika(5 == 5 && 2 > 3) // false (because 2 is not more than 3)
andika(5 == 5 || 2 > 3) // true (because one side is true)
```

