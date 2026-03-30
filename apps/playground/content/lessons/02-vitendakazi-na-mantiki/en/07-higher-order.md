---
title: "7. Higher-Order Functions"
task: "Pass the `kicheko` function as an argument into `fanya_mara_mbili`."
initialCode: |
  fanya kicheko = unda() {
      andika("Hahaha!")
  }

  // This function expects another function as 'kazi'
  fanya fanya_mara_mbili = unda(kazi) {
      kazi()
      kazi()
  }

  // Piga fanya_mara_mbili ukipitisha kicheko!
  fanya_mara_mbili( /* nini? */ )
solution: |
  fanya kicheko = unda() {
      andika("Hahaha!")
  }

  fanya fanya_mara_mbili = unda(kazi) {
      kazi()
      kazi()
  }

  fanya_mara_mbili(kicheko)
---
Wait... you can pass a function *into* another function?! Yes! 

In Nuru, functions are **First-Class Citizens**. This means you can treat them like any other value (like numbers or strings). You can store them in variables and pass them as arguments.

A function that takes another function as an argument is called a **Higher-Order Function**.

### Example:
```s
fanya piga_kelele = unda() {
    andika("AAAH!")
}

fanya endesha = unda(f) {
    f() // Execute the passed function
}

endesha(piga_kelele) // AAAH!
```

**Your Task:** Pass the `kicheko` function into `fanya_mara_mbili` so that the laughter is repeated twice! Notice you do NOT use `()` when passing the function name.