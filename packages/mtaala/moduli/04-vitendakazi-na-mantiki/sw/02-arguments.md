---
title: "Kupitisha Hoja"
task: "Kamilisha `karibu` ili kiandike `Karibu,` ikifuatiwa na jina lililopitishwa kama hoja."
initialCode: |
  fanya karibu = unda(jina) {
      andika("Karibu,")
  }

  karibu("Amani")
  karibu("Neema")
solution: |
  fanya karibu = unda(jina) {
      andika("Karibu,", jina)
  }

  karibu("Amani")
  karibu("Neema")
tests:
  - type: exact_output
    message: "Programu iandike: Karibu, Amani kisha Karibu, Neema."
---
Mashine inayofanya kitu kilekile kila mara haina faida kubwa. **Hoja** zinakuruhusu kupeleka taarifa ndani ya kitendakazi kila unapokiita.

```nuru
fanya bei_ya_jumla = unda(+++bei, idadi+++) {
    andika("Jumla ni shilingi", bei * idadi)
}

bei_ya_jumla(500, 4)  // Jumla ni shilingi 2000
bei_ya_jumla(1200, 2) // Jumla ni shilingi 2400
```

Unapoandika `unda(bei, idadi)`, majina `bei` na `idadi` ni kama nafasi tupu. Ukiita `bei_ya_jumla(500, 4)`, Nuru inaweka `500` kwenye `bei` na `4` kwenye `idadi`, kwa mpangilio uleule.
