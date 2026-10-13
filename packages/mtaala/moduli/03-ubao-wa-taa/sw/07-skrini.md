---
title: "Skrini ya Matokeo"
task: "Tengeneza ubao wa magoli. Kwa kila goli kuanzia `1` hadi `3`: andika `Magoli: ` na idadi ya magoli kwenye skrini, washa taa yenye namba ya goli hilo, piga kengele `880` kwa `100`, kisha subiri `200`."
initialCode: |
  tumia ubao

  ubao.skrini("Magoli: 0")
solution: |
  tumia ubao

  ubao.skrini("Magoli: 0")
  kwa goli ktk mfululizo(1, 4) {
      ubao.skrini("Magoli: " + tungo(goli))
      ubao.washa(goli)
      ubao.kengele(880, 100)
      ubao.subiri(200)
  }
tests:
  - type: match_code
    pattern: 'kwa[\s\S]*ubao\.skrini\('
    message: "Sasisha skrini ndani ya kitanzi kwa ubao.skrini()."
  - type: match_code
    pattern: 'ubao\.kengele\('
    message: "Piga kengele kila goli linapofungwa."
  - type: ubao_mfuatano
    message: "Kila goli liwashe taa moja zaidi: taa 1, kisha 1 na 2, kisha 1, 2 na 3."
---
Ubao una skrini ndogo yenye mistari 2, kila mstari herufi 16. Ni kama skrini za mashine za kulipia LUKU au za vituo vya mafuta.

```nuru
tumia ubao

ubao.+++skrini("Habari Tanzania!")+++
```

Kila unapoita `ubao.skrini()`, maandishi mapya yanafuta yale ya zamani.

### Kuunganisha neno na namba

`+` inaweza kuunganisha maneno mawili. Lakini kuunganisha neno na namba, badili namba kuwa neno kwanza kwa `tungo()`:

```nuru
fanya dakika = 90
ubao.skrini("Dakika " + +++tungo(dakika)+++)
```
