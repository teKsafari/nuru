---
title: "Mrundikano wa Miito"
task: "Hamisha `andika(n)` iwe **baada** ya `hesabu(n - 1)`, ili programu iandike `1` hadi `5` kwa kupanda."
initialCode: |
  fanya hesabu = unda(n) {
      kama (n == 0) {
          rudisha tupu
      }
      andika(n)
      hesabu(n - 1)
  }

  hesabu(5)
solution: |
  fanya hesabu = unda(n) {
      kama (n == 0) {
          rudisha tupu
      }
      hesabu(n - 1)
      andika(n)
  }

  hesabu(5)
tests:
  - type: match_code
    pattern: 'hesabu\(\s*n\s*-\s*1\s*\)\s*\n\s*andika\(\s*n\s*\)'
    message: "Weka andika(n) chini ya hesabu(n - 1)."
  - type: exact_output
    message: "Programu iandike 1, 2, 3, 4, 5, kila moja mstari wake."
---
Kitendakazi kinapoita kitendakazi kingine, cha kwanza **kinasubiri** mpaka cha pili kimalize. Kisha kinaendelea pale kilipoishia.

Kompyuta inaweka miito inayosubiri juu ya kila mmoja, kama sahani zilizorundikwa. Hii inaitwa **mrundikano wa miito** (call stack).

```text
hesabu(5) inasubiri
  hesabu(4) inasubiri
    hesabu(3) inasubiri
      hesabu(2) inasubiri
        hesabu(1) inasubiri
          hesabu(0) inasimama
        hesabu(1) inaendelea: inaandika 1
      hesabu(2) inaendelea: inaandika 2
    ...
```

Ukiandika **kabla** ya kujiita, namba zinatoka unaposhuka kwenye mrundikano. Ukiandika **baada**, zinatoka unaporudi juu, kwa mpangilio wa kinyume.
