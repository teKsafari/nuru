---
title: "Kujirudia Mara Mbili"
task: "Kamilisha `fibo` kwa hatua ya kujirudia: irudishe `fibo(n - 1) + fibo(n - 2)`."
initialCode: |
  fanya fibo = unda(n) {
      kama (n <= 1) {
          rudisha n
      }
      // Hatua ya kujirudia hapa
  }

  andika("fibo(5) ni", fibo(5))
  andika("fibo(6) ni", fibo(6))
  andika("fibo(10) ni", fibo(10))
solution: |
  fanya fibo = unda(n) {
      kama (n <= 1) {
          rudisha n
      }
      rudisha fibo(n - 1) + fibo(n - 2)
  }

  andika("fibo(5) ni", fibo(5))
  andika("fibo(6) ni", fibo(6))
  andika("fibo(10) ni", fibo(10))
tests:
  - type: match_code
    pattern: 'rudisha[^\n]*fibo\([^\n]*fibo\('
    message: "Rudisha jumla ya miito miwili: fibo(n - 1) + fibo(n - 2)."
  - type: exact_output
    message: "fibo(5) ni 5, fibo(6) ni 8, na fibo(10) ni 55."
---
Angalia ujanja kwenye sharti la kusimama: `kama (n <= 1) { rudisha n }` inashughulikia 0 na 1 kwa pamoja, kwa sababu `fibo(0)` ni 0 na `fibo(1)` ni 1.

Sasa sheria ya Fibonacci yenyewe: kila namba ni jumla ya mbili zilizotangulia. Kwa Nuru, kitendakazi kinajiita **mara mbili**:

```text
fibo(n) = fibo(n - 1) + fibo(n - 2)
```

Ukiomba `fibo(2)`:

1. Inaita `fibo(1)`, inayorudisha 1.
2. Inaita `fibo(0)`, inayorudisha 0.
3. Inajumlisha: `1 + 0 = 1`.
