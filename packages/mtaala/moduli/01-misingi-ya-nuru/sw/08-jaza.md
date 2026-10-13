---
title: "Kupokea Ingizo (jaza)"
task: "Tumia `jaza()` kumuuliza mtumiaji chakula anachopenda. Kisha andika `Chakula ninachopenda ni` ikifuatiwa na jibu lake."
initialCode: |
  fanya chakula =
  andika()
solution: |
  fanya chakula = jaza("Unapenda chakula gani? ")
  andika("Chakula ninachopenda ni", chakula)
stdin: "Wali"
tests:
  - type: match_code
    pattern: 'jaza\('
    message: "Tumia jaza() kupokea jibu la mtumiaji."
  - type: io
    input: "Ugali"
    message: "Mtumiaji akijibu Ugali, programu iandike: Chakula ninachopenda ni Ugali"
  - type: io
    input: "Pilau"
    message: "Mtumiaji akijibu Pilau, programu iandike: Chakula ninachopenda ni Pilau"
---
Mpaka sasa programu zako zimekuwa zikiongea peke yake. `jaza()` inaruhusu mtumiaji naye ajibu.

`jaza()` inaonyesha swali, inasubiri mtumiaji aandike jibu na kubonyeza Enter, kisha inarudisha jibu hilo:

```nuru
fanya jina = +++jaza("Jina lako ni nani? ")+++
andika("Karibu,", jina)
```

Ukiendesha programu hii, terminal itakuuliza jina lako. Andika jibu kisha bonyeza Enter.

**Muhimu:** `jaza()` inarudisha **neno** kila mara, hata mtumiaji akiandika namba. Tutaona kwa nini hilo ni muhimu katika somo la kubadili aina.
