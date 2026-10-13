---
title: "Fibonacci kwa Kitanzi"
task: "Kamilisha `fibo_kitanzi(n)` kwa kitanzi: anza na `a = 0` na `b = 1`, na kila mzunguko `a` ichukue thamani ya `b`, na `b` ichukue `a + b`. Mwishoni rudisha `a`."
initialCode: |
  fanya fibo_kitanzi = unda(n) {
      fanya a = 0
      fanya b = 1
      // Kitanzi hapa
      rudisha a
  }

  andika("fibo(10) ni", fibo_kitanzi(10))
  andika("fibo(50) ni", fibo_kitanzi(50))
  andika("fibo(90) ni", fibo_kitanzi(90))
solution: |
  fanya fibo_kitanzi = unda(n) {
      fanya a = 0
      fanya b = 1
      kwa i ktk mfululizo(n) {
          fanya ijayo = a + b
          a = b
          b = ijayo
      }
      rudisha a
  }

  andika("fibo(10) ni", fibo_kitanzi(10))
  andika("fibo(50) ni", fibo_kitanzi(50))
  andika("fibo(90) ni", fibo_kitanzi(90))
tests:
  - type: match_code
    pattern: 'kwa\s+\w+\s+ktk|wakati\s*\('
    message: "Tumia kitanzi cha kwa au wakati."
  - type: exact_output
    message: "fibo(10) ni 55, fibo(50) ni 12586269025, na fibo(90) ni 2880067194370816120."
---
Memoization ilituokoa. Lakini kuna njia rahisi zaidi: tembea mbele hatua kwa hatua, ukikumbuka namba **mbili za mwisho** tu.

```text
a  b
0  1
1  1
1  2
2  3
3  5
```

Kila mzunguko: `a` mpya ni `b` ya zamani, na `b` mpya ni jumla ya zote mbili.

Kuwa makini na mpangilio! Ukiandika `a = b` kwanza, umepoteza `a` ya zamani kabla ya kuitumia. Hifadhi jumla kwenye kibadilika cha muda kwanza:

```nuru
fanya +++ijayo = a + b+++
a = b
b = ijayo
```

Hongera kwa kumaliza moduli hii! Umeona mambo makubwa matatu: kujirudia mara mbili, gharama ya kurudia kazi, na jinsi mbinu bora inavyofanya programu iwe ya haraka mara maelfu.
