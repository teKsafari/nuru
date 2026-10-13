---
title: "Factorial"
task: "Kamilisha `factorial` kwa hatua ya kujirudia: `n` mara `factorial(n - 1)`."
initialCode: |
  fanya factorial = unda(n) {
      kama (n <= 1) {
          rudisha 1
      }
      // Hatua ya kujirudia hapa
  }

  andika("5! ni", factorial(5))
  andika("10! ni", factorial(10))
solution: |
  fanya factorial = unda(n) {
      kama (n <= 1) {
          rudisha 1
      }
      rudisha n * factorial(n - 1)
  }

  andika("5! ni", factorial(5))
  andika("10! ni", factorial(10))
tests:
  - type: match_code
    pattern: 'rudisha[^\n]*factorial\('
    message: "Rudisha n * factorial(n - 1). Kitendakazi kijiite chenyewe."
  - type: exact_output
    message: "5! ni 120, na 10! ni 3628800."
---
Kujirudia kunang'aa kwenye hesabu zinazojengwa juu ya majibu madogo.

**Factorial** ya `n`, inayoandikwa `n!`, ni kuzidisha namba zote kuanzia 1 hadi `n`:

`5! = 5 x 4 x 3 x 2 x 1 = 120`

Angalia ujanja: `5!` ni `5 x 4!`. Na `4!` ni `4 x 3!`. Kila factorial ina factorial ndogo ndani yake.

```nuru
// Mfano unaofanana: jumla ya namba 1 hadi n
fanya jumla_hadi = unda(n) {
    kama (n == 0) {
        rudisha 0
    }
    +++rudisha n + jumla_hadi(n - 1)+++
}

andika(jumla_hadi(4)) // 4 + 3 + 2 + 1 = 10
```

Factorial inakua haraka sana. Jaribu `factorial(20)` ukimaliza!
