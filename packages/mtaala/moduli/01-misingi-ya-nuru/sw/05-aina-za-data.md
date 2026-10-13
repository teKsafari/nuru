---
title: "Aina za Data na Hesabu"
task: "Darasa lina safu 12 za madawati, na kila safu ina madawati 12. Tumia `*` kuandika idadi ya madawati yote."
initialCode: |
  fanya safu = 12
  fanya kwa_kila_safu = 12
  andika()
solution: |
  fanya safu = 12
  fanya kwa_kila_safu = 12
  andika(safu * kwa_kila_safu)
tests:
  - type: match_code
    pattern: '\*'
    message: "Tumia alama ya kuzidisha * badala ya kuandika jibu moja kwa moja."
  - type: exact_output
    message: "Idadi ya madawati yote inapaswa kuwa 144."
---
Kompyuta inafanya kazi na aina tofauti za data. Hizi ndizo utakazotumia mara nyingi:

- **Namba**: namba kamili, kama `25` au `-3`
- **Desimali**: namba yenye nukta, kama `2.5` au `0.75`
- **Neno**: maandishi ndani ya nukuu, kama `"Arusha"`
- **Boolean**: jibu la ndiyo au hapana, kama `kweli` au `sikweli`

Ukitaka kujua aina ya kitu, tumia `aina()`:

```nuru
andika(aina(25))       // NAMBA
andika(aina("Arusha")) // NENO
```

### Alama za hesabu

- `+` kujumlisha: `7 + 3` ni `10`
- `-` kutoa: `7 - 3` ni `4`
- `*` kuzidisha: `7 * 3` ni `21`
- `/` kugawanya: `7 / 2` ni `3.5`
- `%` baki: `7 % 3` ni `1`

```nuru
fanya wanafunzi = 45
fanya makundi = 5
andika(+++wanafunzi / makundi+++) // kila kundi lina wanafunzi 9
```
