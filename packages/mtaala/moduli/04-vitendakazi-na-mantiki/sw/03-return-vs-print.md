---
title: "rudisha au andika?"
task: "Badilisha `andika` iwe `rudisha` ndani ya `zidisha`, ili `jibu` lipate thamani ya kweli."
initialCode: |
  fanya zidisha = unda(a, b) {
      andika(a * b)
  }

  fanya jibu = zidisha(3, 4)
  andika("Jibu ni:", jibu)
solution: |
  fanya zidisha = unda(a, b) {
      rudisha a * b
  }

  fanya jibu = zidisha(3, 4)
  andika("Jibu ni:", jibu)
tests:
  - type: match_code
    pattern: 'rudisha\s+a\s*\*\s*b'
    message: "Tumia rudisha a * b ndani ya zidisha."
  - type: exact_output
    message: "Programu iandike mstari mmoja tu: Jibu ni: 12"
---
Endesha programu ya mwanzo. Unaona `12` na kisha `Jibu ni: null`. Nini kimetokea?

- **`andika`** ni kwa ajili ya **binadamu**. Inaonyesha kitu kwenye skrini, basi.
- **`rudisha`** ni kwa ajili ya **programu**. Inakabidhi jibu kwa aliyeita kitendakazi, ili alihifadhi au alitumie kwenye hesabu nyingine.

```nuru
fanya mara_mbili = unda(n) {
    +++rudisha n * 2+++
}

fanya x = mara_mbili(5)
andika(x + 1) // 11
```

Kitendakazi kisichorudisha kitu kinarudisha `tupu` (null). Ndiyo sababu `jibu` lilikuwa tupu.
