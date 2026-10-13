---
title: "Kitanzi cha wakati"
task: "Mechi inakaribia kuanza! Tumia kitanzi cha `wakati` kuhesabu kurudi nyuma kutoka `5` hadi `1`, kisha andika `Mpira umeanza!`."
initialCode: |
  fanya n = 5

  andika("Mpira umeanza!")
solution: |
  fanya n = 5
  wakati (n > 0) {
      andika(n)
      n = n - 1
  }
  andika("Mpira umeanza!")
tests:
  - type: match_code
    pattern: 'wakati\s*\('
    message: "Tumia kitanzi cha wakati."
  - type: exact_output
    message: "Programu iandike 5, 4, 3, 2, 1 kila moja mstari wake, kisha Mpira umeanza!"
---
`wakati` inarudia kazi **muda wote** sharti likiwa kweli. Kabla ya kila mzunguko, kompyuta inaangalia sharti tena.

```nuru
fanya maji = 0

+++wakati (maji < 3)+++ {
    andika("Naweka ndoo ya maji")
    +++maji = maji + 1+++
}
andika("Pipa limejaa!")
```

Mstari `maji = maji + 1` ni muhimu sana. Bila huo, `maji` itabaki 0 milele na kitanzi hakitasimama. Kama hilo likitokea, bonyeza kitufe cha **Simamisha**.

Tumia `kwa` unapojua idadi ya mizunguko mapema. Tumia `wakati` unaposubiri jambo fulani litokee.
