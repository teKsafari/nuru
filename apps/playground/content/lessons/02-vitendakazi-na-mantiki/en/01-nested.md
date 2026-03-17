---
title: "1. Function inside another"
task: "Change `salamu('World')` to your own name and see what happens."
initialCode: |
  fanya salamu = unda(name) {
      andika("Hello,", name)
  }

  fanya start = unda() {
      salamu("World")
      andika("Program finished.")
  }

  start()
solution: |
  fanya salamu = unda(name) {
      andika("Hello,", name)
  }

  fanya start = unda() {
      salamu("Amani")
      andika("Program finished.")
  }

  start()
---
In Nuru, a function is like a worker. You can tell one worker to call another worker to help them.

Here we have a `start` function that calls the `salamu` function to help it display a message. This helps us keep our code clean and organized.
