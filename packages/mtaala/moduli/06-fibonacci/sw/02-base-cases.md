---
title: "Masharti Mawili ya Kusimama"
task: "Ongeza masharti mawili ya kusimama kwenye `fibo`: kama `n == 0` irudishe `0`, na kama `n == 1` irudishe `1`."
initialCode: |
  fanya fibo = unda(n) {
      // Masharti ya kusimama hapa

      rudisha tupu // tutamalizia somo lijalo
  }

  andika("fibo(0) ni", fibo(0))
  andika("fibo(1) ni", fibo(1))
solution: |
  fanya fibo = unda(n) {
      kama (n == 0) {
          rudisha 0
      }
      kama (n == 1) {
          rudisha 1
      }
      rudisha tupu // tutamalizia somo lijalo
  }

  andika("fibo(0) ni", fibo(0))
  andika("fibo(1) ni", fibo(1))
tests:
  - type: exact_output
    message: "fibo(0) irudishe 0 na fibo(1) irudishe 1."
---
Tunataka kitendakazi `fibo(n)` kinachorudisha namba ya `n` kwenye mfuatano. Tunaanza kuhesabu nafasi kutoka 0:

```text
n        0  1  2  3  4  5  6
-------  -  -  -  -  -  -  -
fibo(n)  0  1  1  2  3  5  8
```

Kila namba inategemea namba **mbili** zilizotangulia. Lakini namba mbili za kwanza hazina mbili kabla yao! Hivyo zinahitaji **masharti mawili ya kusimama**: tunazijua tayari, bila kuhesabu.

```nuru
fanya siku_ya_wiki = unda(n) {
    +++kama (n == 1) {
        rudisha "Jumatatu"
    }+++
    +++kama (n == 2) {
        rudisha "Jumanne"
    }+++
    rudisha "Siku nyingine"
}
```

Kila `kama` inayorudisha jibu inasimamisha kitendakazi papo hapo.
