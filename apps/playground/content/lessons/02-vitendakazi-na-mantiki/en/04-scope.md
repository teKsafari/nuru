---
title: "4. Variable Scope"
task: "Move `fanya siri = 'Nywila'` inside the `ficha` function so it becomes a 'Local' variable."
initialCode: |
  fanya siri = "Nywila"

  fanya ficha = unda() {
      // Sogeza siri hapa ndani (Move siri in here)
      andika(siri)
  }
  
  ficha()
  
  // This should crash if siri is hidden inside! Try it after fixing.
  // andika("Nje ya function:", siri) 
solution: |
  fanya ficha = unda() {
      fanya siri = "Nywila"
      andika(siri)
  }
  
  ficha()
---
**Scope** is the area where a variable is allowed to exist.

- **Global Scope:** Variables created outside of any function. Everyone can see and change them. This can lead to bugs!
- **Local Scope:** Variables created *inside* a function. They are locked inside! Outside code cannot see them.

### Example:
```s
fanya jina = "Amani" // Global

fanya siri = unda() {
    fanya password = "123" // Local
    andika(password) // This works!
}

andika(jina) // Works
andika(password) // ERROR! The computer doesn't know what 'password' is out here.
```

Local variables are safer because they don't clutter up your program. 

**Your Task:** Move the `siri` variable inside the `ficha` function to make it local.