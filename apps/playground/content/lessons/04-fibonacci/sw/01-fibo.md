---
title: "Fibonacci katika Nuru"
task: "Jaribu kubadilisha `andika(fibo(10))` kuwa `andika(fibo(15))` kuona matokeo tofauti."
initialCode: |
  fanya fibo = unda(x) {
      kama (x == 0) {
          rudisha 0;
      } au kama (x == 1) {
          rudisha 1;
      } sivyo {
          rudisha fibo(x - 1) + fibo(x - 2);
      }
  }

  andika(fibo(10));
solution: |
  fanya fibo = unda(x) {
      kama (x == 0) {
          rudisha 0;
      } au kama (x == 1) {
          rudisha 1;
      } sivyo {
          rudisha fibo(x - 1) + fibo(x - 2);
      }
  }

  andika(fibo(15));
---
Mlolongo wa Fibonacci ni mfululizo wa namba ambapo kila namba ni jumla ya namba mbili zinazotangulia.

Katika Nuru, tunaweza kutumia **recursion** (kitendakazi kinachojiita chenyewe) kutatua fumbo hili.
