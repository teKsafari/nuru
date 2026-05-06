---
title: "4. Kuhesabu Kurudi Nyuma"
task: "Jaribu kubadilisha nambari ya kuanzia kuwa `10` na uone hesabu kamili ya kurudi nyuma ikifanya kazi."
initialCode: |
  fanya hesabu = unda(n) {
      kama (n <= 0) {
          andika("Rusha roketi!")
          rudisha tupu
      }
      
      andika(n)
      hesabu(n - 1)
  }

  hesabu()
solution: |
  fanya hesabu = unda(n) {
      kama (n <= 0) {
          andika("Rusha roketi!")
          rudisha tupu
      }
      andika(n)
      hesabu(n - 1)
  }
  hesabu(10)
---
Umefanikiwa! Umejenga kitendakazi chako cha kwanza cha kujirudia kinachofanya kazi kikamilifu.

Kitendakazi cha kujirudia kila wakati huwa na sehemu hizi mbili muhimu:
1. **Sharti la Kusimama (Base Case):** Lini nisimame? (`kama (n <= 0)`)
2. **Hatua ya Kujirudia (Recursive Step):** Ninasongaje karibu na kusimama? (`hesabu(n - 1)`)

### Mfano wa Kifikra:
Fikiria mwanasesere wa Kirusi (nesting doll). Ili kupata zawadi katikati, wewe:
1. Unafungua mwanasesere wa sasa.
2. Ikiwa ni mwanasesere mdogo zaidi (**Sharti la Kusimama**), unachukua zawadi.
3. Ikiwa sivyo, unafungua mwanasesere anayefuata mdogo zaidi (**Hatua ya Kujirudia**).

**Kazi Yako:** Jaribu nguvu ya kitendakazi chako! Badilisha nambari ya kuanzia kuwa `10` hapa chini.

```nuru
fanya hesabu = unda(n) {
    kama (n <= 0) {
        andika("Rusha roketi!")
        rudisha tupu
    }
    
    andika(n)
    hesabu(n - 1)
}

hesabu(+++10+++)
```
