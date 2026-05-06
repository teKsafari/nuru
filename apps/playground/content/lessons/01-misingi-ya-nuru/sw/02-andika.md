---
title: "2. Kutoa Matokeo (andika)"
task: "Tumia `andika()` kuchapisha jina lako na mji unaoishi katika mistari miwili tofauti ukitumia `/n`."
initialCode: |
  andika("Jina langu ni ... /n Naishi ...")
solution: "andika(\"Jina langu ni Amani /n Naishi Dar es Salaam\")"
---
Kitendakazi cha `andika()` kinatumika kutoa taarifa au matokeo kwenye skrini. Ni njia yetu kuu ya kuzungumza na mtumiaji.

### Sifa za andika():
1. Inachukua kitu chochote (namba, maandishi, n.k.) na kukichapisha.
2. Unaweza kuandika vitu vingi kwa pamoja ukivigawa kwa mkwaju (comma `,`).
3. Kwa maandishi (tungo), lazima uyaweke ndani ya alama za nukuu `" "`.

### Mfano:
```s
andika("Mambo", "vipi?") // Itachapisha: Mambo vipi?
andika(2024)             // Itachapisha: 2024
```

Unaweza pia kutumia herufi maalum kama `/n` kuanza mstari mpya:

### Mfano:
```nuru
andika("Jina langu ni Amani +++/n+++ Naishi Dar es Salaam")
```

