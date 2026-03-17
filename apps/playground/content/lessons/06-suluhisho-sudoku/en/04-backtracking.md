---
title: "4. Backtracking (The Guess)"
task: "Complete the backtracking step. If `tatua()` returns `urongo`, reset the cell back to `0`."
initialCode: |
  // Concept code - don't worry about errors yet!
  fanya tatua = unda() {
      fanya nafasi = pata_tupu()
      kama (nafasi == tupu) { rudisha kweli } // Puzzle solved!

      fanya r = nafasi[0]
      fanya c = nafasi[1]

      kwa (fanya n = 1; n <= 4; n = n + 1) {
          kama (ni_salama(r, c, n)) {
              gridi[r][c] = n // 1. Make a guess

              kama (tatua()) { rudisha kweli } // 2. Recursively try to solve the rest

              // 3. OH NO! This guess didn't work.
              // We need to 'Backtrack' and try the next number.
              // Reset gridi[r][c] to 0 here!
          }
      }
      rudisha urongo // No number works here, go back to previous call
  }
solution: |
  // gridi[r][c] = 0
---
**Backtracking** is like exploring a maze. 
1. You reach a fork in the road and make a guess.
2. If you hit a dead end, you **backtrack** to the last fork and try the other path.

In Sudoku, if we place a `4` but later find out it's impossible to finish the puzzle, we must remove the `4` (set it back to `0`) and try a different number.

**Your Task:** This is the most important line in backtracking. If the recursive call `tatua()` fails, we must undo our guess. Set `gridi[r][c] = 0` so we can try the next number in the loop.