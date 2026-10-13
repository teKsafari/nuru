---
title: "Kutafuta Kisanduku Kitupu"
task: "Kamilisha `pata_tupu`: ukikuta kisanduku chenye `0`, rudisha nafasi yake kama orodha `[r, c]`. Kama hakuna kisanduku kitupu, kitendakazi kinarudisha `tupu`."
initialCode: |
  fanya pata_tupu = unda(gridi) {
      kwa r ktk mfululizo(4) {
          kwa c ktk mfululizo(4) {
              kama (gridi[r][c] == 0) {
                  // Rudisha nafasi hapa
              }
          }
      }
      rudisha tupu
  }

  andika(pata_tupu([[1, 0, 3, 0], [0, 0, 2, 1], [0, 1, 0, 2], [2, 4, 0, 3]]))
  andika(pata_tupu([[1, 2, 3, 4], [3, 4, 0, 1], [2, 1, 4, 3], [4, 3, 1, 2]]))
  andika(pata_tupu([[1, 2, 3, 4], [3, 4, 2, 1], [2, 1, 4, 3], [4, 3, 1, 2]]))
solution: |
  fanya pata_tupu = unda(gridi) {
      kwa r ktk mfululizo(4) {
          kwa c ktk mfululizo(4) {
              kama (gridi[r][c] == 0) {
                  rudisha [r, c]
              }
          }
      }
      rudisha tupu
  }

  andika(pata_tupu([[1, 0, 3, 0], [0, 0, 2, 1], [0, 1, 0, 2], [2, 4, 0, 3]]))
  andika(pata_tupu([[1, 2, 3, 4], [3, 4, 0, 1], [2, 1, 4, 3], [4, 3, 1, 2]]))
  andika(pata_tupu([[1, 2, 3, 4], [3, 4, 2, 1], [2, 1, 4, 3], [4, 3, 1, 2]]))
tests:
  - type: match_code
    pattern: 'rudisha\s+\[\s*r\s*,\s*c\s*\]'
    message: "Rudisha nafasi kama orodha: rudisha [r, c]."
  - type: exact_output
    message: "Majibu yawe [0, 1], kisha [1, 2], kisha null kwa gridi iliyojaa."
---
Programu yetu itatatua fumbo kisanduku kimoja kwa wakati. Kwanza inahitaji kujua: kisanduku kitupu kinachofuata kiko wapi?

Tunapitia gridi kama unavyosoma kitabu: mstari wa kwanza kutoka kushoto kwenda kulia, kisha mstari unaofuata. Tukikuta `0` ya kwanza, tumepata kazi inayofuata.

### Kurudisha vitu viwili

Kitendakazi kinarudisha kitu kimoja tu. Lakini tunaweza kurudisha **orodha** yenye vitu viwili ndani yake:

```nuru
fanya mahali_pa_shule = unda() {
    +++rudisha [3, 7]+++
}

fanya mahali = mahali_pa_shule()
andika("Mtaa", mahali[0], "nyumba", mahali[1])
```

### Kwa nini `tupu`?

Kama hakuna `0` yoyote, maana yake **fumbo limetatuliwa**! `tupu` ni ishara ya "hakuna kazi iliyobaki". Nuru inaiandika kama `null`.
