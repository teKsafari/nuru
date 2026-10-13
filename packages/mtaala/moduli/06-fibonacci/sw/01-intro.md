---
title: "Mfuatano wa Fibonacci"
task: "Mfuatano unaishia `..., 8, 13`. Tumia `a` na `b` kuhesabu namba mbili zinazofuata, `c` na `d`, kisha uziandike. Usiandike majibu moja kwa moja: yahesabu kwa `+`."
initialCode: |
  fanya a = 8
  fanya b = 13

  fanya c =
  fanya d =
  andika(c, d)
solution: |
  fanya a = 8
  fanya b = 13

  fanya c = a + b
  fanya d = b + c
  andika(c, d)
tests:
  - type: match_code
    pattern: 'fanya\s+c\s*=\s*(a\s*\+\s*b|b\s*\+\s*a)'
    message: "c ni jumla ya namba mbili zilizotangulia: a + b."
  - type: match_code
    pattern: 'fanya\s+d\s*=\s*(b\s*\+\s*c|c\s*\+\s*b)'
    message: "d ni jumla ya b na c."
  - type: exact_output
    message: "Namba zinazofuata ni 21 na 34."
---
Mfuatano wa **Fibonacci** unaanza na **0** na **1**. Kila namba inayofuata ni **jumla ya namba mbili zilizoitangulia**:

```text
0, 1, 1, 2, 3, 5, 8, 13, ...

0 + 1 = 1
1 + 1 = 2
1 + 2 = 3
2 + 3 = 5
3 + 5 = 8
5 + 8 = 13
```

Mfuatano huu unajitokeza kila mahali kwenye maumbile: idadi ya petali za maua mengi, mpangilio wa mbegu kwenye alizeti, na mizunguko ya ganda la konokono.

Kwenye moduli hii utajifunza njia tatu za kuhesabu Fibonacci kwa kompyuta, na kwa nini moja ni ya haraka mara maelfu kuliko nyingine.
