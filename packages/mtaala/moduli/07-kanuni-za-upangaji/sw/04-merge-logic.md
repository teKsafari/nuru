---
title: "Kuunganisha"
task: "Kamilisha sehemu ya `sivyo` kwenye `unganisha`: badala ya `vunja`, sukuma `b[j]` kwenye `matokeo` na uongeze `j` kwa 1."
initialCode: |
  fanya unganisha = unda(a, b) {
      fanya matokeo = []
      fanya i = 0
      fanya j = 0

      wakati (i < a.idadi() && j < b.idadi()) {
          kama (a[i] <= b[j]) {
              matokeo.sukuma(a[i])
              i = i + 1
          } sivyo {
              // Badilisha vunja kwa kodi yako
              vunja
          }
      }

      // Vilivyobaki tayari vimepangwa
      wakati (i < a.idadi()) {
          matokeo.sukuma(a[i])
          i = i + 1
      }
      wakati (j < b.idadi()) {
          matokeo.sukuma(b[j])
          j = j + 1
      }
      rudisha matokeo
  }

  andika(unganisha([3, 27, 38], [9, 10, 43, 82]))
solution: |
  fanya unganisha = unda(a, b) {
      fanya matokeo = []
      fanya i = 0
      fanya j = 0

      wakati (i < a.idadi() && j < b.idadi()) {
          kama (a[i] <= b[j]) {
              matokeo.sukuma(a[i])
              i = i + 1
          } sivyo {
              matokeo.sukuma(b[j])
              j = j + 1
          }
      }

      // Vilivyobaki tayari vimepangwa
      wakati (i < a.idadi()) {
          matokeo.sukuma(a[i])
          i = i + 1
      }
      wakati (j < b.idadi()) {
          matokeo.sukuma(b[j])
          j = j + 1
      }
      rudisha matokeo
  }

  andika(unganisha([3, 27, 38], [9, 10, 43, 82]))
tests:
  - type: match_code
    pattern: 'sivyo\s*\{\s*matokeo\.sukuma\(\s*b\[\s*j\s*\]\s*\)'
    message: "Kwenye sivyo, sukuma b[j] kwenye matokeo."
  - type: exact_output
    message: "Matokeo yawe [3, 9, 10, 27, 38, 43, 82]."
---
Sasa tuna vipande vidogo vilivyopangwa. Tunaviunganishaje kuwa orodha moja iliyopangwa?

Fikiria mafungu mawili ya karatasi za mtihani, kila fungu limepangwa kwa alama tayari. Kuyaunganisha:

1. Linganisha karatasi za juu za mafungu yote mawili.
2. Chukua yenye alama ndogo, iweke kwenye fungu jipya.
3. Rudia mpaka fungu moja liishe.
4. Karatasi zilizobaki kwenye fungu lingine tayari zimepangwa. Ziweke zote mwishoni.

`i` inaonyesha tuko wapi kwenye `a`, na `j` tuko wapi kwenye `b`:

```text
a = [3, 27, 38]    b = [9, 10, 43, 82]
     i                  j
3 <= 9, hivyo tunachukua 3 na kusogeza i
```

Kwenye kodi ya mwanzo, `vunja` inasimamisha kitanzi ili kisizunguke milele. Kazi yako ni kuweka kodi sahihi mahali pake.
