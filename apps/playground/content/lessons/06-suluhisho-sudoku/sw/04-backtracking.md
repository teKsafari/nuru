---
title: "4. Backtracking (Kisia na Urudi)"
task: "Kamilisha hatua ya backtracking. Ikiwa `tatua()` inarudisha `sikweli`, rudisha kisanduku kuwa `0`."
initialCode: |
  // Kodi ya dhana - usijali kuhusu makosa bado!
  fanya tatua = unda() {
      fanya nafasi = pata_tupu()
      kama (nafasi == tupu) { rudisha kweli } // Fumbo limetatuliwa!

      fanya r = nafasi[0]
      fanya c = nafasi[1]

      kwa n ktk mfululizo(1, 5) {
          kama (ni_salama(r, c, n)) {
              gridi[r][c] = n // 1. Fanya kisia (guess)

              kama (tatua()) { rudisha kweli } // 2. Jaribu kutatua vilivyobaki kwa kujirudia

              // 3. OH HAPANA! Kisia hiki hakikufanya kazi.
              // Tunahitaji kufanya 'Backtrack' && kujaribu namba inayofuata.
              // Rudisha gridi[r][c] kuwa 0 hapa!
          }
      }
      rudisha sikweli // Hakuna namba inayofanya kazi hapa, rudi nyuma
  }
solution: |
  // gridi[r][c] = 0
---
**Backtracking** ni kama kuchunguza njia zenye kutatanisha.
1. Unafika kwenye njia panda na unafanya kisia.
2. Ukigonga ukuta, **unarudi nyuma** (backtrack) hadi kwenye njia panda ya mwisho na unajaribu njia nyingine.

Katika Sudoku, ikiwa tunaweka `4` lakini baadaye tukagundua kuwa haiwezekani kumaliza fumbo, lazima tuondoe `4` (tuiweke tena kuwa `0`) na tujaribu namba tofauti.

**Kazi Yako:** Huu ni mstari muhimu zaidi katika backtracking. Ikiwa wito wa kujirudia `tatua()` utashindwa, lazima tusemue kisia letu. Weka `gridi[r][c] = 0` ili tuweze kujaribu namba inayofuata kwenye kitanzi.

```nuru
+++gridi[r][c] = 0+++
```