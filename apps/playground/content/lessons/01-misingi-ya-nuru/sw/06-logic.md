---
title: "6. Ulinganifu na Mantiki"
task: "Linganisha kama `50` ni kubwa kuliko `20` **NA** `10` ni sawa na `10`."
initialCode: |
  andika(50 > 20 && 10 == 10)
solution: "andika(50 > 20 && 10 == 10)"
---
Unapotaka kulinganisha thamani, unatumia viendeshaji hivi:

### Alama za Ulinganifu:
- `==` (Sawa), `!=` (Si sawa), `>` (Kubwa), `<` (Ndogo), `>=` (Kubwa au sawa), `<=` (Ndogo au sawa).

### Mantiki (Logic):
- `&&` (**Na**): Kweli kama zote ni kweli.
- `||` (**Au**): Kweli kama angalau moja ni kweli.
- `!` (**Siyo**): Inageuza `kweli` kuwa `sikweli`.

### Mfano:
```nuru
andika(10 +++>+++ 5)          // kweli
andika(5 +++==+++ 5 +++&&+++ 2 +++>+++ 3) // sikweli (kwa sababu 2 si zaidi ya 3)
andika(5 +++==+++ 5 +++||+++ 2 +++>+++ 3) // kweli (kwa sababu upande mmoja ni kweli)
```

