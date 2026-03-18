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
      kwa i katika mfululizo(4) {
          kama (gridi[r][i] == n || gridi[i][c] == n) { rudisha sikweli }
      }
      rudisha kweli
  }

  fanya tatua = unda() {
      kwa r katika mfululizo(4) {
          kwa c katika mfululizo(4) {
              kama (gridi[r][c] == 0) {
                  kwa n katika mfululizo(1, 5) {
                      kama (ni_salama(r, c, n)) {
                          gridi[r][c] = n
                          kama (tatua()) { rudisha kweli }
                          gridi[r][c] = 0 // Backtrack
                      }
                  }
                  rudisha sikweli
              }
          }
      }
      rudisha kweli
  }

  tatua()
  
  andika("SUDOKU IMETATULIWA!")
  kwa i katika mfululizo(4) { andika(gridi[i]) }
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