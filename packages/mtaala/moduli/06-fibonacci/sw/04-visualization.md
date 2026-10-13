---
title: "Mti wa Miito"
task: "Ita `fibo(5)` kwenye mstari wa `jibu`, kisha endesha programu. Hesabu ni mara ngapi `fibo` inaitwa ili kupata namba moja tu."
initialCode: |
  fanya miito = {"idadi": 0}

  fanya fibo = unda(n) {
      miito["idadi"] = miito["idadi"] + 1
      andika("Nimeitwa kwa n =", n)
      kama (n <= 1) {
          rudisha n
      }
      rudisha fibo(n - 1) + fibo(n - 2)
  }

  fanya jibu = fibo()
  andika("Jibu:", jibu)
  andika("Idadi ya miito:", miito["idadi"])
solution: |
  fanya miito = {"idadi": 0}

  fanya fibo = unda(n) {
      miito["idadi"] = miito["idadi"] + 1
      andika("Nimeitwa kwa n =", n)
      kama (n <= 1) {
          rudisha n
      }
      rudisha fibo(n - 1) + fibo(n - 2)
  }

  fanya jibu = fibo(5)
  andika("Jibu:", jibu)
  andika("Idadi ya miito:", miito["idadi"])
tests:
  - type: match_output
    pattern: 'Jibu: 5\nIdadi ya miito: 15$'
    message: "Ita fibo(5). Jibu liwe 5 na idadi ya miito iwe 15."
  - type: exact_output
    message: "Matokeo yote, pamoja na mistari ya Nimeitwa, yalingane na fibo(5)."
---
Kitendakazi kinachojiita mara mbili kinatengeneza **mti wa miito**. Kila mwito unazaa miito miwili mipya:

```text
                fibo(4)
              /         \
         fibo(3)        fibo(2)
         /     \        /     \
    fibo(2)  fibo(1) fibo(1) fibo(0)
    /     \
fibo(1) fibo(0)
```

Angalia: `fibo(2)` inahesabiwa **mara mbili**. Kompyuta haikumbuki kwamba ilishapata jibu hilo, hivyo inarudia kazi yote.

### Kwa nini kamusi?

Tunataka kuhesabu miito ndani ya kitendakazi. Lakini kumbuka somo la wigo: Nuru hairuhusu kitendakazi kubadili kibadilika cha nje. Kamusi `miito` ni tofauti: tunabadili kilichomo ndani yake, `miito["idadi"]`, si kibadilika chenyewe.
