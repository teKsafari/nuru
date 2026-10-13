---
title: "Comparison and Logic"
task: "Amina scored `hisabati = 75` and `kiswahili = 48`. Print two lines: first whether she passed **both** subjects (`&&`), then whether she passed **at least one** (`||`). The pass mark is 50."
---
When you compare two values, the answer is `kweli` (true) or `sikweli` (false).

- `==` equal to: `5 == 5` is `kweli`
- `!=` not equal to: `5 != 5` is `sikweli`
- `>` greater than: `8 > 3` is `kweli`
- `<` less than: `8 < 3` is `sikweli`
- `>=` greater than or equal to: `50 >= 50` is `kweli`
- `<=` less than or equal to: `49 <= 50` is `kweli`

Remember: a single `=` stores a value in a variable. A double `==` compares.

### Combining conditions

- `&&` (and): true if **all** conditions are true.
- `||` (or): true if **at least one** is true.
- `!` (not): turns `kweli` into `sikweli`.

```nuru
fanya umri = 14
fanya ana_tiketi = kweli
andika(umri >= 12 +++&&+++ ana_tiketi) // kweli: they can enter the stadium
```
