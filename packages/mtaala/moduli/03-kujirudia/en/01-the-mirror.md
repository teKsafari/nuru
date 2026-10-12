---
title: "1. The Mirror (Infinite Loop)"
task: "Run the code and see what happens when a function calls itself forever. Then fix it by commenting out the `kioo()` call inside."
initialCode: |
  fanya kioo = unda() {
      andika("Natazama kwenye kioo...")
      kioo() 
  }

  kioo()
solution: |
  fanya kioo = unda() {
      andika("Natazama kwenye kioo...")
      // kioo()
  }

  kioo()
---
Have you ever stood between two mirrors and seen an infinite line of reflections?

In programming, a function can actually call **itself**. This is called **Recursion**. 

### The Danger:
If a function calls itself without any rule to stop, it will run forever. Eventually, your computer will run out of memory (this is often called a "Stack Overflow").

### Example:
```s
fanya sema = unda() {
    andika("Habari!")
    sema() // Calling itself!
}

sema() // This will crash!
```

**Your Task:** Run the code to see it in action. Then, fix it by adding +++//+++ in front of the `kioo()` call inside the function so it only runs once.

```nuru
fanya kioo = unda() {
    andika("Natazama kwenye kioo...")
    +++//+++ kioo() 
}

kioo()
```
