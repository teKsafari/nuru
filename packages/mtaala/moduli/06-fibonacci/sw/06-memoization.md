---
title: "Kukumbuka Majibu (Memoization)"
task: "Ndani ya `kama (kumbukumbu[n] != tupu)`, rudisha jibu lililohifadhiwa: `rudisha kumbukumbu[n]`. Idadi ya miito itashuka kutoka 8361 hadi 35."
initialCode: |
  fanya kumbukumbu = {}
  fanya miito = {"idadi": 0}

  fanya fibo = unda(n) {
      miito["idadi"] = miito["idadi"] + 1
      kama (n <= 1) {
          rudisha n
      }
      kama (kumbukumbu[n] != tupu) {
          // Tayari tunajua jibu! Lirudishe hapa.
      }
      fanya jibu = fibo(n - 1) + fibo(n - 2)
      kumbukumbu[n] = jibu
      rudisha jibu
  }

  andika("Jibu:", fibo(18))
  andika("Idadi ya miito:", miito["idadi"])
solution: |
  fanya kumbukumbu = {}
  fanya miito = {"idadi": 0}

  fanya fibo = unda(n) {
      miito["idadi"] = miito["idadi"] + 1
      kama (n <= 1) {
          rudisha n
      }
      kama (kumbukumbu[n] != tupu) {
          rudisha kumbukumbu[n]
      }
      fanya jibu = fibo(n - 1) + fibo(n - 2)
      kumbukumbu[n] = jibu
      rudisha jibu
  }

  andika("Jibu:", fibo(18))
  andika("Idadi ya miito:", miito["idadi"])
tests:
  - type: match_code
    pattern: 'rudisha\s+kumbukumbu\[\s*n\s*\]'
    message: "Rudisha jibu lililohifadhiwa: rudisha kumbukumbu[n]."
  - type: exact_output
    message: "Jibu liwe 2584 na idadi ya miito ishuke hadi 35."
---
Fikiria mwalimu anakuuliza `347 x 29` mara kumi mfululizo. Ungehesabu upya kila mara? Hapana! Ungeandika jibu pembeni na kulisoma tu.

Hiyo ndiyo **memoization**: kila tunapopata jibu, tunalihifadhi kwenye kamusi. Tukiulizwa tena, tunaangalia kamusi kwanza.

```nuru
fanya kumbukumbu = {}

kumbukumbu[5] = 5
andika(kumbukumbu[5])         // 5
andika(kumbukumbu[7])         // null: bado hatujaihifadhi
andika(kumbukumbu[7] == +++tupu+++) // kweli
```

Kamusi inarudisha `tupu` kwa ufunguo usiokuwemo. Hivyo `kumbukumbu[n] != tupu` maana yake: "tayari tunalijua jibu hili".
