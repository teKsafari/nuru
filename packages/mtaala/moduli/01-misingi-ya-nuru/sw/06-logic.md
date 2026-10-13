---
title: "Kulinganisha na Mantiki"
task: "Amina amepata `hisabati = 75` na `kiswahili = 48`. Andika mistari miwili: kwanza kama amefaulu masomo **yote mawili** (`&&`), kisha kama amefaulu **angalau moja** (`||`). Alama ya kufaulu ni 50."
initialCode: |
  fanya hisabati = 75
  fanya kiswahili = 48

  // Amefaulu yote mawili?
  andika()
  // Amefaulu angalau moja?
  andika()
solution: |
  fanya hisabati = 75
  fanya kiswahili = 48

  // Amefaulu yote mawili?
  andika(hisabati >= 50 && kiswahili >= 50)
  // Amefaulu angalau moja?
  andika(hisabati >= 50 || kiswahili >= 50)
tests:
  - type: match_code
    pattern: '&&'
    message: "Tumia && kuangalia kama masharti yote mawili ni kweli."
  - type: match_code
    pattern: '\|\|'
    message: "Tumia || kuangalia kama angalau sharti moja ni kweli."
  - type: exact_output
    message: "Mstari wa kwanza unapaswa kuwa sikweli, na wa pili kweli."
---
Ukilinganisha thamani mbili, jibu ni `kweli` au `sikweli`.

- `==` sawa na: `5 == 5` ni `kweli`
- `!=` si sawa na: `5 != 5` ni `sikweli`
- `>` kubwa kuliko: `8 > 3` ni `kweli`
- `<` ndogo kuliko: `8 < 3` ni `sikweli`
- `>=` kubwa au sawa na: `50 >= 50` ni `kweli`
- `<=` ndogo au sawa na: `49 <= 50` ni `kweli`

Kumbuka: `=` moja inaweka thamani kwenye kibadilika. `==` mbili inalinganisha.

### Kuunganisha masharti

- `&&` (na): kweli kama masharti **yote** ni kweli.
- `||` (au): kweli kama **angalau moja** ni kweli.
- `!` (siyo): inageuza `kweli` kuwa `sikweli`.

```nuru
fanya umri = 14
fanya ana_tiketi = kweli
andika(umri >= 12 +++&&+++ ana_tiketi) // kweli: anaweza kuingia uwanjani
```
