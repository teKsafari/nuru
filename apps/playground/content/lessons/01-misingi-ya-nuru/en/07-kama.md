---
title: "7. Conditionals (kama/else if/sivyo)"
task: "Change `alama = 40` and see if the program tells you \"You failed\"."
initialCode: |
  alama = 
  kama ( ) {
      andika("Umefaulu!")
  } sivyo {
      andika("Umefeli, jaribu tena.")
  }
solution: "alama = 40\nkama (alama >= 50) {\n    andika(\"Umefaulu!\")\n} sivyo {\n    andika(\"Umefeli, jaribu tena.\")\n}"
---
A program can make decisions based on certain conditions using `kama`.

### Structure:
```s
kama (condition) {
    // do this if condition is true
} au kama (other_condition) {
    // do this if first condition is false and this one is true
} sivyo {
    // do this if all above are false
}
```

### Task:
```nuru
alama = +++60+++
kama (+++alama >= 50+++) {
    andika("Umefaulu!")
} sivyo {
    andika("Umefeli, jaribu tena.")
}
```

