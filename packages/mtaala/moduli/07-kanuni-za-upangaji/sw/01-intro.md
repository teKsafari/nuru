---
title: "Kwa Nini Kupanga?"
task: "Tumia kitanzi cha `kwa` kutafuta alama ndogo zaidi kwenye orodha `alama`, kisha uiandike."
initialCode: |
  fanya alama = [67, 45, 89, 32, 76, 54, 91, 28, 63]

  fanya ndogo = alama[0]
  // Pitia kila alama hapa

  andika("Alama ndogo zaidi:", ndogo)
solution: |
  fanya alama = [67, 45, 89, 32, 76, 54, 91, 28, 63]

  fanya ndogo = alama[0]
  kwa a ktk alama {
      kama (a < ndogo) {
          ndogo = a
      }
  }

  andika("Alama ndogo zaidi:", ndogo)
tests:
  - type: match_code
    pattern: 'kwa\s+\w+\s+ktk'
    message: "Pitia alama zote kwa kitanzi cha kwa."
  - type: exact_output
    message: "Alama ndogo zaidi ni 28."
---
Fikiria kamusi ya Kiswahili ambayo maneno yake hayajapangwa kwa alfabeti. Kutafuta neno moja kungekuchukua saa nzima! Kwa sababu maneno **yamepangwa**, unalipata ndani ya sekunde chache.

Kompyuta zinapanga data kila wakati: matokeo ya mtihani kutoka juu kwenda chini, nyimbo kwa jina, bidhaa kwa bei.

### Ukiwa na orodha isiyopangwa

Kupata alama ndogo zaidi, lazima uangalie **kila** alama. Hakuna njia ya mkato:

```nuru
fanya bei = [1200, 800, 1500]
fanya kubwa = bei[0]
kwa b ktk bei {
    kama (b > kubwa) {
        +++kubwa = b+++
    }
}
andika(kubwa) // 1500
```

Kama orodha ingekuwa imepangwa, jibu lingekuwa `alama[0]` papo hapo. Kwenye moduli hii utajenga **Merge Sort**, mojawapo ya njia bora za kupanga zilizowahi kubuniwa.
