---
title: "7. Fibonacci ya Haraka"
task: "Endesha kodi iliyoboreshwa ya `fibo(40)`. Angalia jinsi sasa inavyotokea papo hapo!"
initialCode: |
  fanya kumbukumbu = {}

  fanya fibo = unda(n) {
      kama (n <= 1) { rudisha n }
      kama (kumbukumbu[n] != tupu) {
          rudisha kumbukumbu[n]
      }

      fanya jibu = fibo(n - 1) + fibo(n - 2)
      kumbukumbu[n] = jibu
      rudisha jibu
  }

  andika("Inakokotoa fibo(40) kwa haraka...")
  // andika matokeo ya fibo(40) hapa
solution: |
  fanya kumbukumbu = {}

  fanya fibo = unda(n) {
      kama (n <= 1) { rudisha n }
      kama (kumbukumbu[n] != tupu) {
          rudisha kumbukumbu[n]
      }

      fanya jibu = fibo(n - 1) + fibo(n - 2)
      kumbukumbu[n] = jibu
      rudisha jibu
  }

  andika("Inakokotoa fibo(40) kwa haraka...")
  andika(fibo(40))
---
Hongera! Umemudu moja ya changamoto za kizamani zaidi katika upangaji programu.

### Ulichojifunza:
1. **Kujirudia (Recursion):** Kitendakazi kinaweza kujiita chenyewe ili kutatua tatizo gumu.
2. **Kujirudia Mara Mbili:** Wito mmoja unaweza kugawanyika mara mbili, na kutengeneza mti.
3. **Utendaji (Performance):** Kujirudia kunaweza kuwa polepole ikiwa kunarudia kazi.
4. **Memoization:** Kuhifadhi matokeo kwenye kumbukumbu kunafanya kodi yako iwe na kasi mara maelfu zaidi.

**Kazi Yako:** Endesha kodi kwa ajili ya `fibo(40)` kwa kutumia `andika(fibo(40))`. Bila memoization, hii ingechukua mabilioni ya hatua na pengine ingekwama. Kwa memoization, inamaliza kabla hata hujapepesa jicho!

```nuru
andika("Inakokotoa fibo(40) kwa haraka...")
+++andika(fibo(40))+++
```