---
title: "3. Kutafuta Nafasi Inayofuata"
task: "Kamilisha kitendakazi cha kutafuta kisanduku kinachofuata kilicho wazi (0). Rudisha viwianishi vyake vya `[row, col]`."
initialCode: |
  fanya gridi = [
    [1, 0, 3, 0],
    [0, 0, 2, 1],
    [0, 1, 0, 2],
    [2, 4, 0, 3]
  ]

  fanya pata_tupu = unda() {
      kwa r ktk mfululizo(4) {
          kwa c ktk mfululizo(4) {
              kama (gridi[r][c] == 0) {
                  rudisha [r, c]
              }
          }
      }
      rudisha tupu // Hakuna visanduku vilivyo wazi tena!
  }

  fanya nafasi = pata_tupu()
  andika("Nafasi inayofuata iliyo wazi iko:", nafasi) // Inapaswa kuwa [0, 1]
solution: |
  andika("Sawa!")
---
Ili kutatua Sudoku, tunahitaji njia ya kutafuta kazi ya kufanya.

Tunakagua gridi kuanzia juu kwenda chini, kushoto kwenda kulia, hadi tupate `0`. Hiki ndicho kisanduku tutakachojaribu kujaza baadaye.

### Kwa nini turudishe `tupu`?
Ikiwa `pata_tupu()` inarudisha `tupu`, inamaanisha hakuna sifuri zilizobaki kwenye gridi. Hiyo inamaanisha **fumbo limetatuliwa!**

**Kazi Yako:** Endesha kodi na uone jinsi inavyotambua kwa usahihi `[0, 1]` kama nafasi ya kwanza iliyo wazi. Tuko tayari kuanza kukisia!