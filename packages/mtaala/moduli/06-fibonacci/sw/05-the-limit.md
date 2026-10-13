---
title: "Kikomo cha Kasi"
task: "Badilisha `fibo(10)` iwe `fibo(18)` kwenye mstari wa `jibu`. Endesha na uangalie idadi ya miito inavyolipuka. Huenda ukasubiri sekunde moja au mbili!"
initialCode: |
  fanya miito = {"idadi": 0}

  fanya fibo = unda(n) {
      miito["idadi"] = miito["idadi"] + 1
      kama (n <= 1) {
          rudisha n
      }
      rudisha fibo(n - 1) + fibo(n - 2)
  }

  fanya jibu = fibo(10)
  andika("Jibu:", jibu)
  andika("Idadi ya miito:", miito["idadi"])
solution: |
  fanya miito = {"idadi": 0}

  fanya fibo = unda(n) {
      miito["idadi"] = miito["idadi"] + 1
      kama (n <= 1) {
          rudisha n
      }
      rudisha fibo(n - 1) + fibo(n - 2)
  }

  fanya jibu = fibo(18)
  andika("Jibu:", jibu)
  andika("Idadi ya miito:", miito["idadi"])
tests:
  - type: exact_output
    message: "Kwa fibo(18), jibu ni 2584 na idadi ya miito ni 8361."
---
Idadi ya miito inakua kwa kasi ya kutisha:

- `fibo(5)`: miito 15
- `fibo(10)`: miito 177
- `fibo(18)`: miito 8,361
- `fibo(30)`: miito 2,692,537
- `fibo(40)`: zaidi ya miito milioni 300

Kila `n` ikiongezeka kwa 1, kazi inakaribia kuongezeka mara 1.6. Kwa `fibo(40)`, hata kompyuta ya haraka ingekaa ikihesabu kwa dakika nyingi.

Tatizo si kompyuta. Ni **mbinu**. Kitendakazi kinahesabu `fibo(2)` maelfu ya mara, kila mara kikianza upya. Somo lijalo litarekebisha hilo.
