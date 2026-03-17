---
title: "1. Changamoto ya Sudoku"
task: "Endesha kodi ili uone gridi ya Sudoku ya 4x4 iliyowakilishwa katika safu ya 2D (2D array). Ni namba gani zinakosekana?"
initialCode: |
  fanya gridi = [
    [1, 0, 3, 0],
    [0, 0, 2, 1],
    [0, 1, 0, 2],
    [2, 4, 0, 3]
  ]

  // 0 inamaanisha kisanduku kiko wazi (tupu).
  andika("Gridi ya Sudoku:")
  kwa (fanya i = 0; i < idadi(gridi); i = i + 1) {
      andika(gridi[i])
  }
solution: |
  andika("Sawa!")
---
Karibu kwenye changamoto ya mwisho ya safari yetu ya kujirudia: **Suluhisho la Sudoku**.

Gridi ya Sudoku ni safu ya 2D (orodha ya orodha). Lengo ni kujaza kila `0` kwa namba kuanzia 1 hadi 4 (katika gridi ya 4x4) ili:
1. Hakuna namba inayojirudia katika **Mstari** (Row).
2. Hakuna namba inayojirudia katika **Safu** (Column).
3. Hakuna namba inayojirudia katika **Kikundi** (Box).

**Kazi Yako:** Angalia gridi hiyo. Tunatumia `0` kuwakilisha visanduku vilivyo wazi. Kompyuta inaanzaje kutatua fumbo hili? Tutatumia mbinu inayoitwa **Backtracking**.