---
title: "1. Kioo (Kitanzi Kisicho na Mwisho)"
task: "Endesha kodi uone nini kinatokea wakati kitendakazi kinajiita chenyewe milele. Kisha kirekebishe kwa kuweka alama ya // mbele ya `kioo()` ndani yake."
initialCode: |
  fanya kioo = unda() {
      andika("Natazama kwenye kioo...")
      
      // ONYO: Hii itajirudia milele!
      // Kurekebisha, weka // mbele ya mstari unaofuata
      kioo() 
  }

  kioo()
solution: |
  fanya kioo = unda() {
      andika("Natazama kwenye kioo...")
      // kioo()
  }

  kioo()
---
Ushawahi kusimama katikati ya vioo viwili na kuona msururu wa picha zisizo na mwisho?

Kwenye upangaji programu, kitendakazi kinaweza **kujiita chenyewe**. Hii inaitwa **Kujirudia** (Recursion).

### Hatari Yake:
Ikiwa kitendakazi kitajiita chenyewe bila sheria yoyote ya kusimama, kitakimbia milele. Hatimaye, kompyuta yako itaishiwa kumbukumbu (hii mara nyingi huitwa "Stack Overflow").

### Mfano:
```s
fanya sema = unda() {
    andika("Habari!")
    sema() // Kinajiita chenyewe!
}

sema() // Hii itasababisha kosa!
```

**Kazi Yako:** Endesha kodi ili uone inavyofanya kazi. Kisha, kirekebishe kwa kuweka +++//+++ mbele ya mwito wa `kioo()` ndani ya kitendakazi ili kiendeshe mara moja tu.