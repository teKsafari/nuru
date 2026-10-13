---
title: "Vitendakazi Kama Hoja"
task: "Pitisha kitendakazi `shangilia` ndani ya `rudia_mara` ili kishangilie mara `3`. Kumbuka: unapopitisha kitendakazi, usiweke `()` baada ya jina lake."
initialCode: |
  fanya shangilia = unda() {
      andika("Goooli!")
  }

  // Inapokea kitendakazi na idadi ya mara
  fanya rudia_mara = unda(kazi, mara) {
      kwa i ktk mfululizo(mara) {
          kazi()
      }
  }

  // Ita rudia_mara hapa
solution: |
  fanya shangilia = unda() {
      andika("Goooli!")
  }

  // Inapokea kitendakazi na idadi ya mara
  fanya rudia_mara = unda(kazi, mara) {
      kwa i ktk mfululizo(mara) {
          kazi()
      }
  }

  rudia_mara(shangilia, 3)
tests:
  - type: match_code
    pattern: 'rudia_mara\(\s*shangilia\s*,'
    message: "Ita rudia_mara(shangilia, 3), bila () baada ya shangilia."
  - type: exact_output
    message: "Programu iandike Goooli! mara 3."
---
Katika Nuru, kitendakazi ni thamani kama namba au neno. Unaweza kukihifadhi kwenye kibadilika, au kukipitisha kama hoja kwa kitendakazi kingine.

```nuru
fanya piga_kelele = unda() {
    andika("Aaah!")
}

fanya endesha = unda(f) {
    f() // inaita kitendakazi kilichopitishwa
}

endesha(+++piga_kelele+++) // Aaah!
```

Angalia tofauti hii muhimu:

- `piga_kelele` ni **kitendakazi chenyewe**: unakikabidhi kama kilivyo.
- `piga_kelele()` ni **kukiita sasa hivi** na kutumia jibu lake.

Kitendakazi kinachopokea kitendakazi kingine kinaitwa **kitendakazi cha ngazi ya juu**.
