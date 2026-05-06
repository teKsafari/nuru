---
title: "1. Reviewing Functions"
task: "Create a function called `salamu` that prints 'Jambo!' when called."
initialCode: |
  // Unda function hapa (Create function here)
  fanya salamu = unda() {
      // ?
  }
  
  salamu()
solution: |
  fanya salamu = unda() {
      andika("Jambo!")
  }
  
  salamu()
---
Welcome back! In the basics, you learned that **Functions** are like small, reusable machines. You define them once, and you can run them as many times as you want.

We use the keyword `unda` to create a function. 

### How it looks:
```nuru
fanya piga_kelele = unda() {
    +++andika("AAAH!")+++
}

// To run it, we "call" it using parentheses:
piga_kelele()
piga_kelele()
```

In the example above, `piga_kelele()` runs the code inside the curly braces `{ ... }`. Since we called it twice, it would print "AAAH!" twice.

**Your Task:** Can you fix the `salamu` machine so it prints `"Jambo!"` to the screen?

```nuru
fanya salamu = unda() {
    +++andika("Jambo!")+++
}
```
