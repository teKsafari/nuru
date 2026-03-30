---
title: "5. Kikomo cha Kasi"
task: "Badilisha `fibo(5)` kuwa `fibo(30)` na uone jinsi inavyokuwa nzito. (Kuwa na subira, inaweza kuchukua sekunde chache!)"
initialCode: |
  fanya fibo = unda(n) {
      kama (n <= 1) {
          rudisha n
      }
      rudisha fibo(n - 1) + fibo(n - 2)
  }

  // Jaribu namba kubwa zaidi
  andika("Inakokotoa fibo(5)...")
  andika(fibo(5))
solution: |
  fanya fibo = unda(n) {
      kama (n <= 1) {
          rudisha n
      }
      rudisha fibo(n - 1) + fibo(n - 2)
  }

  andika("Inakokotoa fibo(30)...")
  andika(fibo(30))
---
Kadiri `n` inavyokuwa kubwa, idadi ya wito inalipuka!
- `fibo(5)` = wito 15
- `fibo(10)` = wito 177
- `fibo(30)` = **Zaidi ya wito Milioni 2!**

Hii ndiyo sababu kujirudia rahisi wakati mwingine kunaweza kuwa "ghali" kwa kompyuta. Inafanya mamilioni ya hesabu kwa namba zile zile ndogo (kama `fibo(2)`) kwa sababu haina kumbukumbu.

**Kazi Yako:** Badilisha ingizo (input) kuwa 30. Angalia mkwamo kidogo wakati kompyuta yako inafanya kazi kwa bidii kukokotoa mamilioni ya hatua! Tutarekebisha tatizo hili la kasi katika somo lijalo.