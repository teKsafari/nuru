---
title: "Maoni (Comments)"
task: "Ongeza maoni ya mstari mmoja juu ya `andika()` yanayoeleza programu hii inafanya nini."
initialCode: |
  andika("Maoni hayaonekani kwenye matokeo!")
solution: |
  // Programu hii inaandika ujumbe mmoja
  andika("Maoni hayaonekani kwenye matokeo!")
tests:
  - type: match_code
    pattern: '^\s*(//|/\*)\s*\S'
    flags: m
    message: "Ongeza maoni yanayoanza na // juu ya andika()."
  - type: exact_output
    message: "Usibadilishe maandishi ya andika(). Ongeza maoni tu."
---
Maoni ni maandishi kwa ajili ya binadamu anayesoma kodi yako. Kompyuta inayaruka kabisa.

Unaweza kuandika maoni kwa njia mbili:

```nuru
+++// Maoni ya mstari mmoja yanaanza na mikwaju miwili+++

+++/* Maoni ya mistari mingi
   yanaanza na /* na kuishia na */+++

andika("Habari") +++// Maoni yanaweza kukaa mwisho wa mstari pia+++
```

Andika maoni yanayoeleza **kwa nini** umefanya kitu. Rafiki yako (au wewe mwenyewe wiki ijayo) atakushukuru.
