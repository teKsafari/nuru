---
title: "3. Finding the Next Spot"
task: "Complete the function to find the next empty cell (0). Return its `[row, col]` coordinates."
initialCode: |
  fanya gridi = [
    [1, 0, 3, 0],
    [0, 0, 2, 1],
    [0, 1, 0, 2],
    [2, 4, 0, 3]
  ]

  fanya pata_tupu = unda() {
      kwa r katika mfululizo(4) {
          kwa c katika mfululizo(4) {
              kama (gridi[r][c] == 0) {
                  rudisha [r, c]
              }
          }
      }
      rudisha tupu // No more empty cells!
  }

  fanya nafasi = pata_tupu()
  andika("Next empty cell is at:", nafasi) // Should be [0, 1]
solution: |
  andika("Sawa!")
---
To solve Sudoku, we need a way to look for work. 

We scan the grid from top-to-bottom, left-to-right, until we find a `0`. This is the cell we will try to fill next.

### Why return `tupu`?
If `pata_tupu()` returns `tupu`, it means there are no more zeros left in the grid. That means **the puzzle is solved!**

**Your Task:** Run the code and notice how it correctly identifies `[0, 1]` as the first empty spot. We are ready to start guessing!