---
title: "6. Kukumbuka Matokeo (Memoization)"
task: "Kamilisha kitendakazi cha `fibo_haraka` ili kuangalia ikiwa matokeo tayari yapo kwenye kamusi ya `kumbukumbu`."
initialCode: |
  fanya kumbukumbu = {}

  fanya fibo_haraka = unda(n) {
      kama (n <= 1) { rudisha n }

      // 1. Angalia ikiwa tayari tunajua jibu!
      kama (kumbukumbu[n] != tupu) {
          andika("Nakumbuka namba", n)
          rudisha // rudisha jibu kutoka kumbukumbu
      }

      // 2. Kama sivyo, kokotoa && UIIFADHI
      fanya jibu = fibo_haraka(n - 1) + fibo_haraka(n - 2)
      kumbukumbu[n] = jibu
      rudisha jibu
  }

  andika(fibo_haraka(10))
solution: |
  fanya kumbukumbu = {}

  fanya fibo_haraka = unda(n) {
      kama (n <= 1) { rudisha n }

      kama (kumbukumbu[n] != tupu) {
          rudisha kumbukumbu[n]
      }

      fanya jibu = fibo_haraka(n - 1) + fibo_haraka(n - 2)
      kumbukumbu[n] = jibu
      rudisha jibu
  }

  andika(fibo_haraka(10))
---
Tunafanyaje Fibonacci iwe haraka? Tunakipa kitendakazi **Kumbukumbu**!

Katika sayansi ya kompyuta, hii inaitwa **Memoization**. Kila wakati tunapokokotoa namba, tunaihifadhi kwenye kamusi (dictionary). Wakati mwingine tukiihitaji, tunaiangalia tu badala ya kuikokotoa upya.

### Kwa nini ni haraka:
Ukiwa na kumbukumbu, `fibo(30)` inatoka kwenye wito Milioni 2 hadi wito **30** tu. Hiyo ni ongezeko kubwa sana la kasi!

**Kazi Yako:** Malizia sentensi ya `kama` ili kurudisha thamani iliyohifadhiwa ikiwa ipo kwenye `kumbukumbu[n]`. (Katika Nuru, tunatumia `tupu` kuangalia ikiwa thamani haipo).

```nuru
kama (kumbukumbu[n] != tupu) {
    rudisha +++kumbukumbu[n]+++
}
```