---
title: "Nyota"
task: "Chora nyota yenye ncha 5. Kila ncha: mbele hatua `200`, kisha geuka kulia digrii `144`. Tumia kitanzi."
initialCode: |
  tumia kobe

  kobe.rangi("dhahabu")
  kobe.unene(3)
solution: |
  tumia kobe

  kobe.rangi("dhahabu")
  kobe.unene(3)
  kwa i ktk mfululizo(5) {
      kobe.mbele(200)
      kobe.kulia(144)
  }
tests:
  - type: match_code
    pattern: 'kwa\s+\w+\s+ktk|wakati\s*\('
    message: "Tumia kitanzi kuchora ncha zote 5."
  - type: kobe_picha
    message: "Nyota yako haifanani na inayotakiwa: mistari 5 ya hatua 200, ukigeuka kulia digrii 144 kila mara."
---
Nyota ni kama poligoni yenye ujanja. Badala ya kurudi alipoanzia baada ya mzunguko mmoja, kobe anazunguka **mara mbili**.

Kwa nyota ya ncha 5, jumla ya kugeuka ni `2 x 360 = 720`. Gawanya kwa 5 upate digrii **144** kwa kila ncha.

```nuru
tumia kobe

// Nyota ya ncha 7 inazunguka mara 3: 3 x 360 / 7
kwa i ktk mfululizo(7) {
    kobe.mbele(180)
    kobe.kulia(+++3 * 360 / 7+++)
}
```

Ukimaliza, jaza nyota yako kwa rangi kwa kutumia ulichojifunza kwenye somo la kujaza maumbo.
