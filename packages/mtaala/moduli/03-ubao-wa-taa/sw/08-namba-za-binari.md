---
title: "Changamoto: Namba za Binari"
task: "Hesabu kuanzia `0` hadi `15` kwa binari kwenye taa. Taa ya `8` ndiyo tarakimu ya mwisho (1), taa ya `7` ni 2, taa ya `6` ni 4, na kuendelea. Kwa kila namba, pitia taa kuanzia `8` kurudi `1` kama kwenye kodi ya mwanzo, kisha subiri `100`."
initialCode: |
  tumia ubao

  kwa n ktk mfululizo(16) {
      ubao.skrini("Namba: " + tungo(n))
      fanya x = n
      kwa taa ktk mfululizo(8, 0, -1) {
          // 1. Tarakimu ya mwisho ya binari ni baki ya x kugawanywa kwa 2
          // 2. Kama ni 1, washa taa. Kama ni 0, izime.
          // 3. Ondoa tarakimu hiyo: x = (x - baki) / 2
      }
      ubao.subiri(100)
  }
solution: |
  tumia ubao

  kwa n ktk mfululizo(16) {
      ubao.skrini("Namba: " + tungo(n))
      fanya x = n
      kwa taa ktk mfululizo(8, 0, -1) {
          fanya baki = x % 2
          kama (baki == 1) {
              ubao.washa(taa)
          } sivyo {
              ubao.zima(taa)
          }
          x = (x - baki) / 2
      }
      ubao.subiri(100)
  }
tests:
  - type: match_code
    pattern: '%\s*2'
    message: "Tumia % 2 kupata tarakimu ya mwisho ya binari."
  - type: ubao_mfuatano
    message: "Taa zinapaswa kuonyesha 0 hadi 15 kwa binari, taa ya 8 ikiwa tarakimu ya mwisho."
---
Kompyuta haielewi namba 7 kama tunavyoiandika. Ndani yake kuna swichi ndogo mabilioni, kila moja ikiwa **imewaka (1)** au **imezimwa (0)**. Hii inaitwa **binari**.

Kwenye binari kila nafasi ina thamani mara mbili ya iliyo kulia kwake:

```text
Taa      1    2   3   4   5  6  7  8
-------  ---  --  --  --  -  -  -  -
Thamani  128  64  32  16  8  4  2  1
```

Namba 5 ni `4 + 1`, hivyo taa 6 na 8 zinawaka: `00000101`.

### Kupata tarakimu za binari

1. `x % 2` inakupa tarakimu ya mwisho: 0 au 1.
2. `(x - baki) / 2` inaondoa tarakimu hiyo, na kubaki na zilizosalia.
3. Rudia mpaka umepitia taa zote 8.

```nuru
fanya x = 6
andika(x % 2)   // 0: taa ya 8 imezimwa
x = (x - 0) / 2 // x sasa ni 3
andika(x % 2)   // 1: taa ya 7 inawaka
```

Ukimaliza, jaribu kuhesabu hadi 255. Taa zote 8 zitawaka mwishoni!
