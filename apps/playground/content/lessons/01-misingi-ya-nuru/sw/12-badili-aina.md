---
title: "12. Kubadili Aina ya Data"
task: "Chukua namba kutoka kwa mtumiaji, iongezee 10 na uonyeshe tokeo."
initialCode: |
  n = jaza("Weka namba: ")
  andika(namba(n) + 10)
solution: "n = jaza(\"10\")\nandika(namba(n) + 10)"
---
Kama unakumbuka, `jaza()` inatoa maandishi. Kama unataka kufanya hesabu na ingizo hilo, lazima ulibadilishe kuwa namba.

### Visaidia-kazi vya Kubadili:
- `namba(kitu)`: Hugeuza kuwa namba nzima.
- `tungo(kitu)`: Hugeuza kuwa maandishi.

### Mfano:
```s
fanya ingizo = jaza("Weka namba: ") // "10"
fanya x = namba(ingizo)            // 10 (sasa ni namba)
andika(x + 5)                      // 15
```

