---
title: "12. Type Conversion"
task: "Take a number from the user, add 10 to it, and display the result."
initialCode: |
  n = jaza("Weka namba: ")
  andika(namba(n) + 10)
solution: "n = jaza(\"10\")\nandika(namba(n) + 10)"
---
As you remember, `jaza()` returns text. If you want to do math with that input, you must convert it to a number.

### Conversion Helpers:
- `namba(thing)`: Converts to an integer.
- `tungo(thing)`: Converts to a string.

### Example:
```s
fanya input = jaza("Enter a number: ") // "10"
fanya x = namba(input)                 // 10 (now it's a number)
andika(x + 5)                          // 15
```

