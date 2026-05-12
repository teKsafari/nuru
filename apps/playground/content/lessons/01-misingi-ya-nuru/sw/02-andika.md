---
title: "2. Kutoa Matokeo (andika)"
task: "Tumia `andika()` kuchapisha jina lako na mji unaoishi katika mistari miwili tofauti ukitumia `/n`."
initialCode: |
  andika()
tests:
  - type: match_output
    pattern: "jina langu ni .+"
    flags: i
    message: "Lazima ujumuishe 'Jina langu ni [jina lako]'"
  - type: match_output
    pattern: "naishi .+"
    flags: i
    message: "Lazima ujumuishe 'Naishi [mji wako]'"
---
Kitendakazi cha `andika()` kinatumika kutoa taarifa au matokeo kwenye skrini. Ni njia yetu kuu ya kuzungumza na mtumiaji.

### Sifa za andika():
1. Inachukua kitu chochote (namba, maandishi, n.k.) na kukichapisha.
2. Unaweza kuandika vitu vingi kwa pamoja ukivigawa kwa mkwaju (comma `,`).
3. Kwa maandishi (tungo), lazima uyaweke ndani ya alama za nukuu `" "`.

### Mfano:
```nuru
andika(+++"Jina langu ni Amani /n Naishi Dar es Salaam"+++)
```

