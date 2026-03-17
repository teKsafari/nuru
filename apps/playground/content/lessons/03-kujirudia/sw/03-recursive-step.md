---
title: "3. Hatua ya Kujirudia (Recursive Step)"
task: "Rekebisha mwito wa kujirudia `hesabu(n)` ili upitishe `n - 1` badala yake. Hii inatusogeza karibu na Kesi ya Msingi!"
initialCode: |
  fanya hesabu = unda(n) {
      // Kesi ya Msingi
      kama (n <= 0) {
          andika("Imekamilika!")
          rudisha tupu
      }

      andika(n)
      
      // Hatua ya Kujirudia: Tunahitaji kupunguza 'n' kwa 1
      hesabu( /* weka n - 1 hapa */ ) 
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
Tuna Kesi ya Msingi ambayo inasimama wakati `n <= 0`. Lakini ikiwa tunaanza na `n = 3` na kuendelea kupitisha `3` kwenye kitendakazi, haitawahi kufika `0`!

Tunahitaji **Hatua ya Kujirudia** (Recursive Step). Hii ina maana kila wakati kitendakazi kinapojiita, lazima kibadilishe hoja yake (argument) ili iwe karibu kidogo na Kesi ya Msingi.

### Kwa nini tunatoa?
Katika mfano huu, tunahesabu kurudi nyuma. Kwa hiyo, kila hatua lazima iwe ndogo kuliko iliyotangulia.
- Hatua ya 1: `hesabu(3)`
- Hatua ya 2: `hesabu(2)`
- Hatua ya 3: `hesabu(1)`
- Hatua ya 4: `hesabu(0)` -> **SIMAMA!**

**Kazi Yako:** Badilisha mwito wa kitendakazi `hesabu(n)` kuwa `hesabu(n - 1)`. Hii hatimaye itafanya kujirudia kufanye kazi!