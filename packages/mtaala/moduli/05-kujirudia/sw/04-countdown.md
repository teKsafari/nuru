---
title: "Kuhesabu Kurudi Nyuma"
task: "Andika kitendakazi kinachojirudia `hesabu_roketi(n)`: kama `n == 0` kiandike `Rusha roketi!`, vinginevyo kiandike `n` kisha kijiite kwa `n - 1`. Kiite kwa `10`."
initialCode: |
  fanya hesabu_roketi = unda(n) {
      // 1. Sharti la kusimama
      // 2. Andika n
      // 3. Hatua ya kujirudia
  }

  hesabu_roketi(10)
solution: |
  fanya hesabu_roketi = unda(n) {
      kama (n == 0) {
          andika("Rusha roketi!")
          rudisha tupu
      }
      andika(n)
      hesabu_roketi(n - 1)
  }

  hesabu_roketi(10)
tests:
  - type: match_code
    pattern: 'unda\(n\)\s*\{[\s\S]*hesabu_roketi\(\s*n\s*-\s*1\s*\)[\s\S]*\}\s*hesabu_roketi\(\s*10\s*\)'
    message: "Ndani ya kitendakazi, kijiite kwa hesabu_roketi(n - 1). Usitumie kitanzi."
  - type: exact_output
    message: "Programu iandike 10 hadi 1, kila namba mstari wake, kisha Rusha roketi!"
---
Sasa unajua sehemu mbili za kila kitendakazi kinachojirudia:

1. **Sharti la kusimama**: nisimame lini?
2. **Hatua ya kujirudia**: nijiite kwa tatizo gani dogo zaidi?

Fikiria **mdoli wa Kirusi**: mdoli ndani ya mdoli ndani ya mdoli. Kupata mdoli mdogo kabisa:

1. Kama mdoli huu haufunguki, umeupata. (sharti la kusimama)
2. Vinginevyo, ufungue na urudie kwa mdoli ulio ndani. (hatua ya kujirudia)

```nuru
fanya fungua_mdoli = unda(ukubwa) {
    kama (ukubwa == 1) {
        andika("Mdoli mdogo kabisa!")
        rudisha tupu
    }
    andika("Mdoli wa ukubwa", ukubwa)
    fungua_mdoli(ukubwa - 1)
}
```

Safari hii utaandika kitendakazi chote mwenyewe.
