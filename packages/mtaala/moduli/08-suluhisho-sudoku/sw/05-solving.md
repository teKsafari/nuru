---
title: "Suluhisho Kamili"
task: "Fumbo hili jipya linatoka vibaya: angalia, kisanduku cha juu kushoto kina `1` mbili. Ongeza ukaguzi wa **kisanduku cha 2 kwa 2** ndani ya `ni_salama`, ili kila kisanduku kiwe na namba 1 hadi 4 bila kurudia."
initialCode: |
  fanya gridi = [
      [1, 0, 0, 0],
      [3, 0, 0, 4],
      [4, 0, 0, 3],
      [0, 0, 4, 1]
  ]

  fanya ni_salama = unda(r, c, n) {
      kwa i ktk mfululizo(4) {
          kama (gridi[r][i] == n || gridi[i][c] == n) {
              rudisha sikweli
          }
      }
      // Kagua kisanduku cha 2 kwa 2 hapa.
      // Kona yake ya juu kushoto ni (r - r % 2, c - c % 2).
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
solution: |
  fanya gridi = [
      [1, 0, 0, 0],
      [3, 0, 0, 4],
      [4, 0, 0, 3],
      [0, 0, 4, 1]
  ]

  fanya ni_salama = unda(r, c, n) {
      kwa i ktk mfululizo(4) {
          kama (gridi[r][i] == n || gridi[i][c] == n) {
              rudisha sikweli
          }
      }
      // Kagua kisanduku cha 2 kwa 2
      fanya r0 = r - r % 2
      fanya c0 = c - c % 2
      kwa i ktk mfululizo(2) {
          kwa j ktk mfululizo(2) {
              kama (gridi[r0 + i][c0 + j] == n) {
                  rudisha sikweli
              }
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
    pattern: 'gridi\[[^\]\n]*\+[^\]\n]*\]\[[^\]\n]*\+[^\]\n]*\]'
    message: "Pitia visanduku vinne kuanzia kona ya kisanduku: gridi[r0 + i][c0 + j]."
  - type: exact_output
    message: "Gridi sahihi ni [1, 4, 3, 2], [3, 2, 1, 4], [4, 1, 2, 3], [2, 3, 4, 1]."
---
Endesha programu kwanza. Inasema `Imetatuliwa!`, lakini angalia kisanduku cha juu kushoto: `1, 4` na `3, 1`. Namba 1 imerudiwa! Programu inakagua mistari na safu tu, imesahau sheria ya tatu.

### Kona ya kisanduku

Gridi ya 4 kwa 4 ina visanduku vinne vya 2 kwa 2. Kwa kisanduku chochote `(r, c)`, kona ya juu kushoto ya kisanduku chake ni:

```nuru
fanya r0 = r +++- r % 2+++
fanya c0 = c +++- c % 2+++
```

Kwa mfano, `(3, 2)` iko kwenye kisanduku chenye kona `(2, 2)`, kwa sababu `3 - 1 = 2` na `2 - 0 = 2`.

Kisha pitia visanduku vinne kuanzia kona hiyo: `gridi[r0 + i][c0 + j]`, ambapo `i` na `j` ni 0 au 1. Kama yoyote ni sawa na `n`, namba si salama.

### Hongera!

Umeunganisha **orodha ndani ya orodha**, **vitanzi**, **masharti** na **kujirudia** kujenga programu inayofikiri. Mbinu hii ya backtracking inatumika kupanga ratiba za mitihani, kutafuta njia kwenye ramani, na hata kucheza bao na chess. Ulianza na `andika("Habari Nuru!")`. Sasa unaandika programu zinazotatua mafumbo!
