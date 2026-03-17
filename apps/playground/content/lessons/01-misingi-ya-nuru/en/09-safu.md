---
title: "9. Lists (Arrays)"
task: "Create an array of `colors` with \"red\" and \"green\", add \"blue\" using `sukuma`, then print the number of colors."
initialCode: |
  rangi = ["nyekundu", "kijani"]
  rangi.sukuma("bluu")
  andika(rangi.idadi())
solution: "rangi = [\"nyekundu\", \"kijani\"]\nrangi.sukuma(\"bluu\")\nandika(rangi.idadi())"
---
An array is a collection of many things in a single box. These things are placed inside square brackets `[ ]`.

### Key Facts:
- The first position is **0**.
- The second position is **1**, and so on.
- `idadi()` gives you the number of items.
- `sukuma(item)` adds an item to the end.

### Example:
```s
fanya students = ["Juma", "Asha"]
students.sukuma("Baraka")
andika(students[0])      // Juma
andika(students.idadi()) // 3
```

