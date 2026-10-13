---
title: "Kuandika Matokeo (andika)"
task: "Tumia `andika()` mara moja tu kuandika mistari miwili: `Jina langu ni ...` na `Naishi ...`. Tenganisha mistari kwa `\\n`."
initialCode: |
  andika()
solution: |
  andika("Jina langu ni Amani\nNaishi Dodoma")
tests:
  - type: match_output
    pattern: 'jina langu ni \S+'
    flags: i
    message: "Mstari wa kwanza uwe 'Jina langu ni' ikifuatiwa na jina lako."
  - type: match_output
    pattern: '\n\s*naishi \S+'
    flags: i
    message: "Mstari wa pili uanze na 'Naishi' ikifuatiwa na mji wako."
  - type: match_code
    pattern: '\\n'
    message: "Tumia \\n ndani ya maandishi kuanzisha mstari mpya."
---
`andika()` ndiyo njia kuu ya programu yako kuongea na wewe. Unaweza kuandika maneno, namba, au vyote kwa pamoja:

```nuru
andika("Bei ya embe ni", 500)
```

Ukitenganisha vitu kwa koma `,`, Nuru inaweka nafasi kati yao. Mfano huu unaandika `Bei ya embe ni 500`.

### Mstari mpya

Ndani ya maandishi, alama `\n` maana yake ni "anza mstari mpya". Ni backslash `\` na herufi `n`, si `/n`.

```nuru
andika("Simba+++\n+++Yanga")
```

Matokeo yake ni:

```text
Simba
Yanga
```
