---
title: "7. Maamuzi (kama/au kama/sivyo)"
task: "Badili `alama = 40` na uone kama programu itakuambia \"Umefeli\"."
initialCode: |
  alama = 
  kama ( ) {
      andika("Umefaulu!")
  } sivyo {
      andika("Umefeli, jaribu tena.")
  }
solution: "alama = 40\nkama (alama >= 50) {\n    andika(\"Umefaulu!\")\n} sivyo {\n    andika(\"Umefeli, jaribu tena.\")\n}"
---
Programu inaweza kufanya maamuzi kulingana na hali fulani kwa kutumia `kama`.

### Muundo:
```s
kama (hali) {
    // fanya hapa ikiwa hali ni kweli
} au kama (hali_nyingine) {
    // fanya ikiwa hali ya kwanza ni sikweli na hii ni kweli
} sivyo {
    // fanya ikiwa zote hapo juu ni sikweli
}
```

### Zoezi:
```nuru
alama = +++60+++
kama (+++alama >= 50+++) {
    andika("Umefaulu!")
} sivyo {
    andika("Umefeli, jaribu tena.")
}
```

