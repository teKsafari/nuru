---
title: "Taa za Barabarani"
task: "Tengeneza taa za barabarani kwa taa 1, 2 na 3. Zipe rangi `nyekundu`, `njano` na `kijani`. Kisha: nyekundu iwake, ifuatwe na kijani, kisha njano, kisha nyekundu tena. Subiri `200` kati ya kila hatua, na taa moja tu iwake kwa wakati mmoja."
initialCode: |
  tumia ubao

  ubao.rangi(1, "nyekundu")

  // Simama!
  ubao.washa(1)
  ubao.subiri(200)
solution: |
  tumia ubao

  ubao.rangi(1, "nyekundu")
  ubao.rangi(2, "njano")
  ubao.rangi(3, "kijani")

  // Simama!
  ubao.washa(1)
  ubao.subiri(200)

  // Nenda
  ubao.zima(1)
  ubao.washa(3)
  ubao.subiri(200)

  // Jiandae kusimama
  ubao.zima(3)
  ubao.washa(2)
  ubao.subiri(200)

  // Simama tena
  ubao.zima(2)
  ubao.washa(1)
tests:
  - type: match_code
    pattern: 'ubao\.rangi\(\s*2\s*,\s*"njano"\s*\)'
    message: "Ipe taa namba 2 rangi ya njano kwa ubao.rangi(2, \"njano\")."
  - type: match_code
    pattern: 'ubao\.rangi\(\s*3\s*,\s*"kijani"\s*\)'
    message: "Ipe taa namba 3 rangi ya kijani kwa ubao.rangi(3, \"kijani\")."
  - type: ubao_mfuatano
    message: "Mpangilio uwe: nyekundu (1), kijani (3), njano (2), nyekundu (1). Zima taa moja kabla ya kuwasha inayofuata."
---
Kwenye makutano ya barabara, taa zinaongoza magari na daladala zisigongane. Ndani ya kila nguzo ya taa kuna programu ndogo inayofanya kazi kama hii utakayoandika.

Kwanza, chagua rangi ya kila taa kwa `ubao.rangi(namba, rangi)`:

```nuru
tumia ubao

ubao.+++rangi(1, "zambarau")+++
ubao.washa(1)
```

Mpangilio wa taa za barabarani ni:

1. **Nyekundu**: simama.
2. **Kijani**: nenda.
3. **Njano**: jiandae kusimama.
4. Kisha nyekundu tena, na mzunguko unaendelea.

Taa moja tu inawaka kwa wakati mmoja. Hivyo kabla ya kuwasha taa inayofuata, zima iliyokuwa ikiwaka.
