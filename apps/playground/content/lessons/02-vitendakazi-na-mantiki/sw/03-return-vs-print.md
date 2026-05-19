---
title: "3. Rudisha dhidi ya Andika"
task: "Badilisha `andika` kuwa `rudisha` ndani ya kitendakazi `zidisha` ili kibadilika (variable) `jibu` kiweze kuhifadhi matokeo."
initialCode: |
  fanya zidisha = unda(a, b) {
      // Rekebisha mstari huu!
      andika(a * b)
  }
  
  fanya jibu = zidisha(3, 4)
  andika("Jibu ni:", jibu) // Oh hapana! Jibu ni tupu!
solution: |
  fanya zidisha = unda(a, b) {
      rudisha a * b
  }
  
  fanya jibu = zidisha(3, 4)
  andika("Jibu ni:", jibu)
---
Kosa la kawaida kwa wanaoanza ni kuchanganya kuandika (`andika`) na kurudisha (`rudisha`).

- **`andika`** ni kwa ajili ya **Binadamu**. Inaonyesha kitu kwenye skrini ili uweze kusoma. Kompyuta "hasahau" kile kilichoandikwa mara tu baada ya kuonyesha.
- **`rudisha`** ni kwa ajili ya **Programu**. Inarudisha matokeo ili uweze kuyahifadhi kwenye kibadilika au kuyatumia kwenye hesabu nyingine.

### Angalia tofauti:
```s
fanya kwa_binadamu = unda() {
    andika(10)
}

fanya kwa_programu = unda() {
    +++rudisha 10+++
}

fanya x = kwa_binadamu() // x sasa ni 'tupu' kwa sababu hakuna kilichorudishwa!
fanya y = kwa_programu() // y sasa ni 10!
```

**Kazi Yako:** Rekebisha kitendakazi cha `zidisha` ili kirudishe thamani badala ya kuiandika tu. Hii itaruhusu kibadilika `jibu` kishike matokeo ya kweli.

```s
fanya zidisha = unda(a, b) {
    +++rudisha a * b+++
}
```