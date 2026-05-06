---
title: "8. Returning Functions (Closures)"
task: "Call `tengeneza_salamu()` and save it in a variable called `sema_jambo`, then call `sema_jambo()`."
initialCode: |
  fanya tengeneza_salamu = unda() {
      // This function returns another function!
      rudisha unda() {
          andika("Jambo kutoka ndani!")
      }
  }

  // 1. Get the new function
  // fanya sema_jambo = ?
  
  // 2. Call the new function
  // ?
solution: |
  fanya tengeneza_salamu = unda() {
      rudisha unda() {
          andika("Jambo kutoka ndani!")
      }
  }

  fanya sema_jambo = tengeneza_salamu()
  sema_jambo()
---
Just like we can pass functions *into* other functions, we can also **return** a function from a function!

This is often used to create specialized "factory" functions.

### Example:
```s
fanya ubao = unda(rangi) {
    // This function 'remembers' the rangi!
    rudisha unda() {
        andika("Kuchora kwa rangi ya", rangi)
    }
}

fanya chora_nyekundu = ubao("Nyekundu")
chora_nyekundu() // Prints: Kuchora kwa rangi ya Nyekundu
```

This is called a **Closure** because the inner function "closes over" and remembers the variables from the outer function even after the outer function finishes.

**Your Task:** Get the inner function by writing +++fanya sema_jambo = tengeneza_salamu()+++ and then run it by calling +++sema_jambo()+++!