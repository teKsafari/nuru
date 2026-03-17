---
title: "10. Vitanzi vya Kwa (Loops)"
task: "Andika kitanzi kinachochapisha namba kutoka 0 mpaka 4 ukitumia `mfululizo(5)`."
initialCode: |
  kwa i katika mfululizo(5) {
      andika(i)
  }
solution: "kwa i katika mfululizo(5) {\n    andika(i)\n}"
---
Vitanzi vinatumiwa kurudia jambo mara nyingi. Neno `kwa` linatusaidia kupita kwenye kila kitu katika safu au tungo.

### Kupita kwenye Safu:
```s
matunda = ["Embe", "Papai", "Nanasi"]
kwa t ktk matunda {
    andika("Napenda", t)
}
```

### Kutumia mfululizo():
```s
kwa i katika mfululizo(1, 6) {
    andika("Namba:", i) // Itachapisha 1, 2, 3, 4, 5
}
```

