---
title: "5. Calling Functions from Functions"
task: "Complete the `salimia` function to call the `tafuta_jina` function to get the name to print."
initialCode: |
  fanya tafuta_jina = unda() {
      rudisha "Amani"
  }

  fanya salimia = unda() {
      // 1. Get the name
      fanya jina = // piga tafuta_jina() hapa (call tafuta_jina() here)
      
      // 2. Print the greeting
      andika("Habari", jina)
  }

  salimia()
solution: |
  fanya tafuta_jina = unda() {
      rudisha "Amani"
  }

  fanya salimia = unda() {
      fanya jina = tafuta_jina()
      andika("Habari", jina)
  }

  salimia()
---
In programming, functions often rely on other functions to get their jobs done. 

If you have a complex problem, you don't need to write one massive function. Instead, you can create many small, simple functions that call each other! This makes your code much easier to read and fix.

### Example:
```s
fanya pata_namba = unda() {
    rudisha 10
}

fanya hesabu = unda() {
    fanya n = pata_namba()
    andika(n + 1) // 11
}

hesabu()
```

**Your Task:** Inside the `salimia` function, call `tafuta_jina()` and store the result in the `jina` variable. Then use that variable in the greeting!