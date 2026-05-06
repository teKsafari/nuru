---
title: "11. While Loops (wakati)"
task: "Write a `wakati` loop that starts with `n = 5` and decreases down to `1` (n = n - 1)."
initialCode: |
  n = 5
   {
      andika(n)
      
  }
solution: "n = 5\nwakati (n > 0) {\n    andika(n)\n    n = n - 1\n}"
---
A `wakati` loop continues to repeat as long as a certain condition is true.

**Warning**: Make sure that condition will eventually become false, otherwise the program will loop forever!

### Task:
```nuru
n = 5
+++wakati (n > 0)+++ {
    andika(n)
    +++n = n - 1+++
}
```

