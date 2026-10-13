---
title: "Je, Ni Salama?"
task: "Kamilisha `ni_salama`: baada ya kukagua mstari, kagua **safu** pia. Kama `gridi[i][safu]` ni sawa na `namba` kwa `i` yoyote, rudisha `sikweli`."
initialCode: |
  fanya gridi = [
      [1, 0, 3, 0],
      [0, 0, 2, 1],
      [0, 1, 0, 2],
      [2, 4, 0, 3]
  ]

  fanya ni_salama = unda(mstari, safu, namba) {
      // Kagua mstari
      kwa i ktk mfululizo(4) {
          kama (gridi[mstari][i] == namba) {
              rudisha sikweli
          }
      }
      // Kagua safu hapa

      rudisha kweli
  }

  andika("4 kwenye [0, 1]?", ni_salama(0, 1, 4))
  andika("2 kwenye [0, 1]?", ni_salama(0, 1, 2))
  andika("3 kwenye [0, 1]?", ni_salama(0, 1, 3))
solution: |
  fanya gridi = [
      [1, 0, 3, 0],
      [0, 0, 2, 1],
      [0, 1, 0, 2],
      [2, 4, 0, 3]
  ]

  fanya ni_salama = unda(mstari, safu, namba) {
      // Kagua mstari
      kwa i ktk mfululizo(4) {
          kama (gridi[mstari][i] == namba) {
              rudisha sikweli
          }
      }
      // Kagua safu hapa
      kwa i ktk mfululizo(4) {
          kama (gridi[i][safu] == namba) {
              rudisha sikweli
          }
      }
      rudisha kweli
  }

  andika("4 kwenye [0, 1]?", ni_salama(0, 1, 4))
  andika("2 kwenye [0, 1]?", ni_salama(0, 1, 2))
  andika("3 kwenye [0, 1]?", ni_salama(0, 1, 3))
tests:
  - type: match_code
    pattern: 'gridi\[\s*i\s*\]\[\s*safu\s*\]'
    message: "Kagua safu kwa kulinganisha gridi[i][safu] na namba."
  - type: exact_output
    message: "4 si salama (iko kwenye safu), 2 ni salama, na 3 si salama (iko kwenye mstari)."
---
Kabla ya kuweka namba kwenye kisanduku, lazima tuhakikishe haileti mgongano. Tunaita hii **ukaguzi**.

Kwa kisanduku cha mstari `m` na safu `s`:

- Kwenye **mstari** `m`, namba zake ni `gridi[m][0]`, `gridi[m][1]`, `gridi[m][2]`, `gridi[m][3]`. Nafasi ya safu inabadilika.
- Kwenye **safu** `s`, namba zake ni `gridi[0][s]`, `gridi[1][s]`, `gridi[2][s]`, `gridi[3][s]`. Nafasi ya mstari inabadilika.

```text
       safu 1
         v
    [1, _, 3, _]  <- mstari 0
    [_, _, 2, 1]
    [_, 1, _, 2]
    [2, 4, _, 3]
```

Kwenye kisanduku `[0, 1]`: mstari 0 una 1 na 3, safu 1 ina 1 na 4. Hivyo namba pekee salama ni 2.

`rudisha sikweli` ndani ya kitanzi inamaliza kitendakazi papo hapo. Hatuhitaji kuendelea kukagua tukishapata mgongano mmoja.
