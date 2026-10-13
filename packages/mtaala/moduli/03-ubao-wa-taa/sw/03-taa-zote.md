---
title: "Taa Zote"
task: "Washa taa zote moja moja kuanzia `1` hadi `8` kwa kitanzi, ukisubiri `100` kati ya kila taa. Mwishoni zima zote kwa `ubao.zima_zote()`."
initialCode: |
  tumia ubao

  ubao.washa(1)
solution: |
  tumia ubao

  kwa i ktk mfululizo(1, 9) {
      ubao.washa(i)
      ubao.subiri(100)
  }
  ubao.zima_zote()
tests:
  - type: match_code
    pattern: 'kwa\s+\w+\s+ktk|wakati\s*\('
    message: "Tumia kitanzi kuwasha taa zote 8."
  - type: match_code
    pattern: 'ubao\.zima_zote\(\)'
    message: "Mwishoni tumia ubao.zima_zote()."
  - type: ubao_mfuatano
    message: "Taa ziwake moja moja kuanzia 1 hadi 8, kisha zizime zote."
---
Kuandika `ubao.washa()` mara nane kunachosha. Kitanzi kinaweza kukufanyia kazi hiyo, kwa sababu namba ya taa inaweza kuwa kibadilika:

```nuru
tumia ubao

kwa taa ktk mfululizo(1, 5) {
    ubao.washa(+++taa+++)
}
```

Mfano huu unawasha taa 1, 2, 3 na 4. Kumbuka: `mfululizo(1, 5)` inaishia kabla ya 5.

Kuna njia za mkato pia:

- `ubao.washa_zote()` inawasha taa zote 8.
- `ubao.zima_zote()` inazima taa zote 8.
