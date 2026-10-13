---
title: "Merge Sort ni ya Haraka Kiasi Gani?"
task: "Ndani ya kitanzi cha kwanza cha `unganisha`, ongeza `hesabu[\"ulinganisho\"]` kwa 1 kila mara namba mbili zinapolinganishwa. Kisha endesha uone Merge Sort inahitaji ulinganisho mingapi kupanga namba 100."
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

  // Orodha ya namba 100, kuanzia 100 kushuka hadi 1
  fanya orodha_kubwa = mfululizo(100, 0, -1)
  fanya hesabu = {"ulinganisho": 0}

  fanya unganisha = unda(a, b) {
      fanya matokeo = []
      fanya i = 0
      fanya j = 0
      wakati (i < a.idadi() && j < b.idadi()) {
          // Ongeza hesabu["ulinganisho"] kwa 1 hapa
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

  fanya imepangwa = panga(orodha_kubwa)
  andika("Za kwanza:", kata(imepangwa, 0, 5))
  andika("Za mwisho:", kata(imepangwa, 95))
  andika("Ulinganisho:", hesabu["ulinganisho"])
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

  // Orodha ya namba 100, kuanzia 100 kushuka hadi 1
  fanya orodha_kubwa = mfululizo(100, 0, -1)
  fanya hesabu = {"ulinganisho": 0}

  fanya unganisha = unda(a, b) {
      fanya matokeo = []
      fanya i = 0
      fanya j = 0
      wakati (i < a.idadi() && j < b.idadi()) {
          hesabu["ulinganisho"] = hesabu["ulinganisho"] + 1
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

  fanya imepangwa = panga(orodha_kubwa)
  andika("Za kwanza:", kata(imepangwa, 0, 5))
  andika("Za mwisho:", kata(imepangwa, 95))
  andika("Ulinganisho:", hesabu["ulinganisho"])
tests:
  - type: match_code
    pattern: 'hesabu\["ulinganisho"\]\s*=\s*hesabu\["ulinganisho"\]\s*\+\s*1'
    message: "Ongeza hesabu[\"ulinganisho\"] = hesabu[\"ulinganisho\"] + 1 ndani ya kitanzi cha kwanza."
  - type: exact_output
    message: "Namba zitoke 1 hadi 100 zimepangwa, na idadi ya ulinganisho iwe 316."
---
Kuna njia nyingi za kupanga. Rahisi zaidi ni **Bubble Sort**: linganisha kila jozi ya jirani, badilisha kama haziko kwenye mpangilio, na rudia tena na tena.

Bubble Sort inahitaji takribani `n x n / 2` ulinganisho. Kwa namba 100, hiyo ni karibu **5,000**. Kwa namba milioni moja, ni bilioni 500!

Merge Sort inagawa orodha nusu kwa nusu. Namba 100 zinagawanywa mara 7 tu kufika vipande vya kitu kimoja, na kila ngazi inahitaji ulinganisho usiozidi 100. Jumla ni mia chache tu.

- Namba 100: Bubble Sort inahitaji ulinganisho karibu 5,000, Merge Sort mia chache tu
- Namba 1,000,000: Bubble Sort inahitaji karibu 500,000,000,000, Merge Sort karibu 20,000,000

Hongera! Umejenga kanuni inayotumiwa na programu halisi kila siku, kuanzia kupanga matokeo ya mitihani hadi kupanga bidhaa kwenye maduka ya mtandaoni.
