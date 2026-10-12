---
title: "3. Hatua ya Kujirudia (Recursive Step)"
task: "Rekebisha mwito wa kujirudia `hesabu(n)` ili upitishe `n - 1` badala yake. Hii inatuleta karibu na sharti la kusimama!"
initialCode: |
  fanya hesabu = unda(n) {
      kama (n <= 0) {
          andika("Imekamilika!")
          rudisha tupu
      }

      andika(n)
      hesabu() 
  }

  hesabu(3)
solution: |
  fanya hesabu = unda(n) {
      kama (n <= 0) {
          andika("Imekamilika!")
          rudisha tupu
      }

      andika(n)
      hesabu(n - 1)
  }

  hesabu(3)
---
Tunalo Sharti la Kusimama ambalo linasimama wakati `n <= 0`. Lakini ikiwa tutaanza na `n = 3` na kuendelea kupitisha `3` kwenye kitendakazi, hakitawahi kufika `0`!

Tunahitaji **Hatua ya Kujirudia**. Hii ina maana kila wakati kitendakazi kinapojiita chenyewe, lazima kibadilishe kigezo chake ili kisongee karibu kidogo na Sharti la Kusimama.

### Kwa nini kutoa?
Katika mfano huu, tunatayarisha kuhesabu kurudi nyuma. Kwa hivyo, kila hatua lazima iwe ndogo kuliko ya mwisho.
- Hatua ya 1: `hesabu(3)`
- Hatua ya 2: `hesabu(2)`
- Hatua ya 3: `hesabu(1)`
- Hatua ya 4: `hesabu(0)` -> **SIMAMA!**

**Kazi Yako:** Kamilisha Hatua ya Kujirudia kwa kupitisha `n - 1` kwenye mwito wa kitendakazi.

```nuru
fanya hesabu = unda(n) {
    kama (n <= 0) {
        andika("Imekamilika!")
        rudisha tupu
    }

    andika(n)
    hesabu(+++n - 1+++)
}

hesabu(3)
```
