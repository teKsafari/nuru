---
title: "Changamoto ya Sudoku"
task: "Andika gridi mstari kwa mstari, ukionyesha kila `0` kama `_` na kuweka nafasi baada ya kila namba. Mstari wa kwanza uwe `1 _ 3 _`."
initialCode: |
  fanya gridi = [
      [1, 0, 3, 0],
      [0, 0, 2, 1],
      [0, 1, 0, 2],
      [2, 4, 0, 3]
  ]

  kwa mstari ktk gridi {
      andika(mstari)
  }
solution: |
  fanya gridi = [
      [1, 0, 3, 0],
      [0, 0, 2, 1],
      [0, 1, 0, 2],
      [2, 4, 0, 3]
  ]

  kwa mstari ktk gridi {
      fanya maandishi = ""
      kwa n ktk mstari {
          kama (n == 0) {
              maandishi = maandishi + "_ "
          } sivyo {
              maandishi = maandishi + tungo(n) + " "
          }
      }
      andika(maandishi)
  }
tests:
  - type: match_code
    pattern: 'kwa[\s\S]*\{[\s\S]*kwa'
    message: "Tumia kitanzi ndani ya kitanzi: kimoja kwa mistari, kingine kwa namba za kila mstari."
  - type: exact_output
    message: "Gridi ianze na mstari 1 _ 3 _ na kila 0 ionekane kama _."
---
Karibu kwenye changamoto ya mwisho: programu inayotatua **Sudoku**.

Sudoku ndogo ina gridi ya 4 kwa 4. Lengo ni kujaza visanduku vitupu kwa namba 1 hadi 4 ili:

1. Kila **mstari** uwe na 1, 2, 3 na 4 bila kurudia.
2. Kila **safu** iwe na 1, 2, 3 na 4 bila kurudia.
3. Kila **kisanduku** cha 2 kwa 2 kiwe na 1, 2, 3 na 4 bila kurudia.

### Orodha ndani ya orodha

Tunahifadhi gridi kama orodha ya mistari. Kila mstari ni orodha ya namba. `0` inamaanisha kisanduku kitupu.

```nuru
fanya gridi = [[1, 0], [0, 2]]
andika(gridi[0])    // [1, 0]: mstari wa kwanza
andika(gridi[1][1]) // 2: mstari wa pili, safu ya pili
```

Kupitia kila namba, unahitaji kitanzi **ndani** ya kitanzi: cha nje kinapitia mistari, cha ndani kinapitia namba za mstari huo.
