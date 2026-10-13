---
title: "Washa Taa ya Kwanza"
task: "Washa taa namba `1` kwenye ubao."
initialCode: |
  tumia ubao

  // Washa taa hapa
solution: |
  tumia ubao

  ubao.washa(1)
tests:
  - type: match_code
    pattern: 'ubao\.washa\('
    message: "Tumia ubao.washa(1) kuwasha taa ya kwanza."
  - type: ubao_mfuatano
    message: "Taa namba 1 peke yake ndiyo inapaswa kuwaka."
---
Karibu kwenye **ubao wa taa**! Huu ni ubao wa elektroniki ndani ya kompyuta yako. Una:

- **taa 8** (LED) zenye namba 1 hadi 8,
- **kengele** inayotoa sauti,
- **skrini** ndogo yenye mistari miwili.

Vifaa halisi vya elektroniki, kama taa za barabarani au mashine ya kufulia, vinaongozwa na programu kama hizi.

Kwanza unaleta ubao kwenye programu yako kwa `tumia ubao`. Kisha unaupa amri:

```nuru
tumia ubao

ubao.+++washa(3)+++
```

Programu hii inawasha taa ya tatu. Namba ndani ya mabano inachagua taa ipi.
