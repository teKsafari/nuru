---
title: "2. Kupitisha Hoja (Arguments)"
task: "Kamilisha kitendakazi `karibu` ili kimsalimie mtu kwa kutumia hoja ya `jina`."
initialCode: |
  fanya karibu = unda(jina) {
      andika("Karibu,", /* weka jina hapa */)
  }
  
  karibu("Amani") // Inapaswa kuandika: Karibu, Amani
  karibu("Tariq") // Inapaswa kuandika: Karibu, Tariq
solution: |
  fanya karibu = unda(jina) {
      andika("Karibu,", jina)
  }
  
  karibu("Amani")
  karibu("Tariq")
---
Mashine si muhimu sana ikiwa inafanya kitu kile kile kila wakati kila inapowashwa.

**Hoja** (Arguments) zinakuruhusu kupitisha taarifa *ndani* ya kitendakazi. Fikiria hoja kama malighafi unayolisha kwenye mashine yako.

### Mfano:
```s
fanya jumlisha = unda(+++a, b+++) {
    andika(a + b)
}

jumlisha(5, 10) // Inaandika 15
jumlisha(100, 1) // Inaandika 101
```

Tunapotengeneza `unda(jina)`, `jina` inakuwa kishikilia-nafasi. Tunapoita `karibu("Amani")`, kompyuta inabadilisha `jina` na kuweka `"Amani"` ndani ya kitendakazi.

**Kazi Yako:** Malizia kitendakazi cha `karibu` ili kiweze kumkaribisha mtu yeyote kwa jina lake!

```s
fanya karibu = unda(jina) {
    andika("Karibu,", +++jina+++)
}
```