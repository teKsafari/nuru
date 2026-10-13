---
title: "Sharti la Kusimama"
task: "Ongeza sharti la kusimama mwanzoni mwa `hesabu`: kama `n == 0`, andika `Tayari!` kisha `rudisha tupu`."
initialCode: |
  fanya hesabu = unda(n) {
      // Sharti la kusimama hapa

      andika(n)
      hesabu(n - 1)
  }

  hesabu(3)
solution: |
  fanya hesabu = unda(n) {
      kama (n == 0) {
          andika("Tayari!")
          rudisha tupu
      }

      andika(n)
      hesabu(n - 1)
  }

  hesabu(3)
tests:
  - type: match_code
    pattern: 'kama\s*\(\s*n\s*(==|<=)\s*0\s*\)'
    message: "Ongeza kama (n == 0) { ... } mwanzoni mwa kitendakazi."
  - type: exact_output
    message: "Programu iandike 3, 2, 1, kisha Tayari!"
---
Kitendakazi kinachojirudia kinahitaji **sharti la kusimama** (base case). Ni swali rahisi linaloulizwa kila mwito: "Je, nimefika mwisho?"

```nuru
fanya fungua_zawadi = unda(masanduku) {
    +++kama (masanduku == 0) {
        andika("Zawadi imepatikana!")
        rudisha tupu
    }+++
    andika("Nafungua sanduku. Yamebaki", masanduku - 1)
    fungua_zawadi(masanduku - 1)
}

fungua_zawadi(3)
```

`rudisha tupu` inamaliza kitendakazi bila kurudisha jibu lolote. Kila mwito unapunguza namba kwa moja, hivyo mwishowe tunafika 0 na kusimama.
