---
title: "8. Kurudisha Vitendakazi (Closures)"
task: "Ita `tengeneza_salamu()` na uihifadhi kwenye kibadilika kinachoitwa `sema_jambo`, kisha ita `sema_jambo()`."
initialCode: |
  fanya tengeneza_salamu = unda() {
      // Kitendakazi hiki kinarudisha kitendakazi kingine!
      rudisha unda() {
          andika("Jambo kutoka ndani!")
      }
  }

  // 1. Pata kitendakazi kipya (Get the new function)
  // fanya sema_jambo = ?
  
  // 2. Piga kitendakazi hicho kipya! (Call the new function)
  // ?
solution: |
  fanya tengeneza_salamu = unda() {
      rudisha unda() {
          andika("Jambo kutoka ndani!")
      }
  }

  fanya sema_jambo = tengeneza_salamu()
  sema_jambo()
---
Kama tunavyoweza kupitisha vitendakazi *ndani* ya vitendakazi vingine, tunaweza pia **kurudisha** kitendakazi kutoka kwenye kitendakazi kingine!

Hii mara nyingi hutumiwa kutengeneza mifumo maalum ambapo kitendakazi kimoja kinazalisha kingine.

### Mfano:
```s
fanya ubao = unda(rangi) {
    // Kitendakazi hiki 'kinakumbuka' rangi!
    rudisha unda() {
        andika("Kuchora kwa rangi ya", rangi)
    }
}

fanya chora_nyekundu = ubao("Nyekundu")
chora_nyekundu() // Inaandika: Kuchora kwa rangi ya Nyekundu
```

Hii inaitwa **Kufungwa** (Closure) kwa sababu kitendakazi cha ndani "kinakumbatia" na kukumbuka vibadilika vya kitendakazi cha nje hata baada ya kitendakazi cha nje kumaliza kazi yake.

**Kazi Yako:** Pata kitendakazi cha ndani kutoka kwa `tengeneza_salamu()`, kihifadhi kwenye kibadilika, na kisha kiendeshe!