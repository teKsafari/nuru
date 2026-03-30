---
title: "10. Kwa Loops"
task: "Write a loop that prints numbers from 0 to 4 using `mfululizo(5)`."
initialCode: |
  kwa i ktk mfululizo(5) {
      andika(i)
  }
solution: "kwa i ktk mfululizo(5) {\n    andika(i)\n}"
---
Loops are used to repeat an action many times. The word `kwa` helps us iterate through everything in an array or string.

### Iterating through an Array:
```s
fruits = ["Mango", "Papaya", "Pineapple"]
kwa f ktk fruits {
    andika("I like", f)
}
```

### Using mfululizo():
```s
kwa i ktk mfululizo(1, 6) {
    andika("Number:", i) // Prints 1, 2, 3, 4, 5
}
```

