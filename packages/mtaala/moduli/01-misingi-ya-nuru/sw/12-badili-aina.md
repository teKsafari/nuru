---
title: "Kubadili Aina ya Data"
task: "Programu inauliza bei ya embe moja. Tumia `namba()` kubadili jibu kuwa namba, kisha andika bei ya maembe 3."
initialCode: |
  fanya bei = jaza("Bei ya embe moja? ")
  andika("Maembe 3 ni shilingi", bei * 3)
solution: |
  fanya bei = jaza("Bei ya embe moja? ")
  andika("Maembe 3 ni shilingi", namba(bei) * 3)
stdin: "500"
tests:
  - type: match_code
    pattern: 'namba\('
    message: "Tumia namba() kubadili jibu la jaza() kuwa namba."
  - type: io
    input: "500"
    message: "Bei ikiwa 500, programu iandike: Maembe 3 ni shilingi 1500"
  - type: io
    input: "1200"
    message: "Bei ikiwa 1200, programu iandike: Maembe 3 ni shilingi 3600"
---
Endesha programu kama ilivyo na uandike `500`. Jibu ni `500500500`, si `1500`!

Sababu ni kwamba `jaza()` inarudisha **neno**. Kwa Nuru, neno mara 3 ni neno lilelile limerudiwa mara tatu.

Ili kufanya hesabu, badili neno kuwa namba kwanza:

- `namba()` inabadili neno kuwa namba kamili. Mfano: `namba("42")` ni `42`
- `desimali()` inabadili neno kuwa desimali. Mfano: `desimali("2.5")` ni `2.5`
- `tungo()` inabadili kitu chochote kuwa neno. Mfano: `tungo(42)` ni `"42"`

```nuru
fanya umri = jaza("Una miaka mingapi? ")
andika("Mwakani utakuwa na miaka", +++namba(umri)+++ + 1)
```
