---
title: "Kugawanya Orodha"
task: "Kamilisha kitanzi: kama nafasi `i` ni ndogo kuliko `kati`, sukuma `namba` kwenye `kushoto`. Vinginevyo isukume kwenye `kulia`."
initialCode: |
  fanya orodha = [38, 27, 43, 3, 9, 82]
  fanya kati = orodha.idadi() / 2

  fanya kushoto = []
  fanya kulia = []

  kwa i, namba ktk orodha {
      kama (i < kati) {
          // hapa
      } sivyo {
          // hapa
      }
  }

  andika("Kushoto:", kushoto)
  andika("Kulia:", kulia)
solution: |
  fanya orodha = [38, 27, 43, 3, 9, 82]
  fanya kati = orodha.idadi() / 2

  fanya kushoto = []
  fanya kulia = []

  kwa i, namba ktk orodha {
      kama (i < kati) {
          kushoto.sukuma(namba)
      } sivyo {
          kulia.sukuma(namba)
      }
  }

  andika("Kushoto:", kushoto)
  andika("Kulia:", kulia)
tests:
  - type: match_code
    pattern: 'kushoto\.sukuma\(\s*namba\s*\)'
    message: "Kwenye sehemu ya kama, andika kushoto.sukuma(namba)."
  - type: match_code
    pattern: 'kulia\.sukuma\(\s*namba\s*\)'
    message: "Kwenye sehemu ya sivyo, andika kulia.sukuma(namba)."
  - type: exact_output
    message: "Kushoto iwe [38, 27, 43] na kulia iwe [3, 9, 82]."
---
Merge Sort inatumia mbinu ya **gawanya na ushinde**: tatizo kubwa likiwa gumu, ligawe kuwa matatizo madogo mawili.

Kupanga orodha ya namba 6 ni vigumu kuliko kupanga orodha mbili za namba 3. Na hizo ni vigumu kuliko orodha za namba 1... ambazo hazihitaji kupangwa kabisa!

### Hatua ya kwanza: kugawanya

Tunatafuta katikati, kisha tunapitia orodha. Kila namba inaenda upande wake kulingana na nafasi yake:

```nuru
kwa i, tunda ktk ["embe", "papai", "fenesi"] {
    andika(+++i+++, tunda) // 0 embe, 1 papai, 2 fenesi
}
```

Kumbuka kitanzi chenye nafasi kutoka moduli ya Ubao wa Taa: `kwa i, kitu ktk orodha` kinakupa nafasi `i` na kitu chenyewe.
