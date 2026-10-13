---
title: "Backtracking: Jaribu, Kisha Rudi Nyuma"
task: "Programu inashindwa kutatua fumbo kwa sababu haifuti majaribio yaliyoshindikana. Ongeza `gridi[r][c] = 0` mahali palipoonyeshwa, ili ijaribu namba inayofuata."
initialCode: |
  fanya gridi = [
      [4, 2, 3, 1],
      [0, 0, 2, 0],
      [0, 0, 1, 0],
      [0, 3, 4, 0]
  ]

  fanya ni_salama = unda(r, c, n) {
      kwa i ktk mfululizo(4) {
          kama (gridi[r][i] == n || gridi[i][c] == n) {
              rudisha sikweli
          }
      }
      rudisha kweli
  }

  fanya tatua = unda() {
      kwa r ktk mfululizo(4) {
          kwa c ktk mfululizo(4) {
              kama (gridi[r][c] == 0) {
                  kwa n ktk mfululizo(1, 5) {
                      kama (ni_salama(r, c, n)) {
                          gridi[r][c] = n // jaribu namba hii
                          kama (tatua()) {
                              rudisha kweli
                          }
                          // Rudi nyuma hapa: futa namba uliyojaribu
                      }
                  }
                  rudisha sikweli // hakuna namba inayofaa hapa
              }
          }
      }
      rudisha kweli // hakuna kisanduku kitupu: tumemaliza!
  }

  kama (tatua()) {
      andika("Imetatuliwa!")
  } sivyo {
      andika("Imeshindikana.")
  }
  kwa mstari ktk gridi {
      andika(mstari)
  }
solution: |
  fanya gridi = [
      [4, 2, 3, 1],
      [0, 0, 2, 0],
      [0, 0, 1, 0],
      [0, 3, 4, 0]
  ]

  fanya ni_salama = unda(r, c, n) {
      kwa i ktk mfululizo(4) {
          kama (gridi[r][i] == n || gridi[i][c] == n) {
              rudisha sikweli
          }
      }
      rudisha kweli
  }

  fanya tatua = unda() {
      kwa r ktk mfululizo(4) {
          kwa c ktk mfululizo(4) {
              kama (gridi[r][c] == 0) {
                  kwa n ktk mfululizo(1, 5) {
                      kama (ni_salama(r, c, n)) {
                          gridi[r][c] = n // jaribu namba hii
                          kama (tatua()) {
                              rudisha kweli
                          }
                          gridi[r][c] = 0 // rudi nyuma
                      }
                  }
                  rudisha sikweli // hakuna namba inayofaa hapa
              }
          }
      }
      rudisha kweli // hakuna kisanduku kitupu: tumemaliza!
  }

  kama (tatua()) {
      andika("Imetatuliwa!")
  } sivyo {
      andika("Imeshindikana.")
  }
  kwa mstari ktk gridi {
      andika(mstari)
  }
tests:
  - type: match_code
    pattern: 'gridi\[\s*r\s*\]\[\s*c\s*\]\s*=\s*0'
    message: "Ongeza gridi[r][c] = 0 baada ya kama (tatua()) { ... }."
  - type: exact_output
    message: "Programu iandike Imetatuliwa! na gridi iliyojaa: [4, 2, 3, 1], [3, 1, 2, 4], [2, 4, 1, 3], [1, 3, 4, 2]."
---
**Backtracking** ni kama kutafuta njia ndani ya msitu:

1. Unafika kwenye njia panda, unachagua njia moja.
2. Ukifika mwisho bila kutoka, **unarudi nyuma** hadi njia panda ya mwisho na kujaribu njia nyingine.

Kwenye Sudoku, kitendakazi `tatua`:

1. Kinatafuta kisanduku kitupu cha kwanza.
2. Kinajaribu namba 1 hadi 4. Kwa kila namba salama, kinaiweka na kujiita **chenyewe** kutatua visanduku vilivyobaki.
3. Kama mwito huo unarudisha `kweli`, fumbo limetatuliwa!
4. Kama unarudisha `sikweli`, namba hiyo ilitufikisha mwisho wa njia. **Tunaifuta** na kujaribu inayofuata.
5. Kama hakuna namba yoyote inayofaa, tunarudisha `sikweli` ili kisanduku kilichotangulia kijaribu namba nyingine.

Bila hatua ya 4, namba iliyoshindikana inabaki kwenye gridi. `ni_salama` inaiona na kukataa namba sahihi baadaye. Ndiyo sababu programu ya mwanzo inaandika `Imeshindikana.`
