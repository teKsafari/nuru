---
title: "Kuzima na Kusubiri"
task: "Fanya taa namba `1` iwake na kuzima mara `3`. Kila mara: washa, subiri `200`, zima, subiri `200`. Tumia kitanzi cha `kwa`."
initialCode: |
  tumia ubao

  ubao.washa(1)
  ubao.zima(1)
solution: |
  tumia ubao

  kwa i ktk mfululizo(3) {
      ubao.washa(1)
      ubao.subiri(200)
      ubao.zima(1)
      ubao.subiri(200)
  }
tests:
  - type: match_code
    pattern: 'ubao\.subiri\('
    message: "Tumia ubao.subiri() ili macho yaweze kuona taa ikiwaka."
  - type: match_code
    pattern: 'kwa\s+\w+\s+ktk|wakati\s*\('
    message: "Tumia kitanzi kurudia mara 3."
  - type: ubao_mfuatano
    message: "Taa namba 1 iwake na kuzima mara 3 hasa."
---
Endesha programu ya mwanzo. Uliiona taa ikiwaka? Hapana! Kompyuta ni ya haraka mno: inawasha na kuzima ndani ya sehemu ndogo sana ya sekunde.

Ndiyo sababu tunahitaji `ubao.subiri()`. Inasimamisha programu kwa muda fulani, kwa **milisekunde**. Sekunde moja ni milisekunde 1000.

```nuru
tumia ubao

ubao.washa(2)
+++ubao.subiri(500)+++  // nusu sekunde
ubao.zima(2)
```

Taa inayowaka na kuzima tena na tena inaitwa **kufumbafumbua** (blink). Ni programu ya kwanza kabisa wanayoandika wahandisi wa elektroniki wanapopata ubao mpya.
