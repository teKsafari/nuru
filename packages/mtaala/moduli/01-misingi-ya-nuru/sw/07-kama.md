---
title: "Maamuzi (kama, au kama, sivyo)"
task: "Kamilisha programu ya matokeo: alama 80 au zaidi andika `Daraja A`, alama 50 au zaidi andika `Umefaulu`, vinginevyo andika `Jaribu tena`. Tumia `kama`, `au kama` na `sivyo`."
initialCode: |
  fanya alama = 72

  kama (alama >= 80) {
      andika("Daraja A")
  }
solution: |
  fanya alama = 72

  kama (alama >= 80) {
      andika("Daraja A")
  } au kama (alama >= 50) {
      andika("Umefaulu")
  } sivyo {
      andika("Jaribu tena")
  }
tests:
  - type: match_code
    pattern: 'au\s+kama\s*\('
    message: "Ongeza sehemu ya au kama kwa alama 50 au zaidi."
  - type: match_code
    pattern: 'sivyo\s*\{'
    message: "Ongeza sehemu ya sivyo kwa alama chini ya 50."
  - type: exact_output
    message: "Kwa alama 72, programu inapaswa kuandika Umefaulu."
---
Programu nzuri inafanya maamuzi. Kwa `kama`, unaiambia kompyuta: "kama hali hii ni kweli, fanya hiki".

```nuru
fanya mvua = kweli

kama (mvua) {
    andika("Beba mwavuli")
} sivyo {
    andika("Vaa kofia")
}
```

Ukihitaji njia zaidi ya mbili, ongeza `au kama`. Kompyuta inaangalia masharti kuanzia juu. Ikipata la kwanza lililo kweli, inafanya hilo tu na kuruka mengine yote.

```nuru
fanya saa = 15

kama (saa < 12) {
    andika("Habari za asubuhi")
} +++au kama (saa < 16) {
    andika("Habari za mchana")
}+++ sivyo {
    andika("Habari za jioni")
}
```

Jaribu kubadilisha `alama` kuwa 90 au 30 baada ya kumaliza, uone matokeo yanavyobadilika.
