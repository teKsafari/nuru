---
title: "Merge Sort Kamili"
task: "Kamilisha `panga`: panga nusu ya kushoto na nusu ya kulia kwa kujirudia, kisha rudisha `unganisha` ya nusu hizo mbili."
initialCode: |
  // Kisaidizi: nakala ya sehemu ya orodha, kuanzia nafasi anza hadi kabla ya mwisho
  fanya kata = unda(orodha, anza, mwisho = -1) {
      kama (mwisho == -1) { mwisho = orodha.idadi() }
      fanya mpya = []
      kwa i, t ktk orodha {
          kama (i >= anza && i < mwisho) { mpya.sukuma(t) }
      }
      rudisha mpya
  }

  fanya unganisha = unda(a, b) {
      fanya matokeo = []
      fanya i = 0
      fanya j = 0
      wakati (i < a.idadi() && j < b.idadi()) {
          kama (a[i] <= b[j]) {
              matokeo.sukuma(a[i])
              i = i + 1
          } sivyo {
              matokeo.sukuma(b[j])
              j = j + 1
          }
      }
      wakati (i < a.idadi()) {
          matokeo.sukuma(a[i])
          i = i + 1
      }
      wakati (j < b.idadi()) {
          matokeo.sukuma(b[j])
          j = j + 1
      }
      rudisha matokeo
  }

  fanya panga = unda(orodha) {
      kama (orodha.idadi() <= 1) {
          rudisha orodha
      }
      fanya kati = orodha.idadi() / 2
      // 1. Panga nusu ya kushoto: panga(kata(orodha, 0, kati))
      // 2. Panga nusu ya kulia: panga(kata(orodha, kati))
      // 3. Rudisha unganisha ya nusu hizo mbili
      rudisha orodha
  }

  andika(panga([38, 27, 43, 3, 9, 82, 10]))
  andika(panga([5, 1, 4, 2, 3]))
solution: |
  // Kisaidizi: nakala ya sehemu ya orodha, kuanzia nafasi anza hadi kabla ya mwisho
  fanya kata = unda(orodha, anza, mwisho = -1) {
      kama (mwisho == -1) { mwisho = orodha.idadi() }
      fanya mpya = []
      kwa i, t ktk orodha {
          kama (i >= anza && i < mwisho) { mpya.sukuma(t) }
      }
      rudisha mpya
  }

  fanya unganisha = unda(a, b) {
      fanya matokeo = []
      fanya i = 0
      fanya j = 0
      wakati (i < a.idadi() && j < b.idadi()) {
          kama (a[i] <= b[j]) {
              matokeo.sukuma(a[i])
              i = i + 1
          } sivyo {
              matokeo.sukuma(b[j])
              j = j + 1
          }
      }
      wakati (i < a.idadi()) {
          matokeo.sukuma(a[i])
          i = i + 1
      }
      wakati (j < b.idadi()) {
          matokeo.sukuma(b[j])
          j = j + 1
      }
      rudisha matokeo
  }

  fanya panga = unda(orodha) {
      kama (orodha.idadi() <= 1) {
          rudisha orodha
      }
      fanya kati = orodha.idadi() / 2
      fanya kushoto = panga(kata(orodha, 0, kati))
      fanya kulia = panga(kata(orodha, kati))
      rudisha unganisha(kushoto, kulia)
  }

  andika(panga([38, 27, 43, 3, 9, 82, 10]))
  andika(panga([5, 1, 4, 2, 3]))
tests:
  - type: match_code
    pattern: 'panga\(\s*kata\([\s\S]*panga\(\s*kata\('
    message: "Ndani ya panga, jiite mara mbili: panga(kata(orodha, 0, kati)) na panga(kata(orodha, kati))."
  - type: match_code
    pattern: 'rudisha\s+unganisha\('
    message: "Rudisha unganisha(kushoto, kulia)."
  - type: exact_output
    message: "Orodha zote mbili zitoke zimepangwa: [3, 9, 10, 27, 38, 43, 82] na [1, 2, 3, 4, 5]."
---
Vipande vyote viko tayari. Wakati wa kuviunganisha kuwa mojawapo ya kanuni maarufu zaidi katika historia ya kompyuta!

Merge Sort ina hatua nne:

1. **Sharti la kusimama**: orodha yenye kitu kimoja au pungufu tayari imepangwa. Irudishe.
2. **Gawanya**: kata orodha katikati.
3. **Jirudie**: panga kila nusu kwa kuita `panga` yenyewe.
4. **Unganisha**: nusu mbili zilizopangwa zinakuwa orodha moja iliyopangwa.

```text
[38, 27, 43, 3]
gawanya:   [38, 27]          [43, 3]
gawanya:   [38] [27]         [43] [3]
unganisha: [27, 38]          [3, 43]
unganisha: [3, 27, 38, 43]
```

Hatua ya tatu ndiyo ya ajabu: kitendakazi kinaamini kwamba `panga` itapanga nusu zote mbili, ingawa bado tunaiandika! Hiyo ndiyo nguvu ya kujirudia.
