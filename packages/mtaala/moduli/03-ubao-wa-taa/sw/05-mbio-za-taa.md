---
title: "Mbio za Taa"
task: "Fanya mwanga ukimbie kutoka taa `1` hadi `8`, kisha urudi hadi taa `1`. Kwa kila taa: washa, subiri `100`, zima. Tumia vitanzi viwili vya `kwa`."
initialCode: |
  tumia ubao

  // Kwenda: 1 hadi 8
  kwa taa ktk mfululizo(1, 9) {
      ubao.washa(taa)
      ubao.subiri(100)
      ubao.zima(taa)
  }

  // Kurudi: 7 hadi 1
solution: |
  tumia ubao

  // Kwenda: 1 hadi 8
  kwa taa ktk mfululizo(1, 9) {
      ubao.washa(taa)
      ubao.subiri(100)
      ubao.zima(taa)
  }

  // Kurudi: 7 hadi 1
  kwa taa ktk mfululizo(7, 0, -1) {
      ubao.washa(taa)
      ubao.subiri(100)
      ubao.zima(taa)
  }
tests:
  - type: match_code
    pattern: 'kwa[\s\S]*kwa'
    message: "Tumia kitanzi cha pili cha kwa kurudisha mwanga nyuma."
  - type: ubao_mfuatano
    message: "Mwanga uende 1 hadi 8 kisha urudi 7 hadi 1, taa moja tu ikiwaka kila wakati."
---
Umeshawahi kuona taa za mapambo dukani zinazoonekana kama zinakimbizana? Siri yake ni rahisi: washa taa moja, subiri kidogo, izime, kisha nenda kwa inayofuata.

Kwenda mbele ni rahisi kwa `mfululizo(1, 9)`. Kurudi nyuma, `mfululizo` inaweza kupokea namba ya tatu: **hatua**. Hatua hasi inahesabu kurudi nyuma:

```nuru
andika(mfululizo(1, 9))        // [1, 2, 3, 4, 5, 6, 7, 8]
andika(mfululizo(5, 0, +++-1+++)) // [5, 4, 3, 2, 1]
```

Tunaanza kurudi kutoka 7, si 8, kwa sababu taa ya 8 imeshawaka mwishoni mwa safari ya kwenda.
