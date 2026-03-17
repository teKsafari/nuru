---
title: "5. Suluhisho la Mwisho"
task: "Endesha suluhisho kamili na utazame likijaza gridi! Umetoka tu kujenga programu inayoweza kutatua mafumbo."
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
  
  andika("SUDOKU IMETATULIWA!")
  kwa (fanya i = 0; i < 4; i = i + 1) { andika(gridi[i]) }
solution: |
  andika("Sawa!")
---
Umefika mwisho wa kozi hii!

Kwa kuunganisha **Safu za 2D**, **Vitanzi** (Loops), **Mantiki**, na **Kujirudia** (Recursion), umeunda programu "Inayofikiri".

### Kwa nini hii ni kubwa:
Algorithm hii ya Backtracking inatumiwa pia:
- Kutatua mafumbo kama Chess.
- Kupanga safari za ndege kwa mashirika ya ndege.
- Kupanga njia zenye ufanisi zaidi za utoaji bidhaa kwa malori.

### Sasa wewe ni Mpangaji Programu!
Ulianza na `andika("Jambo")` na umemaliza na suluhisho la Sudoku linalojiendesha lenyewe. Ulimwengu wa teknolojia sasa ni wako kuuchunguza.

**Kazi Yako:** Endesha suluhisho la mwisho. Angalia jinsi sifuri zilivyobadilishwa na namba sahihi. Hongera sana kwa kukamilisha Mafunzo ya Nuru Wasm!