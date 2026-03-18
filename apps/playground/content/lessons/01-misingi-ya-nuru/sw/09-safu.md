---
title: "9. Orodha (Safu)"
task: "Tengeneza safu ya `rangi` yenye \"nyekundu\" na \"kijani\", ongeza \"bluu\" ukitumia `sukuma`, kisha andika idadi ya rangi."
initialCode: |
  rangi = ["nyekundu", "kijani"]
  rangi.sukuma("bluu")
  andika(rangi.idadi())
solution: "rangi = [\"nyekundu\", \"kijani\"]\nrangi.sukuma(\"bluu\")\nandika(rangi.idadi())"
---
Safu ni mkusanyiko wa vitu vingi katika sanduku moja. Vitu hivi huwekwa ndani ya mabano mraba `[ ]`.

### Mambo ya Muhimu:
- Nafasi ya kwanza ni **0**.
- Nafasi ya pili ni **1**, na kuendelea.
- `idadi()` inakupa idadi ya vitu.
- `sukuma(kitu)` inaongeza kitu mwishoni.

### Mfano:
```s
fanya wanafunzi = ["Juma", "Asha"]
wanafunzi.sukuma("Baraka")
andika(wanafunzi[0])      // Juma
andika(wanafunzi.idadi()) // 3
```

