---
title: "Kengele na Wimbo"
task: "Piga noti zote 8 za orodha `noti` kwa `ubao.kengele(sauti, 150)`. Wakati kila noti inalia, washa taa yenye namba ya nafasi yake (noti ya kwanza taa 1, na kuendelea), kisha izime noti ikiisha."
initialCode: |
  tumia ubao

  // Do, Re, Mi, Fa, So, La, Ti, Do
  fanya noti = [262, 294, 330, 349, 392, 440, 494, 523]

  ubao.kengele(noti[0], 150)
solution: |
  tumia ubao

  // Do, Re, Mi, Fa, So, La, Ti, Do
  fanya noti = [262, 294, 330, 349, 392, 440, 494, 523]

  kwa i, sauti ktk noti {
      ubao.washa(i + 1)
      ubao.kengele(sauti, 150)
      ubao.zima(i + 1)
  }
tests:
  - type: match_code
    pattern: 'kwa[\s\S]*ubao\.kengele\('
    message: "Piga kengele ndani ya kitanzi cha kwa."
  - type: ubao_mfuatano
    message: "Kila noti iwashe taa yake: noti ya kwanza taa 1, ya pili taa 2, hadi ya nane taa 8."
---
`ubao.kengele(sauti, muda)` inapiga kengele. Inapokea vitu viwili:

- **sauti**: namba ya mitetemo kwa sekunde (Hz). Namba kubwa ni sauti nyembamba, namba ndogo ni sauti nzito.
- **muda**: kengele ilie kwa milisekunde ngapi.

```nuru
tumia ubao

ubao.kengele(+++440+++, 300) // noti La
ubao.kengele(+++880+++, 300) // La ya juu zaidi
```

Programu inasubiri kengele imalize kabla ya kuendelea, hivyo huhitaji `subiri` kati ya noti.

### Kitanzi chenye nafasi

Kitanzi cha `kwa` kinaweza kukupa **nafasi** ya kila kitu pamoja na kitu chenyewe:

```nuru
kwa nafasi, tunda ktk ["embe", "papai"] {
    andika(nafasi, tunda) // 0 embe, kisha 1 papai
}
```

Nafasi inaanza 0, lakini taa zinaanza 1. Hivyo taa ya kila noti ni `nafasi + 1`.
