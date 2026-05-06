---
title: "5. Kikomo cha Kasi"
task: "Badilisha `fibo(5)` kuwa `fibo(20)` na uone jinsi inavyokuwa nzito. (Kuwa na subira, inaweza kuchukua sekunde chache!)"
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

  andika("Inakokotoa fibo(20)...")
  andika(fibo(20))
---
Kadiri `n` inavyokuwa kubwa, idadi ya wito inalipuka!
- `fibo(5)` = wito 15
- `fibo(10)` = wito 177
- `fibo(20)` = **Zaidi ya wito 13,000!**

Hii ndiyo sababu kujirudia rahisi wakati mwingine kunaweza kuwa "ghali" kwa kompyuta. Inafanya mamilioni ya hesabu kwa namba zile zile ndogo (kama `fibo(2)`) kwa sababu haina kumbukumbu.

**Kazi Yako:** Badilisha ingizo kuwa 20 katika ujumbe wa `andika` na pia kwenye wito wa `fibo`. Angalia mkwamo kidogo wakati kompyuta yako inafanya kazi kwa bidii! Tutarekebisha tatizo hili la kasi katika somo lijalo.

```nuru
andika("Inakokotoa fibo(+++20+++)...")
andika(fibo(+++20+++))
```