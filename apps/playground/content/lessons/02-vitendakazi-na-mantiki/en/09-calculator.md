---
title: "9. Mini-Project: Calculator"
task: "Finish the `kikokotozi` (calculator) function by filling in the logic for subtraction, multiplication, and division."
initialCode: |
  fanya kikokotozi = unda(a, b, tendo) {
      kama (tendo == "jumla") {
          rudisha a + b
      }
      kama (tendo == "toa") {
          // ?
      }
      kama (tendo == "zidisha") {
          // ?
      }
      kama (tendo == "gawanya") {
          // ?
      }
      rudisha "Tendo halijulikani"
  }

  andika("10 + 5 =", kikokotozi(10, 5, "jumla"))
  // andika("10 - 5 =", kikokotozi(10, 5, "toa"))
  // andika("10 * 5 =", kikokotozi(10, 5, "zidisha"))
  // andika("10 / 5 =", kikokotozi(10, 5, "gawanya"))
solution: |
  fanya kikokotozi = unda(a, b, tendo) {
      kama (tendo == "jumla") {
          rudisha a + b
      }
      kama (tendo == "toa") {
          rudisha a - b
      }
      kama (tendo == "zidisha") {
          rudisha a * b
      }
      kama (tendo == "gawanya") {
          rudisha a / b
      }
      rudisha "Tendo halijulikani"
  }

  andika("10 + 5 =", kikokotozi(10, 5, "jumla"))
  andika("10 - 5 =", kikokotozi(10, 5, "toa"))
  andika("10 * 5 =", kikokotozi(10, 5, "zidisha"))
  andika("10 / 5 =", kikokotozi(10, 5, "gawanya"))
---
Congratulations on making it this far! You've learned how to create functions, pass arguments, return values, and even handle scope and closures.

Now, let's build something useful: a **Calculator**.

### Using Logical Decisions:
We can use the `kama` (if) statement to check what the user wants to do. If `tendo == "jumla"`, we add the numbers. 

### Why this matters:
This pattern is used everywhere! From deciding which button a user clicked on a website to deciding how a character moves in a game.

**Your Task:** Complete the logic by writing +++rudisha a - b+++, +++rudisha a * b+++, and +++rudisha a / b+++ inside the respective `kama` blocks. Also, remove the `//` from the test calls at the bottom!