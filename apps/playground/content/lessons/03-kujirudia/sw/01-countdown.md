---
title: "1. Kuhesabu Kinyumenyume"
task: "Jaribu kubadilisha `hesabu(5)` kuwa `hesabu(10)` uone mabadiliko."
initialCode: |
  fanya hesabu = unda(n) {
      // Hali ya Msingi (Base Case)
      kama (n <= 0) {
          andika("Tunaanza!")
          rudisha tupu
      }
      
      andika(n)
      // Kitendakazi kinajiita chenyewe kwa namba ndogo zaidi
      hesabu(n - 1)
  }

  hesabu(5)
solution: |
  fanya hesabu = unda(n) {
      kama (n <= 0) {
          andika("Tunaanza!")
          rudisha tupu
      }
      andika(n)
      hesabu(n - 1)
  }
  hesabu(10)
---
**Kujirudia (Recursion)** ni pale kitendakazi kinapojiita chenyewe ili kutatua tatizo dogo zaidi. Ni kama mdoli wa Kirusi (Russian Doll) - unafungua mmoja mkubwa, unakuta mwingine mdogo ndani.

Jambo la muhimu zaidi ni **Hali ya Msingi (Base Case)**. Hii ni hali inayoiambia programu "Acha sasa!". Bila hii, programu itajirudia milele na kukwama.
