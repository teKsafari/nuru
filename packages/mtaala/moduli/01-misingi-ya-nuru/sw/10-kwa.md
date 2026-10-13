---
title: "Kitanzi cha kwa"
task: "Tumia kitanzi cha `kwa` kuandika jedwali la 3 kuanzia `3 x 1 = 3` hadi `3 x 10 = 30`."
initialCode: |
  // Jedwali la 3
  andika(3, "x", 1, "=", 3 * 1)
solution: |
  // Jedwali la 3
  kwa i ktk mfululizo(1, 11) {
      andika(3, "x", i, "=", 3 * i)
  }
tests:
  - type: match_code
    pattern: 'kwa\s+\w+\s+ktk'
    message: "Tumia kitanzi cha kwa badala ya kuandika kila mstari kwa mkono."
  - type: exact_output
    message: "Jedwali linapaswa kuanzia 3 x 1 = 3 hadi 3 x 10 = 30, mstari mmoja kwa kila namba."
---
Fikiria kuandika `andika()` mara mia. Inachosha! Kitanzi kinarudia kazi ileile kwa ajili yako.

`kwa` inapitia kila kitu kwenye orodha, kimoja baada ya kingine:

```nuru
fanya wachezaji = ["Samatta", "Msuva", "Kapombe"]

+++kwa mchezaji ktk wachezaji+++ {
    andika("Karibu uwanjani,", mchezaji)
}
```

`ktk` ni kifupi cha "katika". Kila mzunguko, `mchezaji` anapata jina linalofuata.

### mfululizo()

`mfululizo()` inatengeneza orodha ya namba kwa ajili ya kitanzi:

- `mfululizo(5)` ni `[0, 1, 2, 3, 4]`
- `mfululizo(1, 6)` ni `[1, 2, 3, 4, 5]` (namba ya mwisho haihesabiwi)

```nuru
kwa i ktk +++mfululizo(1, 6)+++ {
    andika("Mzunguko", i)
}
```
