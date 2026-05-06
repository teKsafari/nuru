---
title: "2. Passing Arguments"
task: "Complete the `karibu` function so it greets a person using the `jina` argument."
initialCode: |
  fanya karibu = unda(jina) {
      andika("Karibu,", /* weka jina hapa (put jina here) */)
  }
  
  karibu("Amani") // Should print: Karibu, Amani
  karibu("Tariq") // Should print: Karibu, Tariq
solution: |
  fanya karibu = unda(jina) {
      andika("Karibu,", jina)
  }
  
  karibu("Amani")
  karibu("Tariq")
---
A machine isn't very useful if it does the exact same thing every time. 

**Arguments** let you pass information *into* a function. Think of arguments as the raw materials you feed into your machine.

### Example:
```s
fanya jumlisha = unda(+++a, b+++) {
    andika(a + b)
}

jumlisha(5, 10) // Prints 15
jumlisha(100, 1) // Prints 101
```

When we create `unda(jina)`, `jina` acts as a placeholder variable. When we call `karibu("Amani")`, the computer replaces `jina` with `"Amani"` inside the function.

**Your Task:** Finish the `karibu` function so it can welcome anyone by their name!

```s
fanya karibu = unda(jina) {
    andika("Karibu,", +++jina+++)
}
```