---
title: "5. The Final Solver"
task: "Run the full solver and watch it fill the grid! You've just built a program that can solve puzzles."
initialCode: |
  fanya gridi = [
    [1, 0, 3, 0],
    [0, 0, 2, 1],
    [0, 1, 0, 2],
    [2, 4, 0, 3]
  ]

  fanya ni_salama = unda(r, c, n) {
      kwa (fanya i = 0; i < 4; i = i + 1) {
          kama (gridi[r][i] == n au gridi[i][c] == n) { rudisha urongo }
      }
      rudisha kweli
  }

  fanya tatua = unda() {
      kwa (fanya r = 0; r < 4; r = r + 1) {
          kwa (fanya c = 0; c < 4; c = c + 1) {
              kama (gridi[r][c] == 0) {
                  kwa (fanya n = 1; n <= 4; n = n + 1) {
                      kama (ni_salama(r, c, n)) {
                          gridi[r][c] = n
                          kama (tatua()) { rudisha kweli }
                          gridi[r][c] = 0 // Backtrack
                      }
                  }
                  rudisha urongo
              }
          }
      }
      rudisha kweli
  }

  tatua()
  
  andika("SUDOKU SOLVED!")
  kwa (fanya i = 0; i < 4; i = i + 1) { andika(gridi[i]) }
solution: |
  andika("Sawa!")
---
You've reached the end of the course! 

By combining **2D Arrays**, **Loops**, **Logic**, and **Recursion**, you've created an "Intelligent" program. 

### Why this is huge:
This same Backtracking algorithm is used to:
- Solve puzzles like Chess.
- Schedule flights for airlines.
- Map out the most efficient delivery routes for trucks.

### You are now a Programmer!
You started with `andika("Jambo")` and you ended with an automated Sudoku solver. The world of technology is now yours to explore.

**Your Task:** Run the final solver. Look at how the empty zeros were replaced by the correct numbers. Congratulations on completing the Nuru Wasm Tutorial!