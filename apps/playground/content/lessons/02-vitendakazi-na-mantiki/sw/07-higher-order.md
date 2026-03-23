---
title: "7. Vitendakazi vya Ngazi ya Juu"
task: "Pitisha kitendakazi `kicheko` kama hoja ndani ya `fanya_mara_mbili`."
initialCode: |
  fanya kicheko = unda() {
      andika("Hahaha!")
  }

  // Kitendakazi hiki kinatarajia kitendakazi kingine kama 'kazi'
  fanya fanya_mara_mbili = unda(kazi) {
      kazi()
      kazi()
  }

  // Piga fanya_mara_mbili ukipitisha kicheko!
  fanya_mara_mbili( /* nini? */ )
solution: |
  fanya kicheko = unda() {
      andika("Hahaha!")
  }

  fanya fanya_mara_mbili = unda(kazi) {
      kazi()
      kazi()
  }

  fanya_mara_mbili(kicheko)
---
Ngoja... unaweza kupitisha kitendakazi *ndani* ya kitendakazi kingine?! Ndiyo!

Katika Nuru, vitendakazi vinachukuliwa kama thamani nyingine yoyote (kama namba au maneno). Unaweza kuvihifadhi kwenye vibadilika na kuvipitisha kama hoja (arguments) kwenye vitendakazi vingine.

Kitendakazi kinachopokea kitendakazi kingine kama hoja kinaitwa **Kitendakazi cha Ngazi ya Juu** (Higher-Order Function).

### Mfano:
```s
fanya piga_kelele = unda() {
    andika("AAAH!")
}

fanya endesha = unda(f) {
    f() // Tekeleza kitendakazi kilichopitishwa
}

endesha(piga_kelele) // AAAH!
```

**Kazi Yako:** Pitisha kitendakazi `kicheko` ndani ya `fanya_mara_mbili` ili kicheko hicho kirudiwe mara mbili! Kumbuka, HUTUMII `()` unapotaja jina la kitendakazi unachopitisha.