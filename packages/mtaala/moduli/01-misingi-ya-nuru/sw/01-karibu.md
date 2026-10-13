---
title: "Karibu Nuru!"
task: "Weka salamu yoyote ndani ya `andika()`, kwa mfano `andika(\"Habari Nuru!\")`, kisha bonyeza **Endesha**."
initialCode: |
  // Huu ni mwanzo wa safari yako!
  andika()
solution: |
  // Huu ni mwanzo wa safari yako!
  andika("Habari Nuru!")
tests:
  - type: match_code
    pattern: 'andika\(\s*"[^"]+"'
    message: "Weka maandishi ndani ya alama za nukuu, kama andika(\"Habari Nuru!\")."
  - type: match_output
    pattern: '\S'
    message: "Programu yako bado haijaandika chochote kwenye skrini."
---
Karibu! **Nuru** ni lugha ya programu inayotumia maneno ya Kiswahili. Badala ya `print` unaandika `andika`, badala ya `if` unaandika `kama`.

Programu ni orodha ya amri unazompa kompyuta. Kompyuta inazitekeleza moja baada ya nyingine, kuanzia juu kwenda chini.

Amri ya kwanza utakayojifunza ni `andika()`. Inaonyesha maandishi kwenye skrini:

```nuru
andika(+++"Habari Nuru!"+++)
```

Maandishi lazima yawe ndani ya alama za nukuu `" "`. Bila nukuu, kompyuta itadhani ni jina la kitu kingine.

Mstari unaoanza na `//` ni maoni. Kompyuta inauruka. Tutayaongelea zaidi baadaye.
